
import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_COLLEGE_INFO } from '../constants';
import { Button } from '../components/UIComponents';
import { Navbar } from './landing/Navbar';
import { EventsSection } from './landing/Events';
import { GallerySection } from './landing/Gallery';
import { Footer } from './landing/Footer';
import { LoginForm } from './landing/LoginForm';
import { X, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onOpenLogin={() => setIsLoginModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center justify-center">
          {/* Animated Background */}
          <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-indigo-200/40 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-blob"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-blob animation-delay-2000"></div>
             <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-pink-200/40 rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob animation-delay-4000"></div>
             {/* Grid Pattern Overlay */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Hero Text */}
                  <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm backdrop-blur-sm">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                          Admissions Open 2024
                      </div>
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] md:leading-[1.1]">
                          Empowering <br className="hidden lg:block" />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">Future Leaders</span>
                      </h1>
                      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed md:leading-loose">
                          Welcome to {MOCK_COLLEGE_INFO.name}. A world-class institution fostering innovation, academic excellence, and holistic development for a brighter tomorrow.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                          {/* Only show Get Started (Modal trigger) on Mobile */}
                          <div className="lg:hidden w-full sm:w-auto">
                              <Button size="lg" className="rounded-full px-8 shadow-xl shadow-indigo-200 w-full sm:w-auto py-4 text-base" onClick={() => setIsLoginModalOpen(true)}>Login to Portal</Button>
                          </div>
                          <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-base border-slate-300 hover:bg-white/80 backdrop-blur-sm group w-full sm:w-auto">
                              Explore Campus <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                          </Button>
                      </div>
                      
                      <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-slate-400 grayscale opacity-70">
                         {/* Partner Logos */}
                         <div className="h-8 w-24 bg-slate-300/50 rounded animate-pulse"></div>
                         <div className="h-8 w-24 bg-slate-300/50 rounded animate-pulse delay-100"></div>
                         <div className="h-8 w-24 bg-slate-300/50 rounded animate-pulse delay-200"></div>
                      </div>
                  </div>

                  {/* Hero Right Side: Embedded Login Form for Desktop */}
                  <div className="hidden lg:flex justify-center relative animate-in slide-in-from-right-8 duration-1000 delay-200">
                      {/* Decorative backing for the form */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-white/40 to-white/10 rounded-full blur-3xl -z-10"></div>
                      <div className="w-full max-w-md transform transition-all hover:scale-[1.01] duration-500 shadow-2xl rounded-2xl">
                          <LoginForm onLogin={onLogin} />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <EventsSection />
      <GallerySection />
      <Footer />

      {/* Login Modal Overlay (Mobile only or manual trigger) */}
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
                <LoginForm onLogin={onLogin} />
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
