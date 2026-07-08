import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { 
  Trophy, 
  Sparkles, 
  Activity, 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle,
  Compass
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import LottieAnimation from '../components/shared/LottieAnimation';
import FloatingShapes from '../components/shared/FloatingShapes';
import AnimatedCounter from '../components/shared/AnimatedCounter';

interface IFeedbackReport {
  overallScore: number;
  summary: string;
  verbalMetrics: {
    fillerWordsUsed: Array<{ word: string; count: number }>;
    pacingWordsPerMinute: number;
    clarityScore: number;
  };
  behavioralMetrics: {
    eyeContactScore: number;
    postureScore: number;
    dominantEmotion: string;
    emotionDistribution: Array<{ emotion: string; percentage: number }>;
  };
  contentMetrics: {
    technicalAccuracy: number;
    relevance: number;
    depth: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const FeedbackReport: React.FC = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<IFeedbackReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/feedback/${interviewId}`);
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin"></div>
          <span>Synthesizing evaluation metrics...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <HelpCircle className="h-10 w-10 text-rose-450" />
          <span>Feedback report not found.</span>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-900 rounded-xl cursor-pointer">Go Back</button>
        </div>
      </div>
    );
  }

  const performanceRadarData = [
    { subject: 'Technical Accuracy', A: report.contentMetrics.technicalAccuracy },
    { subject: 'Relevance', A: report.contentMetrics.relevance },
    { subject: 'Depth', A: report.contentMetrics.depth },
    { subject: 'Clarity', A: report.verbalMetrics.clarityScore },
    { subject: 'Eye Contact', A: report.behavioralMetrics.eyeContactScore },
    { subject: 'Posture', A: report.behavioralMetrics.postureScore },
  ];

  const emotionBarData = report.behavioralMetrics.emotionDistribution.map(item => ({
    name: item.emotion,
    percentage: item.percentage
  }));

  // Circle path calculations for rating score ring
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (report.overallScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Visual decoration layers */}
        <FloatingShapes variant="minimal" />
        <div className="liquid-blob liquid-blob-primary w-[350px] h-[350px] top-[-5%] right-[-5%]"></div>
        <div className="absolute inset-0 bg-grid-pattern-dense pointer-events-none opacity-40 z-0"></div>

        <Header title="Feedback Report" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto relative z-[1]">
          {/* Back button & Exporter */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <TrendingUp className="h-4 w-4 text-[#8B5CF6]" />
              <span>Download PDF Report</span>
            </button>
          </div>

          {/* Banner Score Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            
            {/* Animated Score Ring Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-[#1E293B] to-slate-900/60 min-h-[220px]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] z-10"></div>
              
              {/* Confetti Overlay for passing/good scores */}
              {report.overallScore >= 70 && (
                <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
                  <LottieAnimation 
                    src="https://assets10.lottiefiles.com/packages/lf20_touoh4ky.json" 
                    className="w-full h-full"
                  />
                </div>
              )}
              
              {/* Radial Progress Ring SVG */}
              <div className="relative flex items-center justify-center mb-2 z-10">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r={circleRadius} stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
                  <motion.circle 
                    cx="48" 
                    cy="48" 
                    r={circleRadius} 
                    stroke="#8B5CF6" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    <AnimatedCounter end={report.overallScore} duration={1200} />
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Mock IQ</span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Assessment Level</span>
              <span className="text-xs font-bold text-[#A78BFA] mt-0.5">
                {report.overallScore >= 85 ? 'Distinguished' : report.overallScore >= 75 ? 'Competent' : 'Developing'}
              </span>
            </div>

            {/* Assessment Narrative Summary */}
            <div className="md:col-span-3 glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
              <div>
                <span className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-widest block">AI Narrative Summary</span>
                <h3 className="font-bold text-base text-slate-200 mt-0.5">Evaluation Profile Details</h3>
              </div>
              <p className="text-xs md:text-sm text-slate-350 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-slate-850">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Performance Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Performance Radar */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
              <div>
                <h4 className="font-bold text-sm text-slate-200">Skills Dimension Assessment</h4>
                <p className="text-[10px] text-slate-500">Breakdown scoring of core verbal, facial contact, and content characteristics.</p>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceRadarData}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={9} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={8} />
                    <Radar name="Candidate" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Emotion tracking bar chart */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
              <div>
                <h4 className="font-bold text-sm text-slate-200">Gaze Emotion Distribution</h4>
                <p className="text-[10px] text-slate-500">Distribution analysis of facial expressions tracked during active speaking timelines.</p>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionBarData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} />
                    <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '11px' }} />
                    <Bar dataKey="percentage" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Strengths */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-slate-200">Key Strengths</h4>
              </div>
              <ul className="space-y-3">
                {report.strengths.map((str, idx) => (
                  <motion.li 
                    key={idx} 
                    whileHover={{ x: 2 }}
                    className="flex gap-2.5 text-xs text-slate-350 leading-normal"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Compass className="h-5 w-5 text-[#8B5CF6]" />
                <h4 className="font-bold text-sm text-slate-200">Development Recommendations</h4>
              </div>
              <ul className="space-y-3">
                {report.recommendations.map((rec, idx) => (
                  <motion.li 
                    key={idx} 
                    whileHover={{ x: 2 }}
                    className="flex gap-2.5 text-xs text-slate-350 leading-normal"
                  >
                    <Activity className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedbackReport;
