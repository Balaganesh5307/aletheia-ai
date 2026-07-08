import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;
  fileName: string;
  filePath: string;
  parsedContent: {
    skills: string[];
    experience: Array<{
      role: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      school: string;
      year: string;
    }>;
    summary: string;
  };
  rawText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  parsedContent: {
    skills: [{ type: String }],
    experience: [{
      role: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      school: String,
      year: String
    }],
    summary: String
  },
  rawText: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IResume>('Resume', ResumeSchema);
