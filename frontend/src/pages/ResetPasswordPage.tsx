import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Cpu 
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input Validation Checks
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Confirm password doesn't match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: password
      });
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update your password. Token might be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0F172A] text-[#F8FAFC] min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Grid Pattern Guide Overlay */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0"></div>

      {/* Background ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#6C63FF]/10 blur-[100px] pointer-events-none animate-float-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/10 blur-[100px] pointer-events-none animate-float-blob-delayed"></div>

      <div className="absolute top-8 left-8">
        <Link to="/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Login</span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* App Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Cpu className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-2xl tracking-tight">
            Aletheia<span className="text-[#6C63FF]"> AI</span>
          </h1>
        </div>

        {/* Card Body */}
        <div className="glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl">
          <div className="mb-6 text-left">
            <h2 className="text-lg font-bold text-slate-100">Set New Password</h2>
            <p className="text-xs text-slate-450 mt-1">Please enter your new credentials below.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 mb-4 text-left">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 mb-4 text-left">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-widest">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-855 text-slate-200 placeholder-slate-655 focus:outline-none focus:border-[#6C63FF] text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-widest">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-855 text-slate-200 placeholder-slate-655 focus:outline-none focus:border-[#6C63FF] text-xs transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-xs mt-6 transition-all shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
