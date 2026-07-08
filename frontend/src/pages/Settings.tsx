import React, { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Custom switch toggles
  const [cameraRequired, setCameraRequired] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await updateProfile(name, email);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="Account Settings" />

        <main className="flex-grow p-8 space-y-8 max-w-3xl w-full mx-auto">
          {/* Profile settings form */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-left">
              <SettingsIcon className="h-5 w-5 text-[#6C63FF]" />
              <h3 className="font-bold text-sm text-slate-200">Account Details</h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-855 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] text-xs transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-855 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold text-xs transition-all shadow-md shadow-purple-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* AI configurations mockup options */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 text-left"
          >
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-200">Mock Settings Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Require Video Tracking</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Automatically activate webcam analytics alerts on starting mock sessions.</p>
                </div>
                
                {/* Animated Switch Component */}
                <button 
                  type="button" 
                  onClick={() => setCameraRequired(!cameraRequired)}
                  className={`w-10 h-5.5 rounded-full p-0.5 relative transition-colors focus:outline-none cursor-pointer flex items-center ${
                    cameraRequired ? 'bg-[#6C63FF]' : 'bg-slate-850 border border-slate-800'
                  }`}
                >
                  <div 
                    className={`h-4.5 w-4.5 rounded-full bg-white transition-all absolute top-0.5 ${
                      cameraRequired ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Active Voice Warnings</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Emit live audio guidelines when pacing rises too fast.</p>
                </div>
                
                {/* Animated Switch Component */}
                <button 
                  type="button" 
                  onClick={() => setAudioFeedback(!audioFeedback)}
                  className={`w-10 h-5.5 rounded-full p-0.5 relative transition-colors focus:outline-none cursor-pointer flex items-center ${
                    audioFeedback ? 'bg-[#6C63FF]' : 'bg-slate-855 border border-slate-800'
                  }`}
                >
                  <div 
                    className={`h-4.5 w-4.5 rounded-full bg-white transition-all absolute top-0.5 ${
                      audioFeedback ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
