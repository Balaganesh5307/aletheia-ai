# InterviewIQ AI

> **Practice. Analyze. Improve. Get Hired.**

InterviewIQ AI is a production-quality, dark-themed SaaS mock interview simulator. It leverages **Google Gemini 1.5 Flash** for natural language answer assessment and **OpenCV / MediaPipe / DeepFace** for webcam behavioral checks (gaze direction, posture, and facial confidence).

---

## 🚀 Key Features

- **Gamified Auth Platform**: Full login/signup workflow with achievements and profile progression indicators.
- **Smart Resume Parsing**: Extract skills and experience with Google Gemini to dynamically formulate custom technical mock questions.
- **Real-Time Webcam Analysis**: WebSocket-based CV engine tracking shoulder alignment (posture) and iris/camera offset (eye contact).
- **Cognitive Answer Grading**: Detailed rubrics measuring answer relevance, structure, clarity, and tech accuracy.
- **Graphical Progress Charts**: Comprehensive visual dashboard using Recharts Radar and progression lines.

---

## 🛠 Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS v4
- Framer Motion (Micro-animations)
- Recharts (Progress diagrams)
- Axios (REST clients)
- Socket.io-client (Real-time feeds)

### Backend
- Node.js & Express
- TypeScript
- MongoDB (Mongoose Schema)
- Socket.io (Bi-directional frame transmission)
- Multer (Document uploads)
- JWT Authentication

### AI/ML Service
- Python 3.10+ & FastAPI
- Google Generative AI (Gemini API)
- MediaPipe (Face mesh / Gaze & Pose detection)
- DeepFace (Emotion parsing)
- OpenCV (Frame decoding)

---

## 📦 Getting Started

### 1. Configure Environments

Create a `.env` configuration file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/interview-iq
JWT_SECRET=supersecret_interview_iq_key
AI_SERVICE_URL=http://127.0.0.1:8000
```

Set the Gemini API key in your terminal before running the AI service:
```bash
# Windows
set GEMINI_API_KEY="AIzaSy..."

# Mac/Linux
export GEMINI_API_KEY="AIzaSy..."
```

---

### 2. Boot Locally

#### A. Run Express Backend
```bash
cd backend
npm install
npm run dev
```
Serves on `http://localhost:5000`.

#### B. Run Python ML Service
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```
Serves on `http://localhost:8000`.

#### C. Run Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
Serves on `http://localhost:3000`.

---

## 🐳 Run with Docker

To build and run all services (including MongoDB) simultaneously:

```bash
docker-compose up --build
```
Ensure you pass the `GEMINI_API_KEY` as a environment variable or define it in a root `.env` file before executing compose commands.