import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  TrendingUp, 
  Settings, 
  User, 
  LogOut, 
  Award,
  Cpu,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Resume', path: '/resume', icon: FileText },
    { name: 'Mock Interview', path: '/setup', icon: Video },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminItem = { name: 'Admin Console', path: '/admin', icon: Shield };

  const displayedItems = (user?.role === 'admin' || user?.email === 'admin@gmail.com')
    ? [...menuItems, adminItem]
    : menuItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 glass-card h-screen fixed left-0 top-0 flex flex-col justify-between p-6 z-20 border-r border-slate-800">
      {/* Brand logo */}
      <div>
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Cpu className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
              Aletheia<span className="text-[#6C63FF]"> AI</span>
            </h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Assistant</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {displayedItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/10 text-white font-medium border border-[#6C63FF]/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`
              }
            >
              <item.icon className="h-5 w-5 group-hover:scale-105 transition-transform" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile card & Log out */}
      <div className="space-y-4">
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/35 border border-slate-700/30">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-slate-200 truncate">{user.name}</h4>
              <div className="flex items-center gap-1 text-[11px] text-[#8B5CF6] font-medium">
                <Award className="h-3 w-3" />
                <span>{user.achievements.length} Achievements</span>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
