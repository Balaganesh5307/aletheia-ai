import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Trophy, 
  Calendar, 
  ChevronRight, 
  Play, 
  Clock, 
  Activity, 
  UserCheck,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import ProgressRing from '../components/shared/ProgressRing';
import FloatingShapes from '../components/shared/FloatingShapes';

interface IInterviewSummary {
  _id: string;
  jobTitle: string;
  difficulty: string;
  overallScore: number;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentInterviews, setRecentInterviews] = useState<IInterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/interviews/history');
        setRecentInterviews(response.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching interview history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: 'Total Mock Sessions',
      value: user?.stats?.totalInterviews || 0,
      description: 'Completed mock evaluations',
      icon: Activity,
      color: '#6C63FF'
    },
    {
      name: 'Average IQ Score',
      value: user?.stats?.totalInterviews ? `${user.stats.averageScore}/100` : 'N/A',
      description: 'Cumulative performance rate',
      icon: Trophy,
      color: '#8B5CF6'
    },
    {
      name: 'Time Trained',
      value: user?.stats?.totalTimeSpent 
        ? `${Math.round(user.stats.totalTimeSpent / 60)} min`
        : '0 min',
      description: 'Active speaking duration',
      icon: Clock,
      color: '#06B6D4'
    }
  ];

  const staticBadges = [
    { id: 'first_step', title: 'First Step', description: 'Created an account', icon: 'UserCheck', unlocked: true },
    { id: 'first_interview', title: 'First Steps', description: 'Complete 1 mock session', icon: 'Trophy', unlocked: user?.stats?.totalInterviews ? user.stats.totalInterviews >= 1 : false },
    { id: 'veteran_5', title: 'Interview Veteran', description: 'Complete 5 sessions', icon: 'Calendar', unlocked: user?.stats?.totalInterviews ? user.stats.totalInterviews >= 5 : false },
    { id: 'expert_90', title: 'Perfect IQ', description: 'Score 90+ in a session', icon: 'Play', unlocked: user?.stats?.averageScore ? user.stats.averageScore >= 90 : false }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const avgScore = user?.stats?.averageScore || 0;
  const totalInterviews = user?.stats?.totalInterviews || 0;
  const totalTime = user?.stats?.totalTimeSpent ? Math.round(user.stats.totalTimeSpent / 60) : 0;

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Floating geometric decorations */}
        <FloatingShapes variant="minimal" />

        {/* Liquid gradient blobs */}
        <div className="liquid-blob liquid-blob-primary w-[400px] h-[400px] top-[-5%] right-[-10%]"></div>
        <div className="liquid-blob liquid-blob-accent w-[300px] h-[300px] bottom-[10%] left-[-5%]"></div>

        {/* Dense grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern-dense pointer-events-none opacity-40 z-0"></div>

        <Header title="Dashboard" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto relative z-[1]">
          {/* Welcome Banner with floating element glows */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden glass-card p-8 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/20"
          >
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-[#8B5CF6]/5 blur-3xl pointer-events-none"></div>
            <div className="space-y-2 text-center md:text-left relative z-10">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="h-5 w-5 text-[#8B5CF6] animate-pulse" />
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Welcome, {user?.name || 'Developer'}!</h2>
              </div>
              <p className="text-slate-400 max-w-xl text-xs md:text-sm leading-relaxed">
                Unlock professional mock scenarios and get graded by our Gemini assessment models.
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/setup')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-95 transition-all font-bold text-sm text-white shadow-lg shadow-purple-500/20 flex items-center gap-2 flex-shrink-0 glow-btn cursor-pointer relative z-10"
            >
              <Plus className="h-4 w-4" />
              <span>Configure Mock Session</span>
            </motion.button>
          </motion.div>

          {/* Stats Cards Row with Entrance Animations */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Stat: Total Mock Sessions */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -4, borderColor: 'rgba(108, 99, 255, 0.35)', boxShadow: '0 8px 32px 0 rgba(108, 99, 255, 0.08)' }}
              className="glass-card rounded-2xl p-6 border border-slate-850 flex items-center justify-between transition-all duration-300 relative overflow-hidden"
            >
              <div className="dynamic-glow w-20 h-20 bg-[#6C63FF]/10 top-[-10px] right-[-10px]"></div>
              <div className="space-y-1 relative z-[1]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Mock Sessions</span>
                <div className="text-2xl font-extrabold text-white">
                  <AnimatedCounter end={totalInterviews} duration={1000} />
                </div>
                <p className="text-[10px] text-slate-450">Completed mock evaluations</p>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-inner border border-slate-800 bg-[#6C63FF]/10 icon-animate-bounce relative z-[1]">
                <Activity className="h-5 w-5 text-[#6C63FF]" />
              </div>
            </motion.div>

            {/* Stat: Average Score with Progress Ring */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -4, borderColor: 'rgba(139, 92, 246, 0.35)', boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.08)' }}
              className="glass-card rounded-2xl p-6 border border-slate-850 flex items-center justify-between transition-all duration-300 relative overflow-hidden"
            >
              <div className="dynamic-glow w-20 h-20 bg-[#8B5CF6]/10 top-[-10px] right-[-10px]"></div>
              <div className="space-y-1 relative z-[1]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Average IQ Score</span>
                <div className="text-2xl font-extrabold text-white">
                  {totalInterviews > 0 ? (
                    <><AnimatedCounter end={avgScore} duration={1400} /><span className="text-base text-slate-400">/100</span></>
                  ) : 'N/A'}
                </div>
                <p className="text-[10px] text-slate-450">Cumulative performance rate</p>
              </div>
              <ProgressRing progress={avgScore} size={52} strokeWidth={5} color="#8B5CF6">
                <Trophy className="h-4 w-4 text-[#A78BFA]" />
              </ProgressRing>
            </motion.div>

            {/* Stat: Time Trained */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -4, borderColor: 'rgba(6, 182, 212, 0.35)', boxShadow: '0 8px 32px 0 rgba(6, 182, 212, 0.08)' }}
              className="glass-card rounded-2xl p-6 border border-slate-850 flex items-center justify-between transition-all duration-300 relative overflow-hidden"
            >
              <div className="dynamic-glow w-20 h-20 bg-[#06B6D4]/10 top-[-10px] right-[-10px]"></div>
              <div className="space-y-1 relative z-[1]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Time Trained</span>
                <div className="text-2xl font-extrabold text-white">
                  <AnimatedCounter end={totalTime} duration={1200} suffix=" min" />
                </div>
                <p className="text-[10px] text-slate-450">Active speaking duration</p>
              </div>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-inner border border-slate-800 bg-[#06B6D4]/10 icon-animate-bounce relative z-[1]">
                <Clock className="h-5 w-5 text-[#06B6D4]" />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side recent interviews */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-slate-200">Recent Mock Sessions</h3>
                {recentInterviews.length > 0 && (
                  <button onClick={() => navigate('/analytics')} className="text-xs text-[#8B5CF6] hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                    <span>View all history</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-slate-850 p-5 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl skeleton-premium"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 skeleton-premium"></div>
                        <div className="h-3 w-48 skeleton-premium"></div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-3 w-16 skeleton-premium"></div>
                        <div className="h-4 w-12 skeleton-premium"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentInterviews.length === 0 ? (
                <div className="glass-card rounded-2xl border border-slate-850 p-8 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-300">No mock sessions completed yet</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Set up your first interview to check speaking pacing and eye-contact coordinates.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/setup')} 
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Setup Mock Interview
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentInterviews.map((interview) => (
                    <motion.div 
                      key={interview._id}
                      whileHover={{ scale: 1.01, borderColor: 'rgba(108, 99, 255, 0.2)' }}
                      onClick={() => {
                        if (interview.status === 'completed') {
                          navigate(`/feedback/${interview._id}`);
                        } else {
                          navigate(`/interview/${interview._id}`);
                        }
                      }}
                      className="glass-card rounded-2xl p-5 border border-slate-850 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center text-[#A78BFA]">
                          <Play className="h-4.5 w-4.5 fill-current" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-200">{interview.jobTitle}</h4>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                            {interview.difficulty} difficulty &bull; {new Date(interview.createdAt).toLocaleDateString('en-US')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mock Score</span>
                          <span className={`text-sm font-bold ${interview.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {interview.status === 'completed' ? `${interview.overallScore}/100` : 'In Progress'}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right side achievements panel with custom visual radial outline */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="font-bold text-base text-slate-200">Unlocked Badges</h3>
              
              <div className="glass-card rounded-2xl p-5 border border-slate-850 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-950/40">
                {staticBadges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all ${
                      badge.unlocked 
                        ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20 opacity-100' 
                        : 'bg-slate-950/20 border-slate-900/30 opacity-40'
                    }`}
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      badge.unlocked ? 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/25' : 'bg-slate-900 text-slate-600'
                    }`}>
                      {badge.icon === 'UserCheck' && <UserCheck className="h-4.5 w-4.5" />}
                      {badge.icon === 'Trophy' && <Trophy className="h-4.5 w-4.5" />}
                      {badge.icon === 'Calendar' && <Calendar className="h-4.5 w-4.5" />}
                      {badge.icon === 'Play' && <Play className="h-4.5 w-4.5" />}
                    </div>
                    <div className="overflow-hidden text-left">
                      <h4 className="text-xs font-extrabold text-slate-200 truncate">{badge.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
