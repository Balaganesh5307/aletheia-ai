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
  FileText,
  UserCheck,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

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
        // Get the latest 3 interviews
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
      icon: Activity,
      color: '#6C63FF'
    },
    {
      name: 'Average IQ Score',
      value: user?.stats?.totalInterviews ? `${user.stats.averageScore}/100` : 'N/A',
      icon: Trophy,
      color: '#8B5CF6'
    },
    {
      name: 'Time Spent Preparing',
      value: user?.stats?.totalTimeSpent 
        ? `${Math.round(user.stats.totalTimeSpent / 60)} min`
        : '0 min',
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

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Navigation Drawer */}
      <Sidebar />

      {/* Primary Layout Frame */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="Dashboard" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="relative rounded-2xl overflow-hidden glass-card p-8 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, {user?.name}!</h2>
              <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                Ready to ace your next job interview? Start by uploading your resume or jumping directly into a custom mock interview configuration.
              </p>
            </div>
            <button 
              onClick={() => navigate('/setup')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-90 transition-all font-bold text-sm text-white shadow-lg shadow-purple-500/20 flex items-center gap-2 flex-shrink-0 glow-btn cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Mock Session</span>
            </button>
          </div>

          {/* Core Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.name}</span>
                  <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                </div>
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Dashboard Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side recent interviews */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-200">Recent Mock Sessions</h3>
                {recentInterviews.length > 0 && (
                  <button onClick={() => navigate('/analytics')} className="text-xs text-[#8B5CF6] hover:underline font-semibold flex items-center gap-1">
                    <span>View all sessions</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 rounded-2xl shimmer border border-slate-800"></div>
                  ))}
                </div>
              ) : recentInterviews.length === 0 ? (
                <div className="glass-card rounded-2xl border border-slate-850 p-8 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-slate-800/40 flex items-center justify-center text-slate-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-300">No mock sessions completed yet</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Configuring your first mock interview only takes 2 minutes. Let's practice!</p>
                  </div>
                  <button 
                    onClick={() => navigate('/setup')} 
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
                  >
                    Set Up Mock Interview
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentInterviews.map((interview) => (
                    <div 
                      key={interview._id}
                      onClick={() => {
                        if (interview.status === 'completed') {
                          navigate(`/feedback/${interview._id}`);
                        } else {
                          navigate(`/interview/${interview._id}`);
                        }
                      }}
                      className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center text-[#A78BFA]">
                          <Play className="h-5 w-5 fill-current" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-200">{interview.jobTitle}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {interview.difficulty} difficulty &bull; {new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="block text-xs text-slate-400 font-semibold">Mock Score</span>
                          <span className={`text-base font-bold ${interview.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {interview.status === 'completed' ? `${interview.overallScore}/100` : 'In Progress'}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side achievements panel */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-slate-200">Earned Badges</h3>
              
              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
                {staticBadges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                      badge.unlocked 
                        ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/25 opacity-100' 
                        : 'bg-slate-900/40 border-slate-800/40 opacity-40'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      badge.unlocked ? 'bg-[#8B5CF6]/15 text-[#A78BFA]' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {badge.icon === 'UserCheck' && <UserCheck className="h-5 w-5" />}
                      {badge.icon === 'Trophy' && <Trophy className="h-5 w-5" />}
                      {badge.icon === 'Calendar' && <Calendar className="h-5 w-5" />}
                      {badge.icon === 'Play' && <Play className="h-5 w-5" />}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-200 truncate">{badge.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
