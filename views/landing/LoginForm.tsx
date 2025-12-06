
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { MOCK_USERS, MOCK_COLLEGE_INFO } from '../../constants';
import { Button } from '../../components/UIComponents';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Smartphone, CheckCircle2, Loader2, User as UserIcon, GraduationCap, ShieldCheck, Heart, ArrowLeft, MapPin, Phone, Award } from 'lucide-react';
import { account, databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, Query } from '../../appwriteClient';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToSignUp?: () => void; // New prop
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.STUDENT);
  const [loginMethod, setLoginMethod] = useState<'EMAIL' | 'MOBILE'>('EMAIL');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  // Auto-fill for demo convenience (Only if Appwrite not configured)
  useEffect(() => {
     if (isAppwriteConfigured) return;
     const mockUser = MOCK_USERS.find(u => u.role === activeRole);
     if (mockUser) {
         setEmail(mockUser.email);
         setPhone(mockUser.phone || '9876543210');
         setPassword(''); 
         setOtp('');
         setOtpSent(false);
         setError('');
     }
  }, [activeRole]);

  const fetchUserProfile = async (userId: string, email: string, name: string) => {
      try {
          // Attempt to fetch profile from 'profiles' collection
          const response = await databases.listDocuments(
              DATABASE_ID,
              COLLECTIONS.PROFILES,
              [Query.equal('email', email)] // Searching by email as ID might differ or be mapped
          );
          
          if (response.documents.length > 0) {
              const data = response.documents[0];
              const user: User = {
                  id: data.$id, // Using Document ID as User ID
                  name: data.name,
                  email: data.email,
                  role: (data.role as UserRole) || UserRole.STUDENT,
                  avatar: data.avatar,
                  departmentId: data.department_id,
                  phone: data.phone,
                  address: data.address
              };
              onLogin(user);
          } else {
              // Fallback: Create a basic user object from auth data if profile doc is missing
              const fallbackUser: User = {
                  id: userId,
                  name: name || email.split('@')[0],
                  email: email,
                  role: UserRole.STUDENT,
                  avatar: 'https://picsum.photos/200'
              };
              onLogin(fallbackUser);
          }
      } catch (err) {
          console.error("Error handling user profile:", err);
          setError("Logged in, but failed to load user profile.");
          setIsLoading(false);
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 1. APPWRITE LOGIN FLOW
    if (isAppwriteConfigured) {
        if (loginMethod === 'EMAIL') {
            try {
                // Check if session exists (optional cleanup) or just try login
                try {
                    await account.createEmailPasswordSession(email, password);
                } catch(e) {
                    // Ignore if already logged in or handle specific errors
                }
                
                const sessionUser = await account.get();
                
                if (sessionUser) {
                    await fetchUserProfile(sessionUser.$id, sessionUser.email, sessionUser.name);
                }
            } catch (err: any) {
                console.error("Login Error:", err);
                setError(err.message || 'Login failed. Please check your credentials.');
                setIsLoading(false);
            }
        } else {
            setError("Mobile OTP login requires Appwrite Phone Auth setup.");
            setIsLoading(false);
        }
        return;
    }

    // 2. MOCK LOGIN FLOW (Fallback)
    setTimeout(() => {
        // Step 1: Send OTP
        if (loginMethod === 'MOBILE' && !otpSent) {
            setOtpSent(true);
            setIsLoading(false);
            setOtp('1234'); 
            setError('');
            return;
        }

        // Step 2: Verify OTP
        if (loginMethod === 'MOBILE' && otpSent) {
            if (otp !== '1234') {
                setError('Invalid OTP. Please enter 1234.');
                setIsLoading(false);
                return;
            }
        }

        const user = MOCK_USERS.find(u => u.role === activeRole);
        if (user) {
            onLogin(user);
        } else {
            setError('Authentication failed. Please try again.');
            setIsLoading(false);
        }
    }, 1500);
  };

  const handleGoogleLogin = async () => {
      setIsGoogleLoading(true);
      setError('');

      if (isAppwriteConfigured) {
          try {
              account.createOAuth2Session(
                  'google',
                  window.location.origin, // Success URL
                  window.location.origin  // Failure URL
              );
          } catch (err: any) {
              console.error("Google Login Error:", err);
              setError(err.message || 'Failed to connect with Google.');
              setIsGoogleLoading(false);
          }
      } else {
          setTimeout(() => {
              const user = MOCK_USERS.find(u => u.role === activeRole);
              if (user) onLogin(user);
              else setError("Simulation failed.");
              setIsGoogleLoading(false);
          }, 2000);
      }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!resetEmail) return;
      setIsResetLoading(true);
      
      if (isAppwriteConfigured) {
          try {
              await account.createRecovery(
                  resetEmail,
                  window.location.origin + '/reset-password'
              );
              setResetStatus('SUCCESS');
          } catch (err: any) {
              setError(err.message);
          } finally {
              setIsResetLoading(false);
          }
      } else {
          setTimeout(() => {
              setIsResetLoading(false);
              setResetStatus('SUCCESS');
          }, 1500);
      }
  };

  const roles = [
    { role: UserRole.STUDENT, label: 'Student', icon: UserIcon },
    { role: UserRole.TEACHER, label: 'Faculty', icon: GraduationCap },
    { role: UserRole.ADMIN, label: 'Admin', icon: ShieldCheck },
    { role: UserRole.PARENT, label: 'Parent', icon: Heart },
  ];

  if (isForgotPassword) {
      return (
        <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-in slide-in-from-right-8 duration-300">
            <button onClick={() => { setIsForgotPassword(false); setResetStatus('IDLE'); }} className="mb-4 flex items-center text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
            
            {resetStatus === 'SUCCESS' ? (
                <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
                    <p className="text-slate-500 text-sm mb-6">We've sent a password reset link to <br/><span className="font-bold text-slate-700">{resetEmail}</span></p>
                    <Button onClick={() => { setIsForgotPassword(false); setResetStatus('IDLE'); }} className="w-full">Return to Login</Button>
                </div>
            ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                        <p className="text-slate-500 text-sm">Enter your email to receive a reset link.</p>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-lg outline-none text-sm transition-all"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-2.5 shadow-lg shadow-indigo-100" isLoading={isResetLoading}>
                        Send Reset Link
                    </Button>
                </form>
            )}
        </div>
      );
  }

  return (
    <div id="login-form" className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-right-8 duration-700">
            
            {/* Prominent College Branding Header */}
            <div className="bg-gradient-to-b from-indigo-700 to-indigo-800 p-8 pb-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center mb-4 shadow-xl border-2 border-white/20 ring-4 ring-white/5 transform hover:scale-105 transition-transform duration-500">
                        <GraduationCap className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md font-serif">
                        {MOCK_COLLEGE_INFO.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-indigo-50 border border-white/10 backdrop-blur-md shadow-sm uppercase tracking-wider">
                            {MOCK_COLLEGE_INFO.accreditation}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-8 pb-6 -mt-4 bg-white rounded-t-3xl relative z-20">
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Only show Role Selector if in Mock Mode or debugging */}
                    {!isAppwriteConfigured && (
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {roles.map(r => (
                                <button
                                    key={r.role}
                                    type="button"
                                    onClick={() => setActiveRole(r.role)}
                                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${activeRole === r.role ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200 transform scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                                >
                                    <r.icon className={`w-5 h-5 mb-1 ${activeRole === r.role ? 'stroke-[2.5px]' : 'stroke-2'}`}/>
                                    <span className="text-[9px] font-bold uppercase tracking-wide">{r.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Login Method Tabs */}
                    <div className="flex border-b border-slate-200 mb-4">
                        <button type="button" onClick={() => {setLoginMethod('EMAIL'); setError(''); setOtpSent(false);}} className={`flex-1 pb-2 text-xs font-bold border-b-2 transition-colors ${loginMethod === 'EMAIL' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Email ID</button>
                        <button type="button" onClick={() => {setLoginMethod('MOBILE'); setError('');}} className={`flex-1 pb-2 text-xs font-bold border-b-2 transition-colors ${loginMethod === 'MOBILE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Mobile OTP</button>
                    </div>

                    {loginMethod === 'EMAIL' ? (
                        <>
                            <div className="space-y-1">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                        placeholder="Password"
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
                                <div className="text-right">
                                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative group">
                                <Smartphone className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-lg outline-none text-sm transition-all placeholder:text-slate-400"
                                    placeholder="Mobile Number"
                                    disabled={otpSent}
                                />
                                {otpSent && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500"/>}
                            </div>
                            {otpSent && (
                                <div className="animate-in slide-in-from-top-2">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border-2 border-indigo-100 focus:border-indigo-500 rounded-lg outline-none text-sm text-center tracking-[0.5em] font-bold text-slate-800"
                                        placeholder="••••"
                                        maxLength={4}
                                        autoFocus
                                    />
                                    <div className="flex justify-between mt-2 px-1">
                                        <button type="button" onClick={() => {setOtpSent(false); setOtp('');}} className="text-[10px] text-indigo-600 hover:underline font-medium">Change Number</button>
                                        <span className="text-[10px] text-slate-400">Resend in 30s</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {error && <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg flex items-center border border-red-100 animate-in shake"><AlertCircle className="w-3 h-3 mr-2 shrink-0"/>{error}</div>}

                    <Button type="submit" className="w-full py-2.5 shadow-lg shadow-indigo-200 mt-2 hover:shadow-indigo-300 transition-all duration-300" isLoading={isLoading}>
                        {loginMethod === 'MOBILE' ? (otpSent ? 'Verify & Login' : 'Send OTP') : 'Sign In'}
                    </Button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink-0 mx-2 text-[10px] text-slate-400 uppercase font-bold">Or</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <button type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full flex justify-center items-center gap-2 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        {isGoogleLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                        Continue with Google
                    </button>
                </form>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-5">
                {onSwitchToSignUp && (
                    <div className="mb-4 text-center">
                        <p className="text-xs text-slate-600 mb-2">New Student?</p>
                        <Button 
                            variant="secondary" 
                            className="w-full text-indigo-600 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 font-bold"
                            onClick={onSwitchToSignUp}
                        >
                            Create an Account
                        </Button>
                    </div>
                )}

                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-indigo-400"/>
                    Institution Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors hover:border-indigo-200 group cursor-default">
                        <div className="p-1.5 bg-indigo-50 rounded-md group-hover:bg-indigo-100 transition-colors">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-indigo-600 transition-colors mb-0.5">Address</p>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{MOCK_COLLEGE_INFO.address}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors hover:border-green-200 group cursor-default">
                        <div className="p-1.5 bg-green-50 rounded-md group-hover:bg-green-100 transition-colors">
                            <Phone className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-green-600 transition-colors mb-0.5">Contact</p>
                            <p className="text-xs text-slate-700 font-medium truncate">{MOCK_COLLEGE_INFO.contact}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors hover:border-purple-200 group cursor-default">
                        <div className="p-1.5 bg-purple-50 rounded-md group-hover:bg-purple-100 transition-colors">
                            <Award className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-purple-600 transition-colors mb-0.5">Principal</p>
                            <p className="text-xs text-slate-700 font-medium truncate" title={MOCK_COLLEGE_INFO.director}>{MOCK_COLLEGE_INFO.director}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-indigo-50/50 py-3 text-center border-t border-indigo-100/50">
                <p className="text-[10px] text-slate-500">
                    Need help logging in? <a href="#" className="text-indigo-600 font-bold hover:underline ml-1">Contact Admin</a>
                </p>
            </div>
        </div>
    </div>
  );
};