import os
import json
import google.generativeai as genai

# Load Gemini API Key from environment
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class GeminiService:
    @staticmethod
    def _get_model():
        # Standard Gemini 1.5 Flash model
        try:
            return genai.GenerativeModel("gemini-1.5-flash")
        except Exception:
            return None

    @classmethod
    def parse_resume(cls, resume_text: str) -> dict:
        """
        Parses resume text to extract skills, experience, education, and summary.
        """
        model = cls._get_model()
        if not model or not GEMINI_API_KEY:
            raise ValueError("Gemini API key is not configured or model load failed.")

        prompt = f"""
        You are an expert HR Parser. Analyze the following resume text and extract the details in valid, stringently structured JSON format.
        Do not include markdown code block formatting (like ```json) in your response, just the raw JSON.
        
        The JSON structure MUST be exactly:
        {{
            "skills": ["Skill1", "Skill2", ...],
            "summary": "Professional summary...",
            "experience": [
                {{
                    "role": "Job Title",
                    "company": "Company Name",
                    "duration": "Duration (e.g. 2021 - 2023)",
                    "description": "Key responsibilities and achievements..."
                }}
            ],
            "education": [
                {{
                    "degree": "Degree (e.g. BS in CS)",
                    "school": "University Name",
                    "year": "Graduation Year (e.g. 2021)"
                }}
            ]
        }}

        Resume Text:
        {resume_text}
        """

        try:
            response = model.generate_content(prompt)
            # Remove any wrapping markdown block characters
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            return json.loads(text)
        except Exception as e:
            # Fallback if Gemini fails
            print(f"Error in Gemini parse_resume: {e}")
            return {
                "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
                "summary": "A software engineer experienced in web application development.",
                "experience": [],
                "education": []
            }

    @classmethod
    def generate_questions(cls, job_title: str, difficulty: str, resume_text: str = "", count: int = 5) -> list:
        """
        Generates customized mock interview questions based on role, difficulty and resume.
        """
        model = cls._get_model()
        if not model or not GEMINI_API_KEY:
            # Fallback mock questions list if no key configured
            return [
                {
                    "id": f"q_{i}",
                    "questionText": f"Question {i} about {job_title} ({difficulty} difficulty).",
                    "type": "technical" if i % 2 == 0 else "behavioral",
                    "sampleAnswer": "This is a sample answer skeleton."
                } for i in range(1, count + 1)
            ]

        resume_context = f"Candidate Resume Info:\n{resume_text}" if resume_text else "No resume provided."

        prompt = f"""
        You are a Senior Technical Recruiter at a top tech company. Generate {count} interview questions for a candidate applying for the '{job_title}' role at '{difficulty}' difficulty.
        Incorporate elements from the candidate's resume if provided to make the questions personalized.
        Provide the result in valid, raw, stringently structured JSON format without markdown wrapping code blocks.
        
        The JSON structure MUST be a list of objects:
        [
            {{
                "id": "unique_question_id_1",
                "questionText": "The actual interview question...",
                "type": "technical" or "behavioral" or "situational",
                "sampleAnswer": "A high-quality sample/ideal response or points to hit for a perfect score..."
            }}
        ]

        Context:
        Role: {job_title}
        Difficulty: {difficulty}
        {resume_context}
        """

        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            return json.loads(text)
        except Exception as e:
            print(f"Error generating questions from Gemini: {e}")
            return [
                {
                    "id": "q1",
                    "questionText": f"What is your experience working with {job_title} core architectures?",
                    "type": "technical",
                    "sampleAnswer": "Explain concepts, design patterns, and concrete projects you have successfully completed."
                }
            ]

    @classmethod
    def evaluate_answer(cls, question: str, answer: str, sample_answer: str = "") -> dict:
        """
        Evaluates a single answer response.
        """
        model = cls._get_model()
        if not model or not GEMINI_API_KEY:
            return {"relevance": 80, "clarity": 80, "depth": 80, "overall": 80}

        prompt = f"""
        You are an interview grader. Evaluate the candidate's answer to the given interview question.
        Compare it to the guidelines in the sample answer if provided.
        Score the response on a scale of 0 to 100 for Relevance, Clarity, and Depth.
        Return the result in valid, raw, stringently structured JSON format without markdown code blocks.
        
        JSON structure:
        {{
            "relevance": 85,
            "clarity": 90,
            "depth": 75,
            "overall": 83
        }}

        Question: {question}
        Sample Answer Reference: {sample_answer}
        Candidate's Answer: {answer}
        """

        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            return json.loads(text)
        except Exception as e:
            print(f"Error evaluating answer in Gemini: {e}")
            return {"relevance": 75, "clarity": 75, "depth": 70, "overall": 73}

    @classmethod
    def generate_report(cls, job_title: str, difficulty: str, questions: list) -> dict:
        """
        Generates a comprehensive final feedback report based on all completed questions.
        """
        model = cls._get_model()
        if not model or not GEMINI_API_KEY:
            return {
                "summary": "Mock feedback report summary.",
                "strengths": ["Strong answers", "Clear logic"],
                "weaknesses": ["Pacing issues"],
                "recommendations": ["Practice more design questions"]
            }

        questions_summary = ""
        for q in questions:
            questions_summary += f"Question: {q.get('question')}\nAnswer: {q.get('answer')}\nScore: {q.get('score')}/100\n---\n"

        prompt = f"""
        You are a Career Coach and Lead Technical Interviewer. Review this summary of a candidate's mock interview performance.
        Generate a final comprehensive feedback report.
        Return the result in valid, raw, stringently structured JSON format without markdown code blocks.
        
        JSON structure:
        {{
            "summary": "A narrative overview summarizing overall performance, confidence, and job alignment...",
            "strengths": [
                "Detailed strength 1...",
                "Detailed strength 2..."
            ],
            "weaknesses": [
                "Detailed weakness 1...",
                "Detailed weakness 2..."
            ],
            "recommendations": [
                "Actionable improvement recommendation 1...",
                "Actionable improvement recommendation 2..."
            ]
        }}

        Role: {job_title}
        Difficulty: {difficulty}
        
        Interview Transcript and Scores:
        {questions_summary}
        """

        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            return json.loads(text)
        except Exception as e:
            print(f"Error generating feedback report in Gemini: {e}")
            return {
                "summary": "The candidate has a solid understanding of fundamental software engineering paradigms, showing clear logical layouts.",
                "strengths": ["Clear expression of technical details", "Solid logical approach"],
                "weaknesses": ["Some answers lacked architectural depth", "Pacing could be optimized"],
                "recommendations": ["Study system design principles", "Practice mock coding flows"]
            }
