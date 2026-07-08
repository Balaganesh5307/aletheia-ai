import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { 
  Video, 
  Sparkles, 
  Clock, 
  Sliders, 
  FileText,
  AlertTriangle,
  BrainCircuit,
  Monitor,
  Cpu,
  Layers,
  Bot,
  Users2,
  LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingShapes from '../components/shared/FloatingShapes';

interface IResume {
  _id: string;
  fileName: string;
}

const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('Frontend Engineer');
  const [difficulty, setDifficulty] = useState<'Entry' | 'Mid' | 'Senior'>('Mid');
  const [durationLimit, setDurationLimit] = useState(15);
  const [resumeId, setResumeId] = useState('');
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const jobRoles = [
    { name: 'Frontend Engineer', description: 'React, CSS, optimization & client apps', icon: Monitor },
    { name: 'Backend Engineer', description: 'Node.js, PostgreSQL, DB scaling & APIs', icon: Cpu },
    { name: 'Full-Stack Developer', description: 'End-to-end setups & product logic', icon: Layers },
    { name: 'AI/ML Architect', description: 'Gemini integrations & serverless pipes', icon: Bot },
    { name: 'Product Manager', description: 'Roadmaps, backlog metrics & telemetry', icon: Users2 },
    { name: 'Data Scientist', description: 'Python scripts, database tables & charts', icon: LineChart }
  ];

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resumes');
        setResumes(response.data);
        if (response.data.length > 0) {
          setResumeId(response.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching resumes:', err);
      }
    };
    fetchResumes();
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/interviews/create', {
        jobTitle,
        difficulty,
        durationLimit,
        resumeId: resumeId || undefined
      });
      const interview = response.data;
      navigate(`/interview/${interview._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initialize mock interview session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Visual decoration layers */}
        <FloatingShapes variant="minimal" />
        <div className="liquid-blob liquid-blob-accent w-[350px] h-[350px] top-[10%] right-[-8%]"></div>
        <div className="absolute inset-0 bg-grid-pattern-dense pointer-events-none opacity-40 z-0"></div>

        <Header title="Interview Setup" />

        <main className="flex-grow p-8 max-w-6xl w-full mx-auto flex items-center justify-center relative z-[1]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            
            {/* Left Side: Setup Forms */}
            <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-slate-800 space-y-6 flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="h-5 w-5 text-[#6C63FF]" />
                  <h3 className="font-bold text-base text-slate-100">Setup Your Session</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Select a target track, set the difficulty, and lock in session parameters to launch.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStart} className="space-y-6">
                
                {/* Visual Career Track Selector Cards Grid */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Career Track</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                    {jobRoles.map((role) => (
                      <div
                        key={role.name}
                        onClick={() => setJobTitle(role.name)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex gap-3 items-start ${
                          jobTitle === role.name 
                            ? 'bg-[#6C63FF]/5 border-[#6C63FF] shadow-inner shadow-purple-500/5' 
                            : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                          jobTitle === role.name 
                            ? 'bg-[#6C63FF]/15 border-[#6C63FF]/30 text-[#A78BFA]' 
                            : 'bg-slate-905 border-slate-800 text-slate-450'
                        }`}>
                          <role.icon className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="block text-xs font-bold text-slate-200 truncate">{role.name}</span>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Difficulty Select */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Entry', 'Mid', 'Senior'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`py-2.5 rounded-xl font-bold text-[10px] uppercase border transition-all cursor-pointer ${
                            difficulty === level
                              ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 border-[#6C63FF] text-[#A78BFA] shadow-md'
                              : 'bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-800'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration select */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration Limit</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 15, 20].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDurationLimit(mins)}
                          className={`py-2.5 rounded-xl font-bold text-[10px] border transition-all cursor-pointer ${
                            durationLimit === mins
                              ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 border-[#6C63FF] text-[#A78BFA] shadow-md'
                              : 'bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-800'
                          }`}
                        >
                          {mins} Min
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resume selection */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tailored Resume Profile</label>
                  {resumes.length === 0 ? (
                    <div 
                      onClick={() => navigate('/resume')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 flex items-center justify-between text-slate-550 text-xs cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>No resumes found. Click here to parse your CV...</span>
                      </span>
                    </div>
                  ) : (
                    <select
                      value={resumeId}
                      onChange={(e) => setResumeId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-slate-350 text-xs focus:outline-none focus:border-[#6C63FF] transition-colors"
                    >
                      <option value="">No Resume (General Scenario Questions)</option>
                      {resumes.map((res) => (
                        <option key={res._id} value={res._id}>{res.fileName}</option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-95 transition-all font-bold text-xs text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6 glow-btn"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Compiling Scenario Rubrics...</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      <span>Start Mock Session</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side: Pro Advices and Preview */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between bg-gradient-to-br from-slate-900/60 to-[#1E293B]/40 text-left">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] text-[#A78BFA] font-bold uppercase tracking-widest block mb-1">Telemetry Guidelines</span>
                  <h4 className="font-bold text-sm text-slate-200">Before starting checklist:</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <Clock className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-300 block">Manage timing thresholds</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Mock checks track verbal delivery speeds and timing blocks per technical scenario.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <Video className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-300 block">Enable browser camera</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Webcam telemetry maps gaze stability vectors. Grant permission prompts.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <Sliders className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-300 block">Review resume profiles</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Vetting frameworks on CV files tailors the tech assessments directly.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 mt-6 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-semibold leading-normal">
                  Our FastAPI models generate grading benchmarks aligned with senior engineer performance patterns.
                </span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewSetup;
