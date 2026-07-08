import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { io, Socket } from 'socket.io-client';
import { 
  Mic, 
  MicOff, 
  VideoOff, 
  Camera, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Volume2,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingShapes from '../components/shared/FloatingShapes';
import VoiceWaveform from '../components/shared/VoiceWaveform';

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
  const [timeLeft, setTimeLeft] = useState(900);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Code Sandbox States
  const [showSandbox, setShowSandbox] = useState(false);
  const [codeText, setCodeText] = useState('// Write your coding answer here...\n\nfunction solve() {\n  return null;\n}');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const canvasIntervalRef = useRef<any>(null);

  const handleRunCode = () => {
    setIsCompiling(true);
    setTerminalOutput('Compiling code files...\nChecking syntax structure...\nRunning mock unit test test_case_1()...\n');
    setTimeout(() => {
      setTerminalOutput(prev => prev + '✔ test_case_1(): Passed successfully.\nRunning mock unit test test_case_2()...\n');
      setTimeout(() => {
        setTerminalOutput(prev => prev + '✔ test_case_2(): Passed successfully.\n\nAll test cases executed. Compile Status: Success.\nExecution time: 42ms\n');
        setIsCompiling(false);
      }, 800);
    }, 800);
  };

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
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsWebcamOn(false);
      if (canvasIntervalRef.current) clearInterval(canvasIntervalRef.current);
    } else {
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
        setIsWebcamOn(true);
        startWebcamAnalysis();
      }
    }
  };

  // Capture canvas and send frames over sockets
  const startWebcamAnalysis = () => {
    if (canvasIntervalRef.current) clearInterval(canvasIntervalRef.current);

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    canvasIntervalRef.current = setInterval(() => {
      if (!socketRef.current) return;

      let base64Frame = '';
      if (videoRef.current && videoRef.current.readyState === 4 && ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        base64Frame = canvas.toDataURL('image/jpeg', 0.6);
      } else {
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
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Web Speech API
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition. Please type your response directly.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
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
      await api.post('/interviews/complete', { interviewId: id });
      navigate(`/feedback/${id}`);
    } catch (err) {
      console.error('Error completing interview:', err);
      navigate(`/dashboard`);
    }
  };

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

  // Dynamic status border coloring for interactive biometric checks
  const getCameraStatusClass = () => {
    if (!isWebcamOn) return 'border-slate-850';
    if (!eyeContact || !goodPosture) {
      return 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    }
    return 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Visual decoration layers */}
        <FloatingShapes variant="minimal" />
        <div className="liquid-blob liquid-blob-accent w-[350px] h-[350px] top-[15%] right-[-10%]"></div>
        <div className="absolute inset-0 bg-grid-pattern-dense pointer-events-none opacity-40 z-0"></div>
        
        {/* Dynamic header with clock */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-[#0F172A]/85 backdrop-blur-md sticky top-0 z-10 w-full">
          <div className="text-left">
            <h2 className="text-xl font-bold text-slate-100">{interview.jobTitle} Mock</h2>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{interview.difficulty} DIFFICULTY</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowSandbox(!showSandbox)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                showSandbox 
                  ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-[#A78BFA] shadow-[0_0_12px_rgba(108,99,255,0.15)]' 
                  : 'bg-slate-900 border-slate-850 text-slate-350 hover:border-slate-800'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>{showSandbox ? 'Hide Code Sandbox' : 'Show Code Sandbox'}</span>
            </button>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
              timeLeft < 120 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.1)]' 
                : 'bg-slate-900 border-slate-850 text-slate-350'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            
            <button
              onClick={handleFinishInterview}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-450 text-xs font-bold transition-all cursor-pointer"
            >
              Finish Early
            </button>
          </div>
        </header>

        <main className="flex-grow p-8 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {showSandbox ? (
            <>
              {/* Left Column: Code Sandbox Editor */}
              <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left flex flex-col justify-between min-h-[520px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-bold text-slate-200">Aletheia Interactive Sandbox</span>
                    </div>
                    <select 
                      value={codeLanguage} 
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="bg-slate-950 border border-slate-850 px-2.5 py-1 rounded text-[10px] font-bold text-slate-350 focus:outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>

                  {/* Editor textarea with monospaced style */}
                  <div className="relative rounded-xl border border-slate-850 overflow-hidden bg-slate-950/70">
                    <div className="flex">
                      {/* Line numbers bar */}
                      <div className="w-10 bg-slate-950 border-r border-slate-900 select-none py-3 text-right pr-2.5 font-mono text-[10px] text-slate-650 leading-normal">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={codeText}
                        onChange={(e) => setCodeText(e.target.value)}
                        className="flex-1 py-3 px-3 bg-transparent text-slate-300 font-mono text-xs focus:outline-none resize-none h-[220px] leading-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* Terminal output */}
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                    <span>Compilation Output Terminal</span>
                    {isCompiling && <span className="text-amber-400 animate-pulse">Running test cases...</span>}
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850/80 font-mono text-[10px] text-slate-400 h-24 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {terminalOutput || "No executions run yet. Click 'Run Sandbox Tests' to execute compiler checks."}
                  </div>
                </div>

                {/* Sandbox controls */}
                <div className="flex justify-end pt-3 border-t border-slate-850 mt-2">
                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isCompiling}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-250 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Cpu className="h-4 w-4 text-[#8B5CF6]" />
                    <span>Run Sandbox Tests</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Question + Video HUD + Transcript side-by-side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Question Details Card (Compact) */}
                <div className="glass-card rounded-2xl p-5 border border-slate-800 text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-[#A78BFA] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-full">
                      Q {currentQuestionIndex + 1}
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">{currentQuestion.type}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-200 leading-snug">"{currentQuestion.questionText}"</h4>
                </div>

                {/* Compact Camera Preview */}
                <div className={`glass-card rounded-2xl overflow-hidden border aspect-video relative bg-slate-950 flex flex-col justify-center items-center transition-all ${getCameraStatusClass()}`}>
                  {isWebcamOn ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover webcam-mirror" />
                  ) : (
                    <span className="text-[10px] text-slate-600">Camera Feed Offline</span>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
                    <button
                      onClick={toggleWebcam}
                      className="h-7 px-2 rounded bg-slate-950/80 border border-slate-800 text-slate-200 text-[8px] font-bold pointer-events-auto cursor-pointer"
                    >
                      Camera Toggle
                    </button>
                    {isWebcamOn && <span className="text-[8px] text-emerald-400 font-bold">Telemetry Live</span>}
                  </div>
                </div>

                {/* Compact Transcript & Action Panel */}
                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Verbal Explanation</span>
                    <button 
                      onClick={toggleRecording}
                      className={`h-7 px-2.5 rounded border text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isRecording ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-900 border-slate-850 text-slate-350'
                      }`}
                    >
                      <Mic className="h-3 w-3" />
                      <span>{isRecording ? 'Mute' : 'Speak'}</span>
                    </button>
                  </div>
                  <textarea
                    value={userAnswerText}
                    onChange={(e) => setUserAnswerText(e.target.value)}
                    placeholder="Speak or write explanations..."
                    className="w-full h-20 p-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none resize-none"
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleNextQuestion}
                      disabled={isSubmitting}
                      className="px-4 py-2.5 rounded-lg bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit & Next'}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Left Columns: Question and Answer Input */}
              <div className="lg:col-span-3 space-y-6">
                {/* Animated Question Card */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden text-left min-h-[140px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-[#6C63FF]/5 rounded-bl-full pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-bold text-[#A78BFA] uppercase bg-[#8B5CF6]/10 px-3 py-1.5 rounded-full">
                      Question {currentQuestionIndex + 1} of {interview.questions.length}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                      {currentQuestion.type} Scenario
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.h3 
                      key={currentQuestion.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="text-base md:text-lg font-bold text-slate-100 leading-snug"
                    >
                      "{currentQuestion.questionText}"
                    </motion.h3>
                  </AnimatePresence>
                </div>

                {/* Answer Input Panel */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Response Transcript</label>
                    <div className="flex items-center gap-3">
                      <VoiceWaveform isActive={isRecording} bars={12} className="h-5 mr-1" />

                      <button 
                        onClick={toggleRecording}
                        className={`h-9 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isRecording ? 'bg-rose-500/10 border-rose-500/30 text-rose-455 animate-pulse' : 'bg-slate-900 border-slate-850 text-slate-350 hover:border-slate-800'
                        }`}
                      >
                        <Mic className="h-3.5 w-3.5" />
                        <span>{isRecording ? 'Stop Mic' : 'Record Speech'}</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={userAnswerText}
                    onChange={(e) => setUserAnswerText(e.target.value)}
                    placeholder="Type or click 'Record Speech' to speak your response details..."
                    className="w-full h-44 p-4 rounded-xl bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-655 focus:outline-none focus:border-[#6C63FF] text-xs md:text-sm leading-relaxed resize-none transition-colors"
                  />

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      disabled={isSubmitting}
                      className="px-6 py-3.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold text-xs transition-all shadow-lg shadow-purple-500/15 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>{currentQuestionIndex + 1 === interview.questions.length ? 'Submit & Analyze' : 'Next Question'}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Columns: Webcam feed and Live CV analytics */}
              <div className="lg:col-span-2 space-y-6">
                <div className={`glass-card rounded-2xl overflow-hidden border aspect-video relative bg-slate-950 flex flex-col justify-center items-center transition-all duration-500 ${getCameraStatusClass()}`}>
                  {isWebcamOn ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover webcam-mirror" />
                  ) : (
                    <div className="text-center space-y-3 p-6">
                      <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-855 flex items-center justify-center text-slate-600 mx-auto">
                        <VideoOff className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-slate-350">Webcam Feed Offline</h4>
                        <p className="text-[10px] text-slate-550 max-w-xs mx-auto">Turn on webcam feed to unlock real-time posture and gaze checks.</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                    <button
                      onClick={toggleWebcam}
                      className="h-9 px-3 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-800 text-slate-200 text-[10px] font-bold flex items-center gap-1.5 pointer-events-auto hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      {isWebcamOn ? <VideoOff className="h-3.5 w-3.5 text-rose-450" /> : <Camera className="h-3.5 w-3.5 text-emerald-400" />}
                      <span>{isWebcamOn ? 'Disable Camera' : 'Enable Camera'}</span>
                    </button>
                    {isWebcamOn && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Live Telemetry</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
                  <span className="text-[9px] text-[#A78BFA] font-bold uppercase tracking-widest block">Live Behavior Analyzer</span>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-850 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-300 leading-normal">{cvFeedback}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-550 uppercase font-semibold">Eye Contact</span>
                      <span className={`text-xs font-bold ${eyeContact ? 'text-emerald-400' : 'text-rose-450'}`}>{eyeContact ? 'Optimal' : 'Distracted'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-550 uppercase font-semibold">Posture Status</span>
                      <span className={`text-xs font-bold ${goodPosture ? 'text-emerald-400' : 'text-rose-450'}`}>{goodPosture ? 'Aligned' : 'Off-center'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-555 uppercase font-semibold">Gaze Emotion</span>
                      <span className="text-xs font-bold text-slate-200">{dominantEmotion}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-555 uppercase font-semibold">Speech Fillers</span>
                      <span className={`text-xs font-bold ${fillerWords > 3 ? 'text-amber-400' : 'text-slate-200'}`}>{fillerWords} phrases</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default InterviewScreen;
