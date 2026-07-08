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
  TrendingDown, 
  CheckCircle2, 
  HelpCircle,
  Clock,
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
          <HelpCircle className="h-10 w-10 text-rose-400" />
          <span>Feedback report not found.</span>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-800 rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

  // Prep Radar Data for performance
  const performanceRadarData = [
    { subject: 'Technical Accuracy', A: report.contentMetrics.technicalAccuracy, fullMark: 100 },
    { subject: 'Relevance', A: report.contentMetrics.relevance, fullMark: 100 },
    { subject: 'Depth', A: report.contentMetrics.depth, fullMark: 100 },
    { subject: 'Pacing & Clarity', A: report.verbalMetrics.clarityScore, fullMark: 100 },
    { subject: 'Eye Contact', A: report.behavioralMetrics.eyeContactScore, fullMark: 100 },
    { subject: 'Body Posture', A: report.behavioralMetrics.postureScore, fullMark: 100 },
  ];

  // Prep Bar Data for emotions
  const emotionBarData = report.behavioralMetrics.emotionDistribution.map(item => ({
    name: item.emotion,
    percentage: item.percentage
  }));

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="Feedback Report" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto">
          {/* Back button */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Banner Score Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {/* Score Ring Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-[#1E293B] to-slate-900/60">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6C63FF]"></div>
              <Trophy className="h-10 w-10 text-amber-400 mb-2 animate-bounce" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall Mock IQ</span>
              <div className="text-5xl font-extrabold text-white mt-1">{report.overallScore}</div>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">Passing standard: 75/100</span>
            </div>

            {/* Assessment Narrative Summary */}
            <div className="md:col-span-3 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div>
                <span className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-wider block">AI Narrative Summary</span>
                <h3 className="font-bold text-lg text-slate-200 mt-0.5">Evaluation Profile Details</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-slate-850">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Performance Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Performance Radar */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-200">Skills Dimension Assessment</h4>
                <p className="text-[11px] text-slate-500">Breakdown scoring of core verbal, facial contact, and content characteristics.</p>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceRadarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                    <Radar name="Candidate" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '8px', color: '#F8FAFC', fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Emotion tracking bar chart */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-200">Gaze Emotion Distribution</h4>
                <p className="text-[11px] text-slate-500">Distribution analysis of facial expressions tracked during active speaking timelines.</p>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionBarData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '8px', color: '#F8FAFC', fontSize: '11px' }} />
                    <Bar dataKey="percentage" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Strengths */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-slate-250">Key Strengths</h4>
              </div>
              <ul className="space-y-3">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-normal">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Compass className="h-5 w-5 text-[#8B5CF6]" />
                <h4 className="font-bold text-sm text-slate-250">Development Recommendations</h4>
              </div>
              <ul className="space-y-3">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-normal">
                    <Activity className="h-4 w-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
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
