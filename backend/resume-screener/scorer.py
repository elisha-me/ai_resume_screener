import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")  # free tier

def score_resume(job_description: str, resume_text: str) -> dict:
    prompt = f"""
    You are an expert recruiter. Given the job description and resume below,
    return a JSON object with:
    - score: integer 0-100 (fit score)
    - matching_skills: list of skills present in both
    - missing_skills: list of skills in JD but not in resume
    - summary: 2-line candidate summary

    Job Description:
    {job_description}

    Resume:
    {resume_text}

    Return ONLY valid JSON, no extra text.
    """
    response = model.generate_content(prompt)
    import json
    return json.loads(response.text)