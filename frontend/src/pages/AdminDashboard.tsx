import React, { useEffect, useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { 
  Users, 
  Trash2, 
  Activity, 
  Database, 
  AlertTriangle,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Search,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface ISystemOverview {
  totalUsers: number;
  totalMocksConducted: number;
  databaseStatus: string;
  aiNodeStatus: string;
}

interface IUserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  stats: {
    totalInterviews: number;
    averageScore: number;
    totalTimeSpent: number;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<ISystemOverview | null>(null);
  const [users, setUsers] = useState<IUserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const overviewRes = await api.get('/admin/overview');
      setOverview(overviewRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
      setErrorMessage('Access denied or backend server offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccessMessage('User account moderated and deleted successfully.');
      setUsers(prev => prev.filter(u => u._id !== userId));
      if (overview) {
        setOverview(prev => prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : null);
      }
    } catch (err) {
      setErrorMessage('Failed to moderate user account.');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockTimelineData = [
    { day: 'Mon', sessions: 4 },
    { day: 'Tue', sessions: 7 },
    { day: 'Wed', sessions: 12 },
    { day: 'Thu', sessions: 9 },
    { day: 'Fri', sessions: 15 },
    { day: 'Sat', sessions: 8 },
    { day: 'Sun', sessions: 6 }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="Admin Console" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
              <div className="h-8 w-8 border-4 border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin mb-2"></div>
              <span>Securing admin credentials...</span>
            </div>
          ) : (
            <>
              {/* Alert notifications */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 text-left"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-455 text-xs flex items-center gap-2 text-left"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats overview bento widgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Total Users */}
                <div className="glass-card rounded-2xl p-5 border border-slate-850 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">Total Registered</span>
                    <span className="text-xl font-extrabold text-white">{overview?.totalUsers || 0}</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                {/* Total sessions */}
                <div className="glass-card rounded-2xl p-5 border border-slate-850 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">Mocks Conducted</span>
                    <span className="text-xl font-extrabold text-white">{overview?.totalMocksConducted || 0}</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>

                {/* Database status */}
                <div className="glass-card rounded-2xl p-5 border border-slate-850 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">Database Node</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{overview?.databaseStatus || 'Connected'}</span>
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <Database className="h-5 w-5" />
                  </div>
                </div>

                {/* AI Gateway Node status */}
                <div className="glass-card rounded-2xl p-5 border border-slate-850 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">FastAPI Node</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{overview?.aiNodeStatus || 'Healthy'}</span>
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <Cpu className="h-5 w-5" />
                  </div>
                </div>

              </div>

              {/* Chart & Admin Guidelines */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Volume bar chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">Mock Sessions Timeline</h3>
                    <p className="text-[10px] text-slate-500">Volume counts of simulated mock setups completed in the active week.</p>
                  </div>

                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockTimelineData} margin={{ left: -25, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '11px' }} />
                        <Bar dataKey="sessions" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Moderate guidelines */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between bg-gradient-to-br from-slate-900/60 to-purple-950/10 text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-[#6C63FF]" />
                      <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Moderator Rules</h4>
                    </div>
                    <ul className="space-y-2.5 text-[11px] text-slate-400 list-disc list-inside leading-normal">
                      <li>Bypass accounts `user@gmail.com` and `admin@gmail.com` are permanent mock profiles and cannot be deleted.</li>
                      <li>Review mock statistics and de-allocate inactive databases regularly.</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl mt-4 flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                    <span className="text-[10px] text-slate-550 leading-normal">
                      System registrations increased by 15% this month.
                    </span>
                  </div>
                </div>

              </div>

              {/* User management list */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-bold text-sm text-slate-200">Registered Users Management</h3>
                  
                  {/* Search query input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-550" />
                    <input 
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-350 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] text-xs transition-colors"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-850">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Mock Sessions</th>
                        <th className="p-4">Average IQ</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-950/20 text-slate-350">
                      {filteredUsers.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 font-bold text-slate-200">{item.name}</td>
                          <td className="p-4 text-slate-450">{item.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              item.role === 'admin' 
                                ? 'bg-purple-500/10 border border-purple-500/25 text-[#A78BFA]' 
                                : 'bg-slate-900 border border-slate-800 text-slate-400'
                            }`}>
                              {item.role}
                            </span>
                          </td>
                          <td className="p-4">{item.stats?.totalInterviews || 0} sessions</td>
                          <td className="p-4 font-semibold text-slate-200">{item.stats?.averageScore || 0}%</td>
                          <td className="p-4 text-right">
                            {item.email === 'admin@gmail.com' || item.email === 'user@gmail.com' ? (
                              <span className="text-[10px] text-slate-600 italic">Bypass Profile</span>
                            ) : (
                              <button
                                onClick={() => handleDeleteUser(item._id)}
                                className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 hover:bg-rose-500/10 text-slate-500 hover:text-rose-455 flex items-center justify-center transition-colors cursor-pointer ml-auto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
