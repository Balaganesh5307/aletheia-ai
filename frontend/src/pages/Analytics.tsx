import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { 
  TrendingUp, 
  ChevronRight, 
  Calendar, 
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

interface IScoreTrend {
  date: string;
  score: number;
  jobTitle: string;
}

interface IAggregates {
  averageEyeContact: number;
  averagePosture: number;
  averageClarity: number;
  averageAccuracy: number;
}

interface IHistoryItem {
  _id: string;
  jobTitle: string;
  difficulty: string;
  overallScore: number;
  createdAt: string;
  status: string;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [trend, setTrend] = useState<IScoreTrend[]>([]);
  const [aggregates, setAggregates] = useState<IAggregates | null>(null);
  const [history, setHistory] = useState<IHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const trendRes = await api.get('/analytics/overview');
        setTrend(trendRes.data.scoreTrend);
        setAggregates(trendRes.data.aggregates);

        const historyRes = await api.get('/interviews/history');
        setHistory(historyRes.data);
      } catch (err) {
        console.error('Error fetching analytics details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const aggregateBarData = aggregates ? [
    { name: 'Eye Contact', score: aggregates.averageEyeContact },
    { name: 'Posture Check', score: aggregates.averagePosture },
    { name: 'Speech Pacing', score: aggregates.averageClarity },
    { name: 'Domain Accuracy', score: aggregates.averageAccuracy }
  ] : [];

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="Analytics" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
              <div className="h-8 w-8 border-4 border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin mb-2"></div>
              <span>Assembling progression matrices...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 border border-slate-850 text-center flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-350">Analytics unavailable</h4>
                <p className="text-xs text-slate-500 mt-1">Complete your first mock interview session to unlock progress charts.</p>
              </div>
              <button 
                onClick={() => navigate('/setup')} 
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-90 transition-all text-xs font-semibold text-white"
              >
                Set Up Mock Session
              </button>
            </div>
          ) : (
            <>
              {/* Dynamic Line Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Score Trend Line */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">Mock Score Progression</h3>
                    <p className="text-[10px] text-slate-500">Your average rating progress charted across sequential mock sessions.</p>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend} margin={{ left: -25, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="date" stroke="#64748B" fontSize={9} />
                        <YAxis stroke="#64748B" fontSize={10} domain={[40, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Behavioral aggregates metrics */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">Aggregate Averages</h3>
                    <p className="text-[10px] text-slate-500">Average metrics across all speech and posture checks.</p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={aggregateBarData} margin={{ left: -25, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={8} />
                        <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '11px' }} />
                        <Bar dataKey="score" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

              </div>

              {/* Complete Session Archive Table */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6 border border-slate-850 space-y-4 text-left"
              >
                <h3 className="font-bold text-sm text-slate-200">Mock Session Log Archive</h3>
                
                <div className="overflow-x-auto rounded-xl border border-slate-850">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Job Role</th>
                        <th className="p-4">Difficulty</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status & Score</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-950/20 text-slate-350">
                      {history.map((session) => (
                        <tr key={session._id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4 font-bold text-slate-200">{session.jobTitle}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400">
                              {session.difficulty}
                            </span>
                          </td>
                          <td className="p-4">{new Date(session.createdAt).toLocaleDateString('en-US')}</td>
                          <td className="p-4">
                            {session.status === 'completed' ? (
                              <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                <span className="font-extrabold text-[#A78BFA]">{session.overallScore}/100</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                <span className="font-bold text-slate-500">In Progress</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                if (session.status === 'completed') {
                                  navigate(`/feedback/${session._id}`);
                                } else {
                                  navigate(`/interview/${session._id}`);
                                }
                              }}
                              className="text-[#6C63FF] hover:underline font-bold flex items-center gap-0.5 justify-end ml-auto cursor-pointer"
                            >
                              <span>{session.status === 'completed' ? 'View Report' : 'Resume'}</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
