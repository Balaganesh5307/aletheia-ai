import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LottieAnimation from '../components/shared/LottieAnimation';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  Video, 
  FileText, 
  Activity, 
  Award, 
  CheckCircle,
  Zap,
  HelpCircle,
  ChevronDown,
  Play,
  Volume2,
  Lock,
  Cpu,
  Monitor,
  Eye,
  Sliders,
  Check,
  RefreshCw
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'camera' | 'gemini' | 'analytics'>('resume');

  // Interactive Mock Playground State
  const [demoState, setDemoState] = useState<'idle' | 'question' | 'recording' | 'feedback'>('idle');
  const [selectedRole, setSelectedRole] = useState('Frontend Engineer');
  const [selectedDiff, setSelectedDiff] = useState('Mid');
  const [demoTimer, setDemoTimer] = useState(120);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [mockPosture, setMockPosture] = useState<'Aligned' | 'Off-center'>('Aligned');
  const [mockGaze, setMockGaze] = useState<'Optimal' | 'Distracted'>('Optimal');

  // Timer Tick during simulated recording
  useEffect(() => {
    let interval: any = null;
    if (demoState === 'recording' && demoTimer > 0) {
      interval = setInterval(() => {
        setDemoTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [demoState, demoTimer]);

  const demoQuestions: Record<string, string> = {
    'Frontend Engineer': "Explain how you would optimize a React 19 app that has large lists experiencing performance lags.",
    'Backend Engineer': "How do you handle database deadlocks and race conditions in a high-concurrency Node.js gateway?",
    'AI/ML Architect': "What parameters do you check when deploying a MediaPipe or Whisper pipeline to a serverless node?"
  };

  const sampleAnswer = "To optimize rendering lag, I would implement virtualization techniques (like windowing), lazy-load heavy elements using React Suspense, and avoid inline function declarations in dependencies to prevent unnecessary reconciliation checks.";

  // Typewriter simulated speech transcription
  const startRecordingDemo = () => {
    setDemoState('recording');
    setDemoTimer(60);
    setTypedAnswer('');
    
    let words = sampleAnswer.split(' ');
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        setTypedAnswer(prev => prev + (prev ? ' ' : '') + words[currentIdx]);
        currentIdx++;
        // Randomly simulate posture changes during speaking
        if (currentIdx % 8 === 0) {
          setMockPosture(Math.random() > 0.3 ? 'Aligned' : 'Off-center');
          setMockGaze(Math.random() > 0.2 ? 'Optimal' : 'Distracted');
        }
      } else {
        clearInterval(interval);
      }
    }, 180);
  };

  const features = [
    {
      id: 'resume',
      title: 'AI Resume Intelligence',
      subtitle: 'Smart Profile Ingestion',
      description: 'Upload your CV and let Google Gemini extract framework proficiencies, experience depth, and custom quiz topics.',
      icon: FileText,
      color: '#6C63FF'
    },
    {
      id: 'camera',
      title: 'Interactive Telemetry',
      subtitle: 'Real-time Eye & Body Tracking',
      description: 'Our webcam sub-modules map face landmarks to keep check of eye-contact stability and seated shoulder alignment.',
      icon: Video,
      color: '#8B5CF6'
    },
    {
      id: 'gemini',
      title: 'Gemini Answer Grading',
      subtitle: 'Cognitive Response Rubrics',
      description: 'Grading metrics measuring relevance, response clarity, and overall technical accuracy compared with top rubrics.',
      icon: Activity,
      color: '#06B6D4'
    },
    {
      id: 'analytics',
      title: 'Dashboard Progression',
      subtitle: 'Achievements & Score Trends',
      description: 'Compare scores, track filler words frequency, and follow development advice charted in your dashboard.',
      icon: Award,
      color: '#F59E0B'
    }
  ];

  const pricing = [
    {
      name: 'Starter Plan',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      description: 'Explore the foundations of AI mock interviewing',
      features: ['2 Mock Interviews / month', 'Basic resume scoring', 'Text answers feedback', 'Standard analytics dashboard'],
      isPopular: false,
      cta: 'Get Started for Free',
      action: () => navigate('/register')
    },
    {
      name: 'Professional Pro',
      monthlyPrice: '$29',
      yearlyPrice: '$23',
      description: 'The ultimate toolkit for active job seekers',
      features: ['Unlimited Mock Interviews', 'Advanced Resume Parsing', 'Real-time eye & emotion analytics', 'Full AI Feedback Report', 'Custom role generation', 'Export PDF insights'],
      isPopular: true,
      cta: 'Upgrade to Pro Now',
      action: () => navigate('/register')
    }
  ];

  const faqs = [
    {
      q: "How does the webcam behavioral tracker work?",
      a: "Our system uses MediaPipe and OpenCV directly inside your browser and AI service. It measures the alignment of your shoulders and the offset coordinates of your iris relative to the center of the camera to check eye contact and posture, sending real-time feedback cues."
    },
    {
      q: "What AI models analyze my verbal content?",
      a: "We process your recorded answer audios using OpenAI Whisper for high-accuracy text transcription, which is then analyzed by Google Gemini 1.5 Flash models to grade answer depth, semantic relevance, and domain technical correctness."
    },
    {
      q: "Is my personal resume data kept private?",
      a: "Yes. All resumes uploaded to Aletheia AI are encrypted at rest and scoped strictly to your user profile. We never train public machine learning models on your uploaded CVs."
    },
    {
      q: "Can I customize the job role and difficulty?",
      a: "Absolutely. You can choose from pre-set engineering and management tracks, or type in a specific target role. The AI recruiter will tailor technical scenarios dynamically from Entry to Lead Architect levels."
    }
  ];

  const logos = ['Google', 'Stripe', 'Meta', 'Netflix', 'Linear', 'Uber'];

  return (
    <div className="bg-[#0F172A] text-[#F8FAFC] min-h-screen relative overflow-hidden font-sans scroll-smooth">
      {/* Grid Pattern Guide Overlay */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0"></div>

      {/* Background ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#6C63FF]/8 blur-[130px] pointer-events-none animate-float-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/8 blur-[130px] pointer-events-none animate-float-blob-delayed"></div>

      {/* Header bar */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/40 relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">
            Aletheia<span className="text-[#6C63FF]"> AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-90 transition-all font-semibold text-sm text-white shadow-lg shadow-purple-500/20 glow-btn cursor-pointer"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors text-sm cursor-pointer">
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-90 transition-all font-semibold text-sm text-white shadow-lg shadow-purple-500/20 glow-btn cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Tagline & Intro */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#A78BFA] text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Version 2.0: Interactive Sandbox Console</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-left">
              Practice. Analyze. Improve. <br />
              <span className="text-gradient">Get Hired.</span>
            </h1>
            
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl font-normal text-left">
              Aletheia AI is the world's most advanced Mock Interview simulator. Tailor scenarios with your resume, practice live webcam body posture reviews, and get graded on verbal pacing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Launch Mock Interview</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <a 
                href="#interactive-features"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/30 text-slate-200 font-bold transition-all text-sm flex items-center justify-center"
              >
                Interactive Walkthrough
              </a>
            </div>
          </div>

          {/* Right Column: Hero AI Mock Sandbox Console */}
          <div className="lg:col-span-6">
            <div className="glass-card rounded-2xl p-6 border border-slate-850 shadow-2xl relative bg-slate-900/50 flex flex-col min-h-[440px] justify-between">
              {/* Header block */}
              <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">Aletheia Mock Simulator</span>
                <span className="text-[10px] text-[#A78BFA] font-bold">Interactive Sandbox</span>
              </div>

              {/* State A: Idle Selection */}
              {demoState === 'idle' && (
                <div className="space-y-4 flex-grow flex flex-col justify-center text-left">
                  <div className="h-20 w-full mb-1 flex items-center justify-center pointer-events-none">
                    <LottieAnimation src="https://assets5.lottiefiles.com/packages/lf20_q5pk6hy1.json" className="max-h-full max-w-[140px]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">Configure Sandbox Parameters</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Select a role and launch our mini mockup generator to test core widgets.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Job Role</label>
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-350 text-xs focus:outline-none"
                      >
                        <option value="Frontend Engineer">Frontend Engineer</option>
                        <option value="Backend Engineer">Backend Engineer</option>
                        <option value="AI/ML Architect">AI/ML Architect</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Difficulty</label>
                      <select 
                        value={selectedDiff}
                        onChange={(e) => setSelectedDiff(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-350 text-xs focus:outline-none"
                      >
                        <option value="Entry">Entry</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => setDemoState('question')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-95 font-bold text-xs text-white transition-all shadow-md shadow-purple-500/10 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Start Mock Simulator</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* State B: Displaying Question */}
              {demoState === 'question' && (
                <div className="space-y-6 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <span className="text-[10px] text-[#A78BFA] font-bold uppercase bg-[#8B5CF6]/10 px-2.5 py-1 rounded-full w-max block">
                      Generated Scenario ({selectedDiff})
                    </span>
                    <h4 className="font-bold text-sm text-slate-200 leading-snug">
                      "{demoQuestions[selectedRole] || demoQuestions['Frontend Engineer']}"
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Click the trigger below to simulate speech input. The keyboard simulator will write a high-quality candidate response.
                    </p>
                  </div>

                  <button
                    onClick={startRecordingDemo}
                    className="w-full py-3 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] font-bold text-xs text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/15"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Trigger Audio Input</span>
                  </button>
                </div>
              )}

              {/* State C: Recording/Equalizing Animation */}
              {demoState === 'recording' && (
                <div className="space-y-4 flex-grow flex flex-col justify-between text-left">
                  {/* Webcam preview mock */}
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2 aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-850 flex items-center justify-center relative">
                      {webcamEnabled ? (
                        <div className="w-full h-full bg-[#6C63FF]/5 flex items-center justify-center text-xs text-[#A78BFA] font-semibold animate-pulse">
                          <span>Webcam live feed</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setWebcamEnabled(true)}
                          className="h-8 px-2.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-350 hover:bg-slate-850 pointer-events-auto"
                        >
                          Enable webcam
                        </button>
                      )}
                    </div>
                    <div className="col-span-3 text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Posture Alignment:</span>
                        <span className={`font-bold ${mockPosture === 'Aligned' ? 'text-emerald-400' : 'text-rose-400'}`}>{mockPosture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Gaze Focus:</span>
                        <span className={`font-bold ${mockGaze === 'Optimal' ? 'text-emerald-400' : 'text-rose-400'}`}>{mockGaze}</span>
                      </div>
                    </div>
                  </div>

                  {/* Speech input panel */}
                  <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-850 h-28 overflow-y-auto text-[11px] text-slate-300 italic scrollbar-thin">
                    {typedAnswer || "Listening and transcribing..."}
                  </div>

                  {/* Equalizer animation */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 h-6 items-end">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(bar => (
                        <motion.div
                          key={bar}
                          animate={{ height: [4, 20, 4] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: bar * 0.1 }}
                          className="w-1 bg-[#8B5CF6] rounded-full"
                          style={{ height: '4px' }}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setDemoState('feedback')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] font-bold text-xs text-white transition-all cursor-pointer flex items-center gap-1 shadow"
                    >
                      <span>Grade Answer</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* State D: Feedback Scoring Report */}
              {demoState === 'feedback' && (
                <div className="space-y-4 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-400/10 px-2.5 py-1 rounded-full w-max block">
                      Evaluation Complete
                    </span>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-850 text-center">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Mock IQ</span>
                        <span className="text-lg font-extrabold text-white">84</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-850 text-center">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Pacing</span>
                        <span className="text-sm font-bold text-slate-200">125 WPM</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-850 text-center">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Posture</span>
                        <span className="text-sm font-bold text-emerald-400">92%</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-850 space-y-1 text-[10px]">
                      <span className="font-bold text-[#A78BFA]">Career Coach Recommendation:</span>
                      <p className="text-slate-400 leading-normal">
                        Your answer covered key virtual DOM concepts accurately, but pacing fluctuated. Try reducing filler words by slowing down your speech by 10%.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDemoState('idle');
                      setTypedAnswer('');
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 font-bold text-xs text-slate-350 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Restart Sandbox Demo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SVG Company Logo Ticker */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-y border-slate-800/40 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500">
          <span className="text-xs font-bold uppercase tracking-widest">Our alumni secure roles at leading teams</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <span key={logo} className="font-extrabold text-sm tracking-wider hover:text-slate-300 transition-colors cursor-default select-none">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tabs Features Walkthrough */}
      <section id="interactive-features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Interactive Platform Walkthrough</h2>
          <p className="text-slate-400 text-sm">Select any capability tab below to preview how our modules integrate dynamically.</p>
        </div>

        {/* Tab Switcher Headers */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-10">
          {features.map((feat) => (
            <button
              key={feat.id}
              onClick={() => setActiveTab(feat.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === feat.id 
                  ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 border-[#6C63FF] text-[#A78BFA] shadow'
                  : 'bg-slate-900/50 border-slate-850 text-slate-450 hover:border-slate-800'
              }`}
            >
              <span>{feat.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Preview Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-8 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left"
            >
              {/* Left Column: Descriptions */}
              <div className="space-y-4">
                <span className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-widest block">
                  {features.find(f => f.id === activeTab)?.subtitle}
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {features.find(f => f.id === activeTab)?.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {features.find(f => f.id === activeTab)?.description}
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => navigate('/register')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:underline font-bold"
                  >
                    <span>Get started with this feature</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Component mockup */}
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-850 p-4 min-h-[220px] flex flex-col justify-between">
                
                {activeTab === 'resume' && (
                  <div className="space-y-3">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Extracted Skill Profiles</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['React', 'TypeScript', 'Node.js', 'Tailwind', 'MongoDB', 'Docker', 'FastAPI'].map(s => (
                        <span key={s} className="px-2.5 py-1 rounded bg-[#6C63FF]/10 border border-[#6C63FF]/25 text-[#A78BFA] text-[10px] font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-850/80 text-[10px] text-slate-400">
                      <strong>AI Summary:</strong> Experience building fullstack dashboards, backend express integrations, and docker pipelines.
                    </div>
                  </div>
                )}

                {activeTab === 'camera' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Biometric Telemetry</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 bg-slate-900 rounded border border-slate-850">
                        <span className="text-slate-500 block">Posture:</span>
                        <span className="font-bold text-emerald-400">Aligned (Correct)</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-850">
                        <span className="text-slate-500 block">Eye Contact:</span>
                        <span className="font-bold text-emerald-400">Optimal ( g. camera)</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded text-[9px] text-slate-450 italic">
                      "Sit straight, look directly at the webcam container."
                    </div>
                  </div>
                )}

                {activeTab === 'gemini' && (
                  <div className="space-y-3 text-[10px]">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Grading Rubric Breakdown</span>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Technical Accuracy</span>
                          <span className="font-bold text-white">88%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full"><div className="bg-[#6C63FF] h-full rounded-full" style={{ width: '88%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Relevance Depth</span>
                          <span className="font-bold text-white">82%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full"><div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: '82%' }}></div></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-3 text-[10px]">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Score Trend Chart Preview</span>
                    <div className="flex items-end justify-between h-20 pt-4 px-2 border-b border-slate-900">
                      {[40, 60, 55, 75, 84].map((h, i) => (
                        <div key={i} className="w-6 bg-[#8B5CF6] rounded-t" style={{ height: `${h}%` }}>
                          <span className="text-[7px] text-slate-400 block -mt-4 text-center">{h}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-650 px-1">
                      <span>Session 1</span>
                      <span>Session 2</span>
                      <span>Session 3</span>
                      <span>Session 4</span>
                      <span>Session 5</span>
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-slate-650 border-t border-slate-900 pt-2 text-center">
                  Mockup telemetry dashboard.
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/40 relative z-10 text-center">
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Simple, Predictable Pricing</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Start practicing for free, then upgrade to premium features to unlock webcam intelligence.</p>
        </div>

        {/* Pricing billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <span className={`text-xs font-bold transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
          <button 
            type="button" 
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 relative transition-colors focus:outline-none cursor-pointer"
          >
            <div 
              className={`h-4.5 w-4.5 rounded-full bg-[#6C63FF] transition-all absolute top-0.5 ${
                billingPeriod === 'yearly' ? 'left-[26px]' : 'left-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold transition-colors ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Yearly Billing</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">
              Save 20%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricing.map((tier) => (
            <div 
              key={tier.name} 
              className={`glass-card rounded-2xl p-8 relative flex flex-col justify-between h-full text-left ${
                tier.isPopular ? 'border-2 border-[#6C63FF]/60 shadow-xl shadow-purple-500/5' : ''
              }`}
            >
              {tier.isPopular && (
                <span className="absolute top-[-14px] right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white text-[9px] uppercase font-bold tracking-wider">
                  Popular Plan
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{tier.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{tier.description}</p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">
                    {billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                  </span>
                  <span className="text-slate-400 text-xs ml-2">/ month</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-800/80">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-350">
                      <CheckCircle className="h-4 w-4 text-[#8B5CF6] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={tier.action}
                className={`w-full py-3 rounded-xl font-bold mt-8 transition-all text-xs cursor-pointer ${
                  tier.isPopular 
                    ? 'bg-[#6C63FF] hover:bg-[#5a52e0] text-white shadow-lg shadow-purple-500/10 glow-btn' 
                    : 'bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-800/40 relative z-10 text-left">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Have queries about the mock architecture? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-xl border border-slate-850 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs md:text-sm text-slate-200 hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    activeFaq === idx ? 'transform rotate-180 text-[#8B5CF6]' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850/50 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs gap-4 relative z-10">
        <div>
          <span>&copy; 2026 Aletheia AI Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
