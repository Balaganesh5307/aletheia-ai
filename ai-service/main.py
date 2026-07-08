import os
import re
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from services.gemini_service import GeminiService
from services.audio_service import AudioService
from services.video_service import VideoService

app = FastAPI(title="InterviewIQ AI - ML Service", version="1.0.0")

# CORS Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class QuestionRequest(BaseModel):
    job_title: str
    difficulty: str
    resume_text: Optional[str] = ""
    count: Optional[int] = 5

class AnswerRequest(BaseModel):
    question: str
    answer: str
    sample_answer: Optional[str] = ""

class ReportRequest(BaseModel):
    job_title: str
    difficulty: str
    questions: List[dict] # {question: str, answer: str, score: int}

class FrameRequest(BaseModel):
    frame: str # base64 string

# Routes
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "gemini_configured": bool(os.environ.get("GEMINI_API_KEY")),
        "cv_libs": VideoService.test_cv_libs()
    }

@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parses resume upload and extracts structured JSON context.
    """
    try:
        content = await file.read()
        
        # Simple extraction of text content from document (PDF/TXT)
        # In a full-blown deployment, we'd use pypdf or pdfplumber.
        # Let's extract all printable ASCII/UTF-8 strings as a fallback
        try:
            raw_text = content.decode("utf-8", errors="ignore")
        except Exception:
            raw_text = ""

        # If raw_text is empty or too short, run a clean regex extractor on binary bytes
        if len(raw_text.strip()) < 100:
            # Extract plain letters/numbers/spaces from PDF/Doc binary stream
            ascii_chars = re.findall(r'[a-zA-Z0-9\s\.,\-\:\@\(\)\'\"]', content.decode('latin1', errors='ignore'))
            raw_text = "".join(ascii_chars)
            # Remove duplicate multi-whitespaces
            raw_text = re.sub(r'\s+', ' ', raw_text)[:8000]

        if not raw_text.strip():
            raw_text = f"Candidate Resume Name: {file.filename}. Skills: React, Node.js, TypeScript."

        # Process text using Gemini
        parsed_result = GeminiService.parse_resume(raw_text)

        return {
            "filename": file.filename,
            "raw_text": raw_text[:3000],
            "parsed": parsed_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume parsing failed: {str(e)}")

@app.post("/api/generate-questions")
def generate_questions(req: QuestionRequest):
    try:
        questions = GeminiService.generate_questions(
            job_title=req.job_title,
            difficulty=req.difficulty,
            resume_text=req.resume_text,
            count=req.count
        )
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/evaluate-answer")
def evaluate_answer(req: AnswerRequest):
    try:
        scores = GeminiService.evaluate_answer(
            question=req.question,
            answer=req.answer,
            sample_answer=req.sample_answer
        )
        return scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-report")
def generate_report(req: ReportRequest):
    try:
        report = GeminiService.generate_report(
            job_title=req.job_title,
            difficulty=req.difficulty,
            questions=req.questions
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-frame")
def analyze_frame(req: FrameRequest):
    try:
        feedback = VideoService.analyze_frame(req.frame)
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
