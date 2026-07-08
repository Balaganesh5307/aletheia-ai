import React, { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import api from '../services/api';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieAnimation from '../components/shared/LottieAnimation';
import FloatingShapes from '../components/shared/FloatingShapes';

interface IResume {
  _id: string;
  fileName: string;
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
  createdAt: string;
}

const ResumeUpload: React.FC = () => {
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resumes');
      setResumes(response.data);
      if (response.data.length > 0 && !selectedResume) {
        setSelectedResume(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError('');
    setSuccess('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Resume successfully uploaded and parsed!');
      setFile(null);
      fetchResumes();
      setSelectedResume(response.data.resume);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error uploading resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      fetchResumes();
      if (selectedResume?._id === id) {
        setSelectedResume(null);
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />
      
      <div className="flex-1 pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Visual decoration layers */}
        <FloatingShapes variant="minimal" />
        <div className="liquid-blob liquid-blob-accent w-[350px] h-[350px] top-[10%] right-[-5%]"></div>
        <div className="absolute inset-0 bg-grid-pattern-dense pointer-events-none opacity-40 z-0"></div>

        <Header title="Upload Resume" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto relative z-[1]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Upload Form and List */}
            <div className="space-y-8">
              {/* Drag Drop Area */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-200">Resume Parser</h3>
                  <p className="text-slate-550 text-xs mt-1">Upload your resume to extract candidate skill sets and automatically inject them into custom mock interviews.</p>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                      isDragOver 
                        ? 'border-[#6C63FF] bg-[#6C63FF]/5' 
                        : 'border-slate-850 hover:border-slate-800 bg-slate-900/20'
                    }`}
                  >
                    {/* Laser scanning line during parsing uploads */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-[#6C63FF]/5 overflow-hidden z-10">
                        <motion.div 
                          animate={{ y: ['0%', '100%', '0%'] }} 
                          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                          className="w-full h-1 bg-gradient-to-r from-transparent via-[#6C63FF] to-transparent shadow-[0_0_12px_#6C63FF] absolute"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      id="resume-file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.doc,.txt"
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    {isUploading ? (
                      <LottieAnimation 
                        src="https://assets9.lottiefiles.com/packages/lf20_wdqlgbyg.json" 
                        className="w-32 h-32 mb-2"
                      />
                    ) : (
                      <UploadCloud className="h-10 w-10 text-slate-500 mb-4 transition-transform hover:scale-110 duration-300" />
                    )}

                    {file ? (
                      <div className="space-y-1 relative z-20">
                        <p className="text-sm font-bold text-slate-200 truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div className="space-y-1 relative z-20">
                        <p className="text-sm font-semibold text-slate-350">Drag & drop your resume file</p>
                        <p className="text-[11px] text-slate-550">Supports PDF, DOCX, DOC, or TXT (Max 10MB)</p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  {file && (
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-3 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/15 cursor-pointer"
                    >
                      {isUploading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Parsing with Gemini AI...</span>
                        </>
                      ) : (
                        <span>Start Extraction</span>
                      )}
                    </button>
                  )}
                </form>
              </div>

              {/* Uploaded Resumes List */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Uploaded Resumes</h4>
                
                {resumes.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No resumes uploaded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((res) => (
                      <div 
                        key={res._id}
                        onClick={() => setSelectedResume(res)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedResume?._id === res._id
                            ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/30'
                            : 'bg-slate-900/30 border-slate-850 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          <div className="overflow-hidden text-left">
                            <p className="text-xs font-semibold text-slate-200 truncate">{res.fileName}</p>
                            <span className="text-[9px] text-slate-550">
                              {new Date(res.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(res._id);
                          }}
                          className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Parsed Resume Details Viewer */}
            <div>
              <AnimatePresence mode="wait">
                {selectedResume ? (
                  <motion.div 
                    key={selectedResume._id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 text-left"
                  >
                    {/* Top metadata */}
                    <div className="flex justify-between items-start border-b border-slate-850 pb-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-100 truncate max-w-xs">{selectedResume.fileName}</h3>
                        <span className="text-[10px] text-slate-550">Gemini Intelligence Profile</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                        <Check className="h-3 w-3" />
                        <span>Ready</span>
                      </div>
                    </div>

                    {/* Summary */}
                    {selectedResume.parsedContent?.summary && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#A78BFA]">Professional Summary</span>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-slate-850">
                          {selectedResume.parsedContent.summary}
                        </p>
                      </div>
                    )}

                    {/* Skills Grid */}
                    {selectedResume.parsedContent?.skills && selectedResume.parsedContent.skills.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#A78BFA]">Extracted Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.parsedContent.skills.map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-850 text-slate-305 text-[10px] font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work Experience */}
                    {selectedResume.parsedContent?.experience && selectedResume.parsedContent.experience.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#A78BFA] block">Work Experience</span>
                        <div className="space-y-3">
                          {selectedResume.parsedContent.experience.map((exp, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 text-left space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold text-slate-200">{exp.role}</span>
                                <span className="text-slate-500 text-[10px]">{exp.duration}</span>
                              </div>
                              <span className="block text-[11px] text-[#6C63FF] font-semibold">{exp.company}</span>
                              {exp.description && (
                                <p className="text-[11px] text-slate-400 pt-2 leading-relaxed border-t border-slate-900/50 mt-2">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {selectedResume.parsedContent?.education && selectedResume.parsedContent.education.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#A78BFA] block">Education</span>
                        <div className="space-y-3">
                          {selectedResume.parsedContent.education.map((edu, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/20 border border-slate-850 text-left">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold text-slate-200">{edu.degree}</span>
                                <span className="text-slate-500 text-[10px]">{edu.year}</span>
                              </div>
                              <span className="block text-[11px] text-slate-400 mt-1">{edu.school}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center h-full flex flex-col items-center justify-center space-y-4 min-h-[400px]">
                    <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-850">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-350">Resume Profile Viewer</h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Upload and select a resume to view extracted profile insights.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeUpload;
