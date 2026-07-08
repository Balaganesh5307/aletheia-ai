import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  achievements: IAchievement[];
  stats: {
    totalInterviews: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/profile');
      const data = response.data;
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        achievements: data.achievements || [],
        stats: data.stats || { totalInterviews: 0, averageScore: 0, totalTimeSpent: 0 }
      });
    } catch (err) {
      console.error('Session verification failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      const response = await api.put('/auth/profile', { name, email });
      setUser(prev => prev ? { ...prev, name: response.data.user.name, email: response.data.user.email } : null);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Update profile failed');
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      const data = response.data;
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        achievements: data.achievements || [],
        stats: data.stats || { totalInterviews: 0, averageScore: 0, totalTimeSpent: 0 }
      });
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
