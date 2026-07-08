import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.middleware';
import * as authCtrl from '../controllers/auth.controller';
import * as resumeCtrl from '../controllers/resume.controller';
import * as interviewCtrl from '../controllers/interview.controller';

const router = Router();

// Configure Multer Storage for Resumes
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Authentication Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.post('/auth/forgot-password', authCtrl.forgotPassword);
router.post('/auth/reset-password', authCtrl.resetPassword);
router.get('/auth/profile', authenticateToken, authCtrl.getProfile);
router.put('/auth/profile', authenticateToken, authCtrl.updateProfile);

// Resume Routes
router.post('/resumes/upload', authenticateToken, upload.single('resume'), resumeCtrl.uploadResume);
router.get('/resumes', authenticateToken, resumeCtrl.getUserResumes);
router.delete('/resumes/:id', authenticateToken, resumeCtrl.deleteResume);

// Interview Routes
router.post('/interviews/create', authenticateToken, interviewCtrl.createInterview);
router.get('/interviews/history', authenticateToken, interviewCtrl.getUserInterviews);
router.get('/interviews/:id', authenticateToken, interviewCtrl.getInterviewById);
router.post('/interviews/answer', authenticateToken, interviewCtrl.submitAnswer);
router.post('/interviews/complete', authenticateToken, interviewCtrl.completeInterview);

// Feedback & Analytics Routes
router.get('/feedback/:interviewId', authenticateToken, interviewCtrl.getFeedbackReport);
router.get('/analytics/overview', authenticateToken, interviewCtrl.getAnalytics);

// Admin Management Routes
router.get('/admin/overview', authenticateToken, authCtrl.getAdminOverview);
router.get('/admin/users', authenticateToken, authCtrl.getAllUsers);
router.delete('/admin/users/:userId', authenticateToken, authCtrl.deleteUser);

export default router;
