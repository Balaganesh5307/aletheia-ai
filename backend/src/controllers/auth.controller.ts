import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IAchievement } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_interview_iq_key';
const JWT_EXPIRES_IN = '7d';

const DEFAULT_ACHIEVEMENTS: IAchievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Create your InterviewIQ AI account',
    icon: 'UserPlus',
    unlockedAt: new Date()
  }
];

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      achievements: DEFAULT_ACHIEVEMENTS,
      stats: {
        totalInterviews: 0,
        averageScore: 0,
        totalTimeSpent: 0
      }
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        achievements: newUser.achievements,
        stats: newUser.stats
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Direct bypass configurations for developer preview accounts
    if (email === 'user@gmail.com' && password === 'user123') {
      const mockToken = jwt.sign({ id: '507f1f77bcf86cd799439011', email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.status(200).json({
        token: mockToken,
        user: {
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe (Candidate)',
          email: 'user@gmail.com',
          achievements: DEFAULT_ACHIEVEMENTS,
          stats: {
            totalInterviews: 4,
            averageScore: 82,
            totalTimeSpent: 480
          }
        }
      });
      return;
    }

    if (email === 'admin@gmail.com' && password === 'admin123') {
      const mockToken = jwt.sign({ id: '507f1f77bcf86cd799439022', email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.status(200).json({
        token: mockToken,
        user: {
          id: '507f1f77bcf86cd799439022',
          name: 'Jane Smith (Admin)',
          email: 'admin@gmail.com',
          achievements: [
            ...DEFAULT_ACHIEVEMENTS,
            { id: 'expert_90', title: 'Perfect IQ', description: 'Score 90+ in a session', icon: 'Zap', unlockedAt: new Date() }
          ],
          stats: {
            totalInterviews: 12,
            averageScore: 94,
            totalTimeSpent: 1440
          }
        }
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        achievements: user.achievements,
        stats: user.stats
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found with this email' });
      return;
    }

    // In a real application, we would send a link with token.
    // For demonstration, we'll return a mock successful response with token.
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    res.status(200).json({
      message: 'Password reset instructions sent to your email.',
      resetToken // Returned for local testing ease
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ message: 'Token and new password are required' });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired password reset token' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now login.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        achievements: user.achievements,
        stats: user.stats
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
