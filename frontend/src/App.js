import { useState } from "react";
import axios from "axios";

function ResultCard({ candidate }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.filename}>{candidate.filename}</h3>
        <span style={styles.score}>{candidate.score}/100</span>
      </div>
      <p style={styles.summary}>{candidate.summary}</p>
      <div style={styles.skills}>
        <p><span style={styles.green}>✅ Matching: </span>{candidate.matching_skills.join(", ")}</p>
        <p><span style={styles.red}>❌ Missing: </span>{candidate.missing_skills.join(", ")}</p>
      </div>
    </div>
  );
}

function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!jobDesc || files.length === 0) {
      setError("Please enter a job description and upload at least one resume.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("job_description", jobDesc);
      files.forEach(f => formData.append("resumes", f));

      const res = await axios.post("http://localhost:8000/screen", formData);
      setResults(res.data.results);
    } catch (err) {
      setError("Something went wrong. Make sure your backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🤖 AI Resume Screener</h1>
      <p style={styles.subtitle}>Paste a job description, upload resumes, and let AI rank the candidates.</p>

      <textarea
        style={styles.textarea}
        placeholder="Paste job description here..."
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
        rows={6}
      />

      <input
        type="file"
        accept=".pdf"
        multiple
        style={styles.fileInput}
        onChange={e => setFiles(Array.from(e.target.files))}
      />

      {files.length > 0 && (
        <p style={styles.fileCount}>📎 {files.length} resume(s) selected</p>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.button} onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Screen Resumes"}
      </button>

      {results.length > 0 && (
        <div>
          <h2 style={styles.resultsTitle}>Results — Ranked by Fit</h2>
          {results.map((r, i) => <ResultCard key={i} candidate={r} />)}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { color: "#666", marginBottom: 24 },
  textarea: { width: "100%", padding: 12, fontSize: 14, borderRadius: 8, border: "1px solid #ddd", resize: "vertical", boxSizing: "border-box" },
  fileInput: { marginTop: 16, display: "block" },
  fileCount: { color: "#555", marginTop: 8 },
  error: { color: "red", marginTop: 8 },
  button: { marginTop: 16, padding: "12px 24px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer", width: "100%" },
  resultsTitle: { marginTop: 32, marginBottom: 16, fontSize: 22 },
  card: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  filename: { margin: 0, fontSize: 16 },
  score: { fontSize: 24, fontWeight: "bold", color: "#2563eb" },
  summary: { color: "#555", margin: "8px 0" },
  skills: { fontSize: 14 },
  green: { color: "green", fontWeight: "bold" },
  red: { color: "red", fontWeight: "bold" },
};

export default App;