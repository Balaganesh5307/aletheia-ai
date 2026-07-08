import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  id: string;
  questionText: string;
  type: string; // e.g. behavioral, technical, situational
  sampleAnswer?: string;
  userAnswer?: string;
  transcript?: string;
  audioPath?: string;
  scores?: {
    relevance: number;
    clarity: number;
    depth: number;
    overall: number;
  };
  behavioralData?: {
    eyeContactScore: number; // percentage
    goodPosturePercentage: number; // percentage
    dominantEmotion: string;
    fillerWordsCount: number;
  };
}

export interface IInterview extends Document {
  user: mongoose.Types.ObjectId;
  resumeId?: mongoose.Types.ObjectId;
  jobTitle: string;
  difficulty: 'Entry' | 'Mid' | 'Senior';
  durationLimit: number; // in minutes
  status: 'scheduled' | 'completed' | 'in-progress';
  questions: IQuestion[];
  overallScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
  type: { type: String, required: true },
  sampleAnswer: { type: String },
  userAnswer: { type: String },
  transcript: { type: String },
  audioPath: { type: String },
  scores: {
    relevance: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    depth: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  behavioralData: {
    eyeContactScore: { type: Number, default: 100 },
    goodPosturePercentage: { type: Number, default: 100 },
    dominantEmotion: { type: String, default: 'Neutral' },
    fillerWordsCount: { type: Number, default: 0 }
  }
});

const InterviewSchema = new Schema<IInterview>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
  jobTitle: { type: String, required: true },
  difficulty: { type: String, enum: ['Entry', 'Mid', 'Senior'], required: true },
  durationLimit: { type: Number, default: 15 },
  status: { type: String, enum: ['scheduled', 'completed', 'in-progress'], default: 'scheduled' },
  questions: [QuestionSchema],
  overallScore: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
