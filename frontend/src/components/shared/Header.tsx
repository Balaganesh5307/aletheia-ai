import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();
  
  // Real-time clock/date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-[#0F172A]/85 backdrop-blur-md sticky top-0 z-10 w-full">
      {/* Title & Date */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h2>
        <span className="text-[12px] text-slate-400 font-medium">{formattedDate}</span>
      </div>

      {/* Quick stats and alerts */}
      <div className="flex items-center gap-6">
        {/* Gemini status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#A78BFA] text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Gemini AI Connected</span>
        </div>

        {/* Notifications and User */}
        <div className="flex items-center gap-4">
          <button className="h-10 w-10 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 flex items-center justify-center text-slate-300 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/10">
              {user ? user.name.substring(0, 2).toUpperCase() : 'AA'}
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-semibold text-slate-200">{user?.name || 'Guest User'}</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
