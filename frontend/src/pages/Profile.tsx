import React from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import { useAuth } from '../context/AuthContext';
import { Award, Mail, Calendar, Sparkles, Trophy, ShieldCheck } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="My Profile" />

        <main className="flex-grow p-8 space-y-8 max-w-4xl w-full mx-auto">
          {/* Main profile banner card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-purple-950/15">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-purple-500/25">
              {user ? user.name.substring(0, 2).toUpperCase() : 'IQ'}
            </div>
            
            <div className="space-y-1 text-center sm:text-left overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="font-extrabold text-xl text-white">{user?.name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold w-max mx-auto sm:mx-0">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Pro Member</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          {/* Stats overview cards grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 border border-slate-850 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Mock Count</span>
              <div className="text-xl font-bold text-slate-200 mt-1">{user?.stats?.totalInterviews || 0}</div>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-850 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Average Grade</span>
              <div className="text-xl font-bold text-slate-200 mt-1">{user?.stats?.averageScore || 0}%</div>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-850 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Time Trained</span>
              <div className="text-xl font-bold text-slate-200 mt-1">
                {user?.stats?.totalTimeSpent ? `${Math.round(user.stats.totalTimeSpent / 60)}m` : '0m'}
              </div>
            </div>
          </div>

          {/* Detailed achievements lists */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="h-5 w-5 text-amber-400" />
              <h4 className="font-bold text-sm text-slate-200">Unlocked Badges</h4>
            </div>

            {user?.achievements && user.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#8B5CF6]/10 text-[#A78BFA] flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-200">{achievement.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">{achievement.description}</p>
                      <span className="text-[9px] text-slate-500 mt-2 block">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No achievements earned yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
