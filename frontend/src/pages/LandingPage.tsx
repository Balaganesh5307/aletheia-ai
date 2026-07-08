import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Video, 
  FileText, 
  Activity, 
  Award, 
  CheckCircle,
  Zap,
  HelpCircle,
  ChevronDown,
  Play,
  Volume2,
  Lock
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Interactive Question Generator States
  const [demoRole, setDemoRole] = useState('Frontend Engineer');
  const [demoDiff, setDemoDiff] = useState('Mid');
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [generatedDemoQ, setGeneratedDemoQ] = useState(
    "Select a role and difficulty above, then click 'Generate Mock Question' to experience our AI engine."
  );

  const sampleQuestions: Record<string, Record<string, string[]>> = {
    'Frontend Engineer': {
      'Entry': [
        "Explain the virtual DOM concept in React and how it differs from the real DOM.",
        "What are the different ways to style a React component, and when would you use Tailwind CSS?"
      ],
      'Mid': [
        "How would you optimize a React application that is experiencing slow rendering on a list of 10,000 items?",
        "Describe the differences between Server-Side Rendering (SSR) and Static Site Generation (SSG) in Next.js."
      ],
      'Senior': [
        "Design a micro-frontend architecture for a large enterprise SaaS dashboard. How do you handle shared state?",
        "How would you design a custom caching mechanism on the client side for graphql queries to reduce payload sizes?"
      ]
    },
    'Backend Engineer': {
      'Entry': [
        "What is the role of middleware in an Express.js application, and how do you handle routing errors?",
        "Explain the differences between GET and POST request methods in REST APIs."
      ],
      'Mid': [
        "How do you handle database migrations in a production environment with millions of rows without causing downtime?",
        "Explain connection pooling in PostgreSQL and how it optimizes application performance."
      ],
      'Senior': [
        "Design a distributed rate limiter that handles 100,000 requests per second across a cluster of API gateways.",
        "How would you resolve a database deadlock in a high-concurrency microservice handling bank transactions?"
      ]
    },
    'Product Manager': {
      'Mid': [
        "How would you prioritize features for a new collaborative whiteboarding tool aimed at remote design teams?",
        "Describe a time you had to make a product decision with incomplete or conflicting data. What was your framework?"
      ],
      'Senior': [
        "Our daily active users for core file sharing dropped by 15% this week. Walk me through your root-cause analysis.",
        "How would you define the long-term roadmap and growth loop metrics for a developer platform API product?"
      ]
    }
  };

  const handleGenerateDemoQ = () => {
    setIsGeneratingDemo(true);
    setGeneratedDemoQ('');
    
    // Simulate typewriter effect
    setTimeout(() => {
      const rolesMap = sampleQuestions[demoRole] || sampleQuestions['Frontend Engineer'];
      const questionsList = rolesMap[demoDiff] || rolesMap['Mid'] || rolesMap['Entry'];
      const randomQ = questionsList[Math.floor(Math.random() * questionsList.length)];
      
      setGeneratedDemoQ(randomQ);
      setIsGeneratingDemo(false);
    }, 1200);
  };

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
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      description: 'Explore the foundations of AI mock interviewing',
      features: ['2 Mock Interviews / month', 'Basic resume scoring', 'Text answers feedback', 'Standard analytics dashboard'],
      isPopular: false,
      cta: 'Get Started for Free',
      action: () => navigate('/register')
    },
    {
      name: 'Professional Pro',
      monthlyPrice: '$29',
      yearlyPrice: '$23',
      description: 'The ultimate toolkit for active job seekers',
      features: ['Unlimited Mock Interviews', 'Advanced Resume Parsing', 'Real-time eye & emotion analytics', 'Full AI Feedback Report', 'Custom role generation', 'Export PDF insights'],
      isPopular: true,
      cta: 'Upgrade to Pro Now',
      action: () => navigate('/register')
    }
  ];

  const faqs = [
    {
      q: "How does the webcam behavioral tracker work?",
      a: "Our system uses MediaPipe and OpenCV directly inside your browser and AI service. It measures the alignment of your shoulders and the offset coordinates of your iris relative to the center of the camera to check eye contact and posture, sending real-time feedback cues."
    },
    {
      q: "What AI models analyze my verbal content?",
      a: "We process your recorded answer audios using OpenAI Whisper for high-accuracy text transcription, which is then analyzed by Google Gemini 1.5 Flash models to grade answer depth, semantic relevance, and domain technical correctness."
    },
    {
      q: "Is my personal resume data kept private?",
      a: "Yes. All resumes uploaded to Aletheia AI are encrypted at rest and scoped strictly to your user profile. We never train public machine learning models on your uploaded CVs."
    },
    {
      q: "Can I customize the job role and difficulty?",
      a: "Absolutely. You can choose from pre-set engineering and management tracks, or type in a specific target role. The AI recruiter will tailor technical scenarios dynamically from Entry to Lead Architect levels."
    }
  ];

  const logos = ['Google', 'Stripe', 'Meta', 'Netflix', 'Linear', 'Uber'];

  return (
    <div className="bg-[#0F172A] text-[#F8FAFC] min-h-screen relative overflow-hidden font-sans scroll-smooth">
      {/* Background ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#6C63FF]/8 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/8 blur-[130px] pointer-events-none"></div>

      {/* Header bar */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/40 relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">
            Aletheia<span className="text-[#6C63FF]"> AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors text-sm cursor-pointer">
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:opacity-90 transition-all font-semibold text-sm text-white shadow-lg shadow-purple-500/20 glow-btn cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Tagline & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#A78BFA] text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive AI Simulation Enabled</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-left">
              Practice. Analyze. Improve. <br />
              <span className="text-gradient">Get Hired.</span>
            </h1>
            
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl font-normal text-left">
              Aletheia AI is the world's most advanced Mock Interview simulator. Tailor scenarios with your resume, practice live webcam body posture reviews, and get graded on verbal pacing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Try Free Simulation</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <a 
                href="#pricing"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/30 text-slate-200 font-bold transition-all text-sm flex items-center justify-center"
              >
                View Premium Pricing
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Question Preview Box */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#8B5CF6]/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4.5 w-4.5 text-[#6C63FF]" />
                <h4 className="font-bold text-sm text-slate-200">Interactive AI Question preview</h4>
              </div>

              <div className="space-y-4 text-left">
                {/* Role select */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target Job Role</label>
                  <select 
                    value={demoRole}
                    onChange={(e) => setDemoRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-850 text-slate-300 text-xs focus:outline-none focus:border-[#6C63FF]"
                  >
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Difficulty level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Entry', 'Mid', 'Senior'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDemoDiff(level)}
                        className={`py-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          demoDiff === level 
                            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#A78BFA]' 
                            : 'bg-slate-900 border-slate-850 text-slate-450 hover:border-slate-800'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Generate Button */}
                <button
                  onClick={handleGenerateDemoQ}
                  disabled={isGeneratingDemo}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white text-xs font-bold transition-all shadow-md shadow-purple-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingDemo ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Generate Mock Question</span>
                  )}
                </button>

                {/* Typewriter Output Screen */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-850 min-h-[100px] flex items-center justify-center text-center">
                  <AnimatePresence mode="wait">
                    {isGeneratingDemo ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-slate-500 animate-pulse"
                      >
                        Compiling custom scenario matrices...
                      </motion.div>
                    ) : (
                      <motion.p
                        key="question"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-slate-300 leading-relaxed font-medium"
                      >
                        {generatedDemoQ}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Company Logo Ticker */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-y border-slate-800/40 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500">
          <span className="text-xs font-bold uppercase tracking-widest">Our alumni secure roles at leading teams</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <span key={logo} className="font-extrabold text-sm tracking-wider hover:text-slate-300 transition-colors cursor-default select-none">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview mockup panel */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Step into the SaaS Console</h2>
          <p className="text-slate-400 text-sm">Experience the real-time webcam telemetry, gaze tracker feedback, and dynamic analytical charts.</p>
        </div>

        <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl shadow-purple-500/10">
          <div className="rounded-xl overflow-hidden glass-card aspect-video flex flex-col p-6 bg-slate-900/60 relative text-left">
            {/* Header bar mock */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-[10px] text-slate-500">interviewiq.ai/dashboard/session-preview</span>
              <div className="w-10"></div>
            </div>

            {/* Content mockup mapping the screen elements */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full items-stretch">
              {/* Question & answer section */}
              <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 space-y-2">
                  <span className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-wider">Question 2 of 5</span>
                  <p className="text-xs text-slate-200 font-bold leading-normal">
                    How do you manage cross-origin request policies (CORS) in an Express gateway serving React bundles?
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-850 h-32 relative flex flex-col justify-between">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Transcription Feed</span>
                  <p className="text-[11px] text-slate-400 italic">"I configure CORS headers using the standard cors middle-tier dependencies, setting whitelist origins..."</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><Volume2 className="h-3 w-3" /> Transcribing...</span>
                    <span>120 words</span>
                  </div>
                </div>
              </div>

              {/* Webcam & logs simulation */}
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-xl overflow-hidden aspect-video relative bg-slate-950 border border-slate-850 flex items-center justify-center">
                  <Video className="h-8 w-8 text-slate-650" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#6C63FF]/20 border border-[#6C63FF]/30 text-[#A78BFA] text-[9px] font-bold">
                    Webcam simulator active
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 p-2 rounded bg-slate-900/80 backdrop-blur border border-slate-800 text-[9px] text-emerald-400 font-semibold">
                    Posture check: Aligned straight
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 space-y-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Confidence Index</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-850">
                      <span className="text-slate-500">Eye contact</span>
                      <span className="block font-bold text-emerald-400">92% Optimal</span>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-850">
                      <span className="text-slate-500">Dominant emotion</span>
                      <span className="block font-bold text-slate-300">Neutral</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/40 relative z-10 text-center">
        <div className="space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Revolutionize Your Interview Prep</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Get feedback on all dimensions of your mock interview performance, powered by artificial intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col h-full justify-between text-left"
            >
              <div>
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-6 shadow-inner"
                  style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}25` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-base mb-2 text-slate-100">{feature.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/40 relative z-10 text-center">
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Simple, Predictable Pricing</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Start practicing for free, then upgrade to premium features to unlock webcam intelligence.</p>
        </div>

        {/* Pricing billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <span className={`text-xs font-bold transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
          <button 
            type="button" 
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 relative transition-colors focus:outline-none cursor-pointer"
          >
            <div 
              className={`h-4.5 w-4.5 rounded-full bg-[#6C63FF] transition-all absolute top-0.5 ${
                billingPeriod === 'yearly' ? 'left-[26px]' : 'left-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold transition-colors ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Yearly Billing</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">
              Save 20%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricing.map((tier) => (
            <div 
              key={tier.name} 
              className={`glass-card rounded-2xl p-8 relative flex flex-col justify-between h-full text-left ${
                tier.isPopular ? 'border-2 border-[#6C63FF]/60 shadow-xl shadow-purple-500/5' : ''
              }`}
            >
              {tier.isPopular && (
                <span className="absolute top-[-14px] right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white text-[9px] uppercase font-bold tracking-wider">
                  Popular Plan
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{tier.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{tier.description}</p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">
                    {billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                  </span>
                  <span className="text-slate-400 text-xs ml-2">/ month</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-800/80">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-350">
                      <CheckCircle className="h-4 w-4 text-[#8B5CF6] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={tier.action}
                className={`w-full py-3 rounded-xl font-bold mt-8 transition-all text-xs cursor-pointer ${
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

      {/* Accordion FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-800/40 relative z-10 text-left">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Have queries about the mock architecture? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-xl border border-slate-850 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs md:text-sm text-slate-200 hover:text-white transition-colors cursor-pointer text-left focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    activeFaq === idx ? 'transform rotate-180 text-[#8B5CF6]' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850/50 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs gap-4 relative z-10">
        <div>
          <span>&copy; 2026 Aletheia AI Inc. All rights reserved.</span>
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
