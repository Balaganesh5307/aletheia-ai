import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Video, 
  FileText, 
  Activity, 
  Award, 
  MessageSquareQuote,
  CheckCircle,
  Zap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Resume Intelligence',
      description: 'Upload your resume and get immediate skills analysis, matching candidate profiles, and customizable question lists.',
      icon: FileText,
      color: '#6C63FF'
    },
    {
      title: 'Interactive Webcam Simulator',
      description: 'Simulate mock interviews with live emotion tracking, eye contact monitoring, and active body posture reports.',
      icon: Video,
      color: '#8B5CF6'
    },
    {
      title: 'Gemini NLP Assessment',
      description: 'Receive real-world performance ratings grading the clarity, relevance, and depth of technical answers.',
      icon: Activity,
      color: '#06B6D4'
    },
    {
      title: 'Structured Feedback & Analytics',
      description: 'Get graphical dashboards with speech pacing, filler words analysis, strengths and action-item recommendations.',
      icon: Award,
      color: '#F59E0B'
    }
  ];

  const pricing = [
    {
      name: 'Starter Plan',
      price: '$0',
      description: 'Explore the foundations of AI mock interviewing',
      features: ['2 Mock Interviews / month', 'Basic resume scoring', 'Text answers feedback', 'Standard analytics dashboard'],
      isPopular: false,
      cta: 'Get Started for Free',
      action: () => navigate('/register')
    },
    {
      name: 'Professional Pro',
      price: '$29',
      description: 'The ultimate toolkit for active job seekers',
      features: ['Unlimited Mock Interviews', 'Advanced Resume Parsing', 'Real-time eye & emotion analytics', 'Full AI Feedback Report', 'Custom role generation', 'Export PDF insights'],
      isPopular: true,
      cta: 'Upgrade to Pro Now',
      action: () => navigate('/register')
    }
  ];

  return (
    <div className="bg-[#0F172A] text-[#F8FAFC] min-h-screen relative overflow-hidden font-sans">
      {/* Background ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6C63FF]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/10 blur-[150px] pointer-events-none"></div>

      {/* Header bar */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/40 relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">
            Interview<span className="text-[#6C63FF]">IQ</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors text-sm">
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-90 transition-all font-semibold text-sm text-white shadow-lg shadow-purple-500/20 glow-btn"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#A78BFA] text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by Gemini 1.5 Flash</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Practice. Analyze. Improve. <br />
            <span className="text-gradient">Get Hired.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            InterviewIQ AI is the world's most advanced Mock Interview simulator. Connect your resume, practice actual job roles, and receive real-time behavioral insights.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              <span>Practice Free Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a 
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/30 text-slate-200 font-bold transition-all flex items-center justify-center"
            >
              View Pricing
            </a>
          </div>
        </motion.div>

        {/* Dashboard Mockup Display */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-950 p-2 shadow-2xl shadow-purple-500/10"
        >
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="rounded-xl overflow-hidden glass-card aspect-video flex flex-col items-center justify-center p-8 bg-slate-900/60 relative">
            {/* Visual elements mapping the dashboard look */}
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="text-xs text-slate-500 bg-slate-950/40 px-3 py-1 rounded-md">interviewiq.ai/dashboard</div>
              <div className="w-14"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full h-full text-left">
              <div className="col-span-2 space-y-4">
                <div className="h-28 rounded-xl bg-slate-900 border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Overall Mock IQ Score</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">+12% vs last week</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">84</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#6C63FF] h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-semibold">Eye Contact</span>
                    <span className="text-xl font-bold text-slate-200">89%</span>
                    <span className="text-[10px] text-slate-500">Excellent stable contact</span>
                  </div>
                  <div className="h-24 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-semibold">Posture Alert</span>
                    <span className="text-xl font-bold text-amber-400">92%</span>
                    <span className="text-[10px] text-slate-500">Good straight carriage</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-2">Confidence Emotion Tracker</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Neutral</span>
                      <span className="font-bold text-slate-200">65%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full"><div className="bg-[#6C63FF] h-full rounded-full" style={{ width: '65%' }}></div></div>
                    
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Happy</span>
                      <span className="font-bold text-slate-200">25%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full"><div className="bg-emerald-400 h-full rounded-full" style={{ width: '25%' }}></div></div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Fearful</span>
                      <span className="font-bold text-slate-200">10%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full"><div className="bg-rose-400 h-full rounded-full" style={{ width: '10%' }}></div></div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 text-center border-t border-slate-800 pt-2 mt-2">Active Webcam Stream feedback enabled</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/40 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">Revolutionize Your Interview Game</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Get feedback on all dimensions of your mock interview performance, powered by artificial intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col h-full justify-between"
            >
              <div>
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-6 shadow-inner"
                  style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}25` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-100">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/40 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">Simple, Predictable Pricing</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Start practicing for free, then upgrade to premium features to unlock webcam intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricing.map((tier) => (
            <div 
              key={tier.name} 
              className={`glass-card rounded-2xl p-8 relative flex flex-col justify-between h-full ${
                tier.isPopular ? 'border-2 border-[#6C63FF]/60 shadow-xl shadow-purple-500/5' : ''
              }`}
            >
              {tier.isPopular && (
                <span className="absolute top-[-14px] right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white text-[10px] uppercase font-bold tracking-wider">
                  Highly Recommended
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-100">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{tier.description}</p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-slate-400 text-sm ml-2">/ month</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-800/80">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-[#8B5CF6] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={tier.action}
                className={`w-full py-3.5 rounded-xl font-bold mt-8 transition-all ${
                  tier.isPopular 
                    ? 'bg-[#6C63FF] hover:bg-[#5a52e0] text-white shadow-lg shadow-purple-500/10 glow-btn' 
                    : 'bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs gap-4 relative z-10">
        <div>
          <span>&copy; 2026 InterviewIQ AI Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
