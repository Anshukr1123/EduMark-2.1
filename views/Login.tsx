import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_COLLEGE_INFO } from '../constants';
import { Button } from '../components/UIComponents';
import { Navbar } from './landing/Navbar';
import { EventsSection } from './landing/Events';
import { GallerySection } from './landing/Gallery';
import { Footer } from './landing/Footer';
import { LoginForm } from './landing/LoginForm';
import { SignUpForm } from './landing/SignUpForm';
import { X, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Enable body scrolling and snapping for the landing page
  useEffect(() => {
    document.body.classList.add('is-landing');
    return () => document.body.classList.remove('is-landing');
  }, []);

  const handleOpenLogin = () => {
      setIsSignUpMode(false);
      setIsLoginModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onOpenLogin={handleOpenLogin} />

      <main className="w-full">
        {/* Hero Section */}
        <section id="hero" className="full-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 flex items-center justify-center pt-16">
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
               <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-indigo-200/40 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-blob"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-blob animation-delay-2000"></div>
               <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-pink-200/40 rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob animation-delay-4000"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Hero Text */}
                    <div className="text-center lg:text-left space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm backdrop-blur-sm">
                            <span className="relative flex h-2 w-2 mr-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-50"></span>
                            </span>
                            Admissions Open 2024
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                            Empowering <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">Future Leaders</span>
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Welcome to {MOCK_COLLEGE_INFO.name}. A world-class institution fostering innovation, academic excellence, and holistic development for a brighter tomorrow.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                            <div className="lg:hidden w-full sm:w-auto">
                                <Button size="lg" className="rounded-full px-8 shadow-xl shadow-indigo-200 w-full sm:w-auto py-4 text-base" onClick={handleOpenLogin}>Login to Portal</Button>
                            </div>
                            <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-base border-slate-300 hover:bg-white/80 backdrop-blur-sm group w-full sm:w-auto">
                                Explore Campus <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                            </Button>
                        </div>
                    </div>

                    {/* Hero Right Side */}
                    <div className="hidden lg:flex justify-center relative animate-in slide-in-from-right-8 duration-1000 delay-200">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-white/40 to-white/10 rounded-full blur-3xl -z-10"></div>
                        <div className="w-full max-w-md transform transition-all hover:scale-[1.01] duration-500 shadow-2xl rounded-2xl overflow-hidden">
                            {isSignUpMode ? (
                                <SignUpForm onLogin={onLogin} onSwitchToLogin={() => setIsSignUpMode(false)} />
                            ) : (
                                <LoginForm onLogin={onLogin} onSwitchToSignUp={() => setIsSignUpMode(true)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <EventsSection />
        <GallerySection />
        <Footer />
      </main>

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsLoginModalOpen(false)}></div>
            <div className="relative w-full max-w-md transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <button 
                    onClick={() => setIsLoginModalOpen(false)}
                    className="absolute -top-12 right-0 md:-right-12 text-white/80 hover:text-white transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm"
                >
                    <X className="w-6 h-6" />
                </button>
                {isSignUpMode ? (
                    <SignUpForm onLogin={onLogin} onSwitchToLogin={() => setIsSignUpMode(false)} />
                ) : (
                    <LoginForm onLogin={onLogin} onSwitchToSignUp={() => setIsSignUpMode(true)} />
                )}
            </div>
        </div>
      )}

      {/* Custom Styles for Animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;