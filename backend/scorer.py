import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )
    content = response.choices[0].message.content.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    return json.loads(content.strip())