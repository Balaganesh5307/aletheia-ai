import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { io, Socket } from 'socket.io-client';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Camera, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  AlertTriangle,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IQuestion {
  id: string;
  questionText: string;
  type: string;
}

interface IInterview {
  _id: string;
  jobTitle: string;
  difficulty: string;
  durationLimit: number;
  questions: IQuestion[];
}

const InterviewScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<IInterview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  
  // Webcam & Audio Recording States
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Real-time CV logs
  const [cvFeedback, setCvFeedback] = useState('Position your camera and speak clearly.');
  const [dominantEmotion, setDominantEmotion] = useState('Neutral');
  const [eyeContact, setEyeContact] = useState(true);
  const [goodPosture, setGoodPosture] = useState(true);
  const [fillerWords, setFillerWords] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(900); // 15 min defaults
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const canvasIntervalRef = useRef<any>(null);

  // Load Interview Details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data);
        setTimeLeft(res.data.durationLimit * 60);
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  // Connect WebSockets
  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Sockets linked for interview room:', socket.id);
      socket.emit('join-interview', id);
    });

    socket.on('frame-feedback', (data: any) => {
      setCvFeedback(data.feedbackMessage);
      setDominantEmotion(data.dominantEmotion);
      setEyeContact(data.eyeContact);
      setGoodPosture(data.goodPosture);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (canvasIntervalRef.current) clearInterval(canvasIntervalRef.current);
    };
  }, [id]);

  // Timer Tick
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  // Webcam Start/Stop
  const toggleWebcam = async () => {
    if (isWebcamOn) {
      // Turn off
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsWebcamOn(false);
      if (canvasIntervalRef.current) clearInterval(canvasIntervalRef.current);
    } else {
      // Turn on
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsWebcamOn(true);
        startWebcamAnalysis();
      } catch (err) {
        console.error('Camera access denied:', err);
        alert('Could not access camera. Simulation mode enabled.');
        setIsWebcamOn(true); // Fallback mock state
        startWebcamAnalysis();
      }
    }
  };

  // Capture canvas and send frames over sockets
  const startWebcamAnalysis = () => {
    if (canvasIntervalRef.current) clearInterval(canvasIntervalRef.current);

    const canvas = document.createElement('canvas');
    canvas.width = 160; // downscale for socket efficiency
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    canvasIntervalRef.current = setInterval(() => {
      if (!socketRef.current) return;

      let base64Frame = '';
      if (videoRef.current && videoRef.current.readyState === 4 && ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        base64Frame = canvas.toDataURL('image/jpeg', 0.6);
      } else {
        // Mock black canvas frame to simulate processing
        if (ctx) {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          base64Frame = canvas.toDataURL('image/jpeg');
        }
      }

      if (base64Frame) {
        socketRef.current.emit('video-frame', {
          interviewId: id,
          frame: base64Frame
        });
      }
    }, 3000); // Check frame every 3s
  };

  // Stop tracks on component unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Web Speech API configuration
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition. Please type your response directly.');
      return;
    }

    if (isRecording) {
      // Stop
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (e: any) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setUserAnswerText(transcript);
        
        // Count filler words um/like/uh dynamically
        const matches = transcript.toLowerCase().match(/\b(um|like|uh|actually|basically)\b/g);
        if (matches) {
          setFillerWords(matches.length);
        }
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleNextQuestion = async () => {
    if (!interview) return;
    setIsSubmitting(true);
    
    const currentQuestion = interview.questions[currentQuestionIndex];
    
    try {
      await api.post('/interviews/answer', {
        interviewId: id,
        questionId: currentQuestion.id,
        userAnswer: userAnswerText || "I've described my relevant experiences working with backend logic and frontend templates.",
        transcript: userAnswerText,
        behavioralData: {
          eyeContactScore: eyeContact ? 90 : 40,
          goodPosturePercentage: goodPosture ? 95 : 50,
          dominantEmotion: dominantEmotion,
          fillerWordsCount: fillerWords
        }
      });

      setUserAnswerText('');
      setFillerWords(0);

      if (currentQuestionIndex + 1 < interview.questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        await handleFinishInterview();
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishInterview = async () => {
    try {
      const response = await api.post('/interviews/complete', { interviewId: id });
      const report = response.data.report;
      navigate(`/feedback/${id}`);
    } catch (err) {
      console.error('Error completing interview:', err);
      // Fallback
      navigate(`/dashboard`);
    }
  };

  // Convert seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (loading || !interview) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin"></div>
          <span>Loading interview environment...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Dynamic header with clock */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-[#0F172A]/85 backdrop-blur-md sticky top-0 z-10 w-full">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{interview.jobTitle} Mock</h2>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">{interview.difficulty} DIFFICULTY</span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-colors ${
              timeLeft < 120 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            
            <button
              onClick={handleFinishInterview}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all"
            >
              Finish Early
            </button>
          </div>
        </header>

        <main className="flex-grow p-8 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Left Columns: Question and Answer Input */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Question Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-[#6C63FF]/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-[#A78BFA] uppercase bg-[#8B5CF6]/10 px-3 py-1 rounded-full">
                  Question {currentQuestionIndex + 1} of {interview.questions.length}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Type: {currentQuestion.type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-100 leading-snug">
                {currentQuestion.questionText}
              </h3>
            </div>

            {/* Answer Input Panel */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Response Transcript</label>
                <div className="flex items-center gap-2">
                  {/* Microphone Recorder toggle */}
                  <button 
                    onClick={toggleRecording}
                    className={`h-9 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>{isRecording ? 'Stop Recording' : 'Record Speech'}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                placeholder="Type or click 'Record Speech' to speak your response details..."
                className="w-full h-44 p-4 rounded-xl bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] text-sm leading-relaxed resize-none transition-colors"
              />

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  disabled={isSubmitting}
                  className="px-6 py-3.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/15 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{currentQuestionIndex + 1 === interview.questions.length ? 'Submit & Grade' : 'Next Question'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Columns: Webcam feed and Live CV analytics */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Webcam Preview Container */}
            <div className="glass-card rounded-2xl overflow-hidden border border-slate-850 aspect-video relative bg-slate-950 flex flex-col justify-center items-center">
              {isWebcamOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover webcam-mirror"
                />
              ) : (
                <div className="text-center space-y-3 p-6">
                  <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <VideoOff className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-300">Webcam stream is offline</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Turn on webcam feed to unlock real-time posture and gaze reviews.</p>
                  </div>
                </div>
              )}

              {/* Webcam Control HUD overlays */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                <button
                  onClick={toggleWebcam}
                  className="h-9 px-3 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 pointer-events-auto hover:bg-slate-900 transition-colors"
                >
                  {isWebcamOn ? <VideoOff className="h-3.5 w-3.5 text-rose-400" /> : <Camera className="h-3.5 w-3.5 text-emerald-400" />}
                  <span>{isWebcamOn ? 'Disable Camera' : 'Enable Camera'}</span>
                </button>

                {isWebcamOn && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Live Tracking</span>
                  </span>
                )}
              </div>
            </div>

            {/* Live CV Feedback panel */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <span className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-wider block">Live Behavior Analyzer</span>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-850 flex items-start gap-3">
                <Volume2 className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-normal">{cvFeedback}</p>
              </div>

              {/* Behavior Indicators Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Eye Contact */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Eye Contact</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${eyeContact ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {eyeContact ? 'Optimal' : 'Distracted'}
                    </span>
                  </div>
                </div>

                {/* Posture */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Posture Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${goodPosture ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {goodPosture ? 'Aligned' : 'Off-center'}
                    </span>
                  </div>
                </div>

                {/* Emotion */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Gaze Emotion</span>
                  <span className="text-sm font-bold text-slate-200">{dominantEmotion}</span>
                </div>

                {/* Filler words */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Speech Fillers</span>
                  <span className={`text-sm font-bold ${fillerWords > 3 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {fillerWords} phrases
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewScreen;
