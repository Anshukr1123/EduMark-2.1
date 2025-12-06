
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { MOCK_COLLEGE_INFO } from '../../constants';
import { Button } from '../../components/UIComponents';
import { Mail, Lock, User as UserIcon, Phone, GraduationCap, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';

interface RegisterFormProps {
  onLogin: (user: User) => void;
  onLoginClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onLogin, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              role: UserRole.STUDENT,
              phone: formData.phone
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.session) {
             // Auto-login if session exists (email confirmation disabled)
             const newUser: User = {
                id: data.user.id,
                name: formData.name,
                email: formData.email,
                role: UserRole.STUDENT,
                phone: formData.phone,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
             };
             onLogin(newUser);
          } else {
             // Email confirmation required
             setSuccessMessage("Registration successful! Please check your email to verify your account.");
             setIsLoading(false);
          }
        }
      } catch (err: any) {
        console.error("Registration Error:", err);
        setError(err.message || 'Registration failed. Please try again.');
        setIsLoading(false);
      }
    } else {
      // Mock Registration Flow
      setTimeout(() => {
        setSuccessMessage("Demo Registration Successful! Redirecting...");
        setTimeout(() => {
            const mockUser: User = {
                id: `new-${Date.now()}`,
                name: formData.name,
                email: formData.email,
                role: UserRole.STUDENT,
                phone: formData.phone,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
            };
            onLogin(mockUser);
        }, 1500);
      }, 1500);
    }
  };

  if (successMessage) {
      return (
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden p-8 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h3>
            <p className="text-slate-600 mb-8">{successMessage}</p>
            <Button onClick={onLoginClick} variant="outline" className="w-full">
                Back to Login
            </Button>
        </div>
      );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-right-8 duration-500">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <button onClick={onLoginClick} className="absolute top-6 left-6 text-indigo-100 hover:text-white transition-colors flex items-center text-xs font-bold uppercase tracking-wide z-10">
                    <ArrowLeft className="w-4 h-4 mr-1"/> Back to Login
                </button>
                <div className="mt-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-inner">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Student Registration</h2>
                    <p className="text-indigo-100 text-sm">Join {MOCK_COLLEGE_INFO.name}</p>
                </div>
            </div>

            <div className="p-8">
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <div className="relative group">
                            <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                placeholder="Password (Min 6 chars)"
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                placeholder="Confirm Password"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg flex items-center border border-red-100 animate-in shake"><AlertCircle className="w-3 h-3 mr-2 shrink-0"/>{error}</div>}

                    <Button type="submit" className="w-full py-3 shadow-lg shadow-indigo-200 mt-2 hover:shadow-indigo-300 transition-all duration-300" isLoading={isLoading}>
                        Create Account
                    </Button>
                </form>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                <p className="text-xs text-slate-500">
                    By registering, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms</a> & <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    </div>
  );
};
