import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { 
  Video, 
  HelpCircle, 
  Sparkles, 
  Calendar, 
  Clock, 
  Sliders, 
  FileText,
  AlertTriangle,
  BrainCircuit
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    'Frontend Engineer',
    'Backend Engineer',
    'Full-Stack Developer',
    'AI/ML Architect',
    'Product Manager',
    'Data Scientist'
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

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="Interview Setup" />

        <main className="flex-grow p-8 max-w-4xl w-full mx-auto flex items-center justify-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
            
            {/* Left Side: Setup Forms */}
            <div className="md:col-span-3 glass-card rounded-2xl p-6 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="h-5 w-5 text-[#6C63FF]" />
                  <h3 className="font-bold text-lg text-slate-100">Setup Your Session</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Tailor the AI recruiter to test your precise skills. Configure the parameters below to launch.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStart} className="space-y-4">
                {/* Job Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Job Role</label>
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-850 text-slate-200 text-sm focus:outline-none focus:border-[#6C63FF] transition-colors"
                  >
                    {jobRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Interview Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Entry', 'Mid', 'Senior'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          difficulty === level
                            ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 border-[#6C63FF] text-[#A78BFA] shadow-md shadow-purple-500/5'
                            : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Time Limit</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 15, 20].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDurationLimit(mins)}
                        className={`py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          durationLimit === mins
                            ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 border-[#6C63FF] text-[#A78BFA]'
                            : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        {mins} minutes
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resume selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Context Resume</label>
                  {resumes.length === 0 ? (
                    <div 
                      onClick={() => navigate('/resume')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-800 flex items-center justify-between text-slate-500 text-xs cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>No resumes found. Click to upload...</span>
                      </span>
                    </div>
                  ) : (
                    <select
                      value={resumeId}
                      onChange={(e) => setResumeId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-850 text-slate-200 text-sm focus:outline-none focus:border-[#6C63FF] transition-colors"
                    >
                      <option value="">No Resume (General Questions)</option>
                      {resumes.map((res) => (
                        <option key={res._id} value={res._id}>{res.fileName}</option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-90 transition-all font-bold text-sm text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6 glow-btn"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Assembling Questions...</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      <span>Launch Mock Interview</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side: Pro Advices and Preview */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between bg-gradient-to-br from-slate-900/80 to-[#1E293B]/40">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-widest block mb-1">Interactive Advisor</span>
                  <h4 className="font-bold text-sm text-slate-200">Before you hit launch:</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <Clock className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-300 block">Manage your time</span>
                      <p className="text-slate-500 mt-0.5">We track pacing and duration limit. Prepare concise STAR-structured responses.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <Video className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-300 block">Allow Camera and Audio access</span>
                      <p className="text-slate-500 mt-0.5">Webcam tracking reports gaze directions and confidence. Grant prompt access when starting.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <Sliders className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-300 block">Review resume profile</span>
                      <p className="text-slate-500 mt-0.5">Selecting a resume guides Gemini to quiz you on your listed developer frameworks.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 mt-6 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-semibold leading-normal">
                  Gemini API dynamically compiles real-time grading rubrics per generated technical question.
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
