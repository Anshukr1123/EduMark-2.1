
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Button } from '../../components/UIComponents';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, GraduationCap } from 'lucide-react';
import { account, databases, isAppwriteConfigured, ID, DATABASE_ID, COLLECTIONS } from '../../appwriteClient';

interface SignUpFormProps {
  onLogin: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onLogin, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    // 1. APPWRITE REGISTRATION
    if (isAppwriteConfigured) {
      try {
        const userId = ID.unique();
        await account.create(
          userId,
          formData.email,
          formData.password,
          formData.fullName
        );

        // Create profile document
        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.PROFILES,
                userId, // Use same ID as Auth ID for easier lookups
                {
                    name: formData.fullName,
                    email: formData.email,
                    role: UserRole.STUDENT
                }
            );
        } catch (dbError) {
            console.warn("Profile creation failed, user created:", dbError);
        }

        // Login session immediately to verify
        // await account.createEmailPasswordSession(formData.email, formData.password);

        setSuccessMessage("Account created successfully! Please log in.");
      } catch (err: any) {
        console.error("Signup Error:", err);
        setError(err.message || 'Registration failed.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 2. MOCK REGISTRATION (Fallback)
    setTimeout(() => {
      const newUser: User = {
        id: `stu-${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        role: UserRole.STUDENT,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`,
        departmentId: 'General'
      };
      
      // Auto login for mock
      onLogin(newUser);
      setIsLoading(false);
    }, 1500);
  };

  if (successMessage) {
    return (
        <div className="p-8 pb-10 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                Welcome, <span className="font-bold text-slate-900">{formData.fullName}</span>.<br/>
                Please log in to continue to your portal.
            </p>
            <Button onClick={onSwitchToLogin} className="w-full">
                Proceed to Login
            </Button>
        </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-left-8 duration-500">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <GraduationCap className="w-6 h-6 text-indigo-100" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md border border-white/10">Student Portal</span>
                    </div>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-indigo-100 text-sm mt-1">Join the campus community today.</p>
                </div>
            </div>

            <div className="p-8">
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all"
                                placeholder="student@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all"
                                placeholder="Create a password (min 8 chars)"
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
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all"
                                placeholder="Confirm password"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg flex items-center border border-red-100 animate-in shake">
                            <AlertCircle className="w-4 h-4 mr-2 shrink-0"/> {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full py-3 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all mt-2" isLoading={isLoading}>
                        Register Student Account <ArrowRight className="w-4 h-4 ml-2"/>
                    </Button>
                </form>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                <p className="text-sm text-slate-600">
                    Already have an account? 
                    <button onClick={onSwitchToLogin} className="text-indigo-600 font-bold hover:underline ml-1">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};