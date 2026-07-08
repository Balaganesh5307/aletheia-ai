import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedbackReport extends Document {
  user: mongoose.Types.ObjectId;
  interview: mongoose.Types.ObjectId;
  summary: string;
  overallScore: number;
  verbalMetrics: {
    fillerWordsUsed: Array<{ word: string; count: number }>;
    pacingWordsPerMinute: number;
    clarityScore: number;
  };
  behavioralMetrics: {
    eyeContactScore: number; // percentage
    postureScore: number; // percentage
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
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackReportSchema = new Schema<IFeedbackReport>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  interview: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
  summary: { type: String, required: true },
  overallScore: { type: Number, required: true },
  verbalMetrics: {
    fillerWordsUsed: [{ word: String, count: Number }],
    pacingWordsPerMinute: { type: Number, default: 130 },
    clarityScore: { type: Number, default: 0 }
  },
  behavioralMetrics: {
    eyeContactScore: { type: Number, default: 0 },
    postureScore: { type: Number, default: 0 },
    dominantEmotion: { type: String, default: 'Neutral' },
    emotionDistribution: [{ emotion: String, percentage: Number }]
  },
  contentMetrics: {
    technicalAccuracy: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    depth: { type: Number, default: 0 }
  },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model<IFeedbackReport>('FeedbackReport', FeedbackReportSchema);
