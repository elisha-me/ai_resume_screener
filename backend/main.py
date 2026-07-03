from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pdf_parser import extract_text
from scorer import score_resume
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/screen")
async def screen_resumes(
    job_description: str = Form(...),
    resumes: list[UploadFile] = File(...)
):
    results = []
    for resume in resumes:
        content = await resume.read()
        text = extract_text(io.BytesIO(content))
        score_data = score_resume(job_description, text)
        results.append({
            "filename": resume.filename,
            **score_data
        })
    
    results.sort(key=lambda x: x["score"], reverse=True)
    return {"results": results}