import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { MOCK_COLLEGE_INFO } from '../constants';
import { Button, Card, Badge } from '../components/UIComponents';
import { Navbar } from './landing/Navbar';
import { EventsSection } from './landing/Events';
import { GallerySection } from './landing/Gallery';
import { Footer } from './landing/Footer';
import { LoginForm } from './landing/LoginForm';
import { SignUpForm } from './landing/SignUpForm';
import { 
  X, ArrowRight, ShieldCheck, Zap, Users, Globe, BookOpen, Cpu, 
  TrendingUp, Award, Microscope, Globe2, ChevronRight, BarChart3, 
  BrainCircuit, Network, Fingerprint, GraduationCap, ArrowUpRight, 
  Sparkles, Database, Landmark, Microscope as LabIcon
} from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const SECTIONS = ['hero', 'about', 'features', 'academics', 'events', 'gallery', 'contact'];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.classList.add('is-landing');
    
    const handleScroll = () => {
      if (!mainRef.current) return;
      const scrollPosition = mainRef.current.scrollTop;
      const height = window.innerHeight;
      const index = Math.round(scrollPosition / height);
      if (SECTIONS[index]) {
        setActiveSection(SECTIONS[index]);
      }
    };

    const mainElement = mainRef.current;
    mainElement?.addEventListener('scroll', handleScroll);
    return () => {
      document.body.classList.remove('is-landing');
      mainElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenLogin = () => {
    setIsSignUpMode(false);
    setIsLoginModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col h-screen overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onOpenLogin={handleOpenLogin} />

      {/* Side Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {SECTIONS.map((id) => (
          <div 
            key={id} 
            className={`snap-dot ${activeSection === id ? 'active' : ''} ${['hero', 'features', 'contact'].includes(activeSection) ? 'dark' : ''}`}
            onClick={() => scrollToSection(id)}
            title={id.charAt(0).toUpperCase() + id.slice(1)}
          />
        ))}
      </div>

      <main ref={mainRef} className="w-full h-full no-scrollbar">
        {/* Section 1: Hero */}
        <section id="hero" className="full-section bg-[#020617] overflow-hidden">
            <div className="absolute inset-0 z-0">
               <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
                <div className={`space-y-8 transition-all duration-1000 ${activeSection === 'hero' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl backdrop-blur-xl">
                        <span className="relative flex h-2.5 w-2.5 mr-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                        Academic Excellence Node • Tier 1 Institution
                    </div>
                    <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-[calc(-0.05em)] leading-[0.82] uppercase">
                        EduMark<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400">Institute</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight opacity-80">
                        The definitive technical substrate for academic mastery. Powering the next generation of engineers through distributed neural frameworks and biometric precision.
                    </p>
                </div>
                
                <div className={`flex flex-col sm:flex-row justify-center gap-6 pt-6 transition-all duration-1000 delay-200 ${activeSection === 'hero' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <Button size="lg" className="rounded-2xl px-14 py-8 text-sm font-black uppercase tracking-[0.25em] shadow-[0_20px_60px_rgba(79,70,229,0.3)] bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.03] transition-all border-none" onClick={handleOpenLogin}>
                        Portal Gateway <ArrowRight className="w-5 h-5 ml-4"/>
                    </Button>
                    <button onClick={() => scrollToSection('about')} className="rounded-2xl px-14 py-8 text-sm font-black uppercase tracking-[0.25em] border border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm transition-all flex items-center group">
                        Explore Metrics <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
            
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-30 cursor-pointer" onClick={() => scrollToSection('about')}>
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                  <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
            </div>
        </section>

        {/* Section 2: Intellect Bento */}
        <section id="about" className="full-section bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className={`text-center mb-16 space-y-4 transition-all duration-1000 ${activeSection === 'about' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black text-[11px] px-8 py-2.5 tracking-[0.4em] uppercase rounded-full">System Metrics</Badge>
                    <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Institutional <br/> Performance Matrix</h2>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-[650px] transition-all duration-1000 delay-200 ${activeSection === 'about' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <div className="md:col-span-2 md:row-span-2 bg-slate-900 rounded-[50px] p-12 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                             <TrendingUp className="w-72 h-72 text-white" />
                         </div>
                         <div className="relative z-10">
                            <Badge className="bg-indigo-500 text-white border-none font-black text-[10px] px-5 py-1.5 tracking-[0.3em] mb-6 rounded-full">MANDATORY BENCHMARK</Badge>
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">98.4% Global <br/> Recruitment</h3>
                            <p className="text-slate-400 mt-6 text-xl font-medium leading-relaxed max-w-md">Our graduates represent the core intellectual asset of the world's most innovative technology firms.</p>
                         </div>
                         <div className="relative z-10 pt-10 border-t border-white/10 mt-10 flex justify-between items-end">
                            <div>
                                <p className="text-6xl font-black text-indigo-400 tracking-tighter">₹42.5L</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Median Career Portfolio</p>
                            </div>
                            <Button variant="outline" className="border-white/20 text-white rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900">Career Hub</Button>
                         </div>
                    </div>

                    <div className="bg-white rounded-[50px] p-10 flex flex-col justify-between hover-lift shadow-xl border border-slate-100 group">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner"><Microscope className="w-10 h-10"/></div>
                        <div>
                            <p className="text-5xl font-black text-slate-900 tracking-tighter">50+</p>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Active Research Nodes</p>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[50px] p-10 flex flex-col justify-between shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-[-10%] right-[-10%] p-6 opacity-20 group-hover:scale-125 transition-transform duration-700"><Globe2 className="w-40 h-40 rotate-12" /></div>
                        <div className="relative z-10">
                           <p className="text-5xl font-black tracking-tighter">120k</p>
                           <p className="text-[11px] font-black text-indigo-100 uppercase tracking-widest mt-2">Distributed Alumni</p>
                        </div>
                        <p className="text-xs font-semibold text-indigo-100/70 mt-6 relative z-10 leading-relaxed uppercase tracking-widest">Bridging 42 nations via secure digital identity.</p>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-[50px] p-10 flex items-center justify-between hover-lift shadow-xl border border-slate-100 group">
                        <div className="flex-1 space-y-3">
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Institutional Merit</p>
                             <h4 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">#1 Innovation Apex</h4>
                             <p className="text-base text-slate-500 font-medium">Top ranked for distributed ledger research and IP yield 2024.</p>
                        </div>
                        <div className="p-8 bg-slate-900 rounded-[40px] text-white rotate-[12deg] group-hover:rotate-0 transition-all duration-700 shadow-2xl">
                             <Award className="w-14 h-14" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3: The Digital Ecosystem */}
        <section id="features" className="full-section bg-[#020617] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className={`space-y-12 transition-all duration-1000 ${activeSection === 'features' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                        <div className="space-y-6">
                            <Badge className="bg-indigo-500 text-white border-none font-black text-[11px] px-8 py-2 tracking-[0.5em] uppercase rounded-full">Campus Neural Stack</Badge>
                            <h2 className="text-7xl font-black tracking-tighter uppercase leading-[0.85]">Integrated <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Operations</span></h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed opacity-80">A comprehensive digital substrate managing the entire student lifecycle with biometric precision and neural-pathway tracking.</p>
                        </div>
                        
                        <div className="grid gap-8">
                            {[
                                { title: "Presence Verification", desc: "Biometric and geo-fenced consensus layer ensuring 99.9% data integrity in class attendance.", icon: Fingerprint },
                                { title: "Neural Grade Prediction", desc: "AI-driven academic forecasting and early-intervention algorithms for optimized student success.", icon: BrainCircuit },
                                { title: "Universal Mesh Ledger", desc: "Real-time institutional settlements and financial transparency protocols for students and vendors.", icon: Network }
                            ].map((f, i) => (
                                <div key={i} className="flex gap-8 group cursor-pointer">
                                    <div className={`shrink-0 w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-2xl group-hover:scale-110`}>
                                        <f.icon className="w-8 h-8" />
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="text-xl font-black uppercase tracking-tight text-white mb-2">{f.title}</h4>
                                        <p className="text-slate-400 text-base font-medium opacity-70 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className={`relative group perspective-1000 hidden lg:block transition-all duration-[1500ms] ${activeSection === 'features' ? 'opacity-100 rotate-0 translate-x-0' : 'opacity-0 rotate-12 translate-x-24'}`}>
                        <div className="bg-gradient-to-br from-indigo-600/40 to-purple-600/40 h-[650px] rounded-[70px] p-[2px] rotate-[-5deg] group-hover:rotate-0 transition-all duration-[1500ms] shadow-2xl overflow-hidden">
                             <div className="bg-[#020617] w-full h-full rounded-[68px] p-12 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-12">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl"><GraduationCap className="w-6 h-6 text-white"/></div>
                                            <span className="font-black text-xl tracking-tighter uppercase">EduOS v4.0</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="h-6 w-48 bg-white/5 rounded-full animate-pulse"></div>
                                        <div className="h-14 w-full bg-white/5 rounded-2xl border border-white/10"></div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="h-40 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 group-hover:bg-indigo-600/20 transition-all"></div>
                                            <div className="h-40 bg-white/5 rounded-3xl border border-white/10 group-hover:translate-y-[-10px] transition-all duration-700"></div>
                                        </div>
                                        <div className="h-40 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-white/10 transition-all"></div>
                                    </div>
                                </div>
                                <p className="relative z-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.6em] text-center border-t border-white/5 pt-8 mt-4">Hardware Secured Infrastructure</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 4: Academic Domains */}
        <section id="academics" className="full-section bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className={`flex flex-col md:flex-row justify-between items-end gap-10 mb-20 transition-all duration-1000 ${activeSection === 'academics' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}`}>
                    <div className="space-y-6">
                        <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black text-[11px] px-8 py-2.5 tracking-[0.4em] uppercase rounded-full">Curriculum Grid</Badge>
                        <h2 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">Academic <br/> Specialized Divisions</h2>
                    </div>
                    <p className="text-slate-500 max-w-sm font-medium text-right hidden md:block text-lg leading-relaxed border-r-4 border-indigo-600 pr-6">Distributed faculties pushing the boundaries of engineering through rigorous inquiry and industrial application.</p>
                </div>

                <div className={`grid md:grid-cols-3 gap-10 transition-all duration-1000 delay-200 ${activeSection === 'academics' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    {[
                        { title: "Computation", code: "DIV-ALPHA", sub: "Neural Logic & Distributed Ops", icon: Cpu, stats: "42 Research Labs" },
                        { title: "Bio-Dynamics", code: "DIV-SIGMA", sub: "Molecular & Quantum Bio-Eng", icon: Microscope, stats: "12 Patents Pending" },
                        { title: "Finance-Tech", code: "DIV-OMEGA", sub: "Macro-Econ & Crypto-Ledgers", icon: BarChart3, stats: "94% Placement Rate" }
                    ].map((div, i) => (
                        <div key={i} className="group relative h-[500px] rounded-[60px] overflow-hidden shadow-2xl border border-slate-100 hover-lift transition-all duration-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white transition-all duration-700"></div>
                            <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                            <div className="absolute inset-0 p-14 flex flex-col justify-between relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="p-6 rounded-[30px] bg-white shadow-2xl text-indigo-600 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:text-indigo-600">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <div.icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white transition-colors">{div.code}</span>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors uppercase tracking-tighter leading-none mb-4">{div.title}</h4>
                                    <p className="text-slate-500 group-hover:text-indigo-100 transition-colors font-medium mb-8 leading-relaxed">{div.sub}</p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-200 group-hover:border-white/20">
                                        <span className="text-[10px] font-black text-indigo-600 group-hover:text-white uppercase tracking-widest">{div.stats}</span>
                                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 5: Events */}
        <section id="events" className="full-section bg-slate-50 overflow-hidden">
            <EventsSection />
        </section>

        {/* Section 6: Gallery */}
        <section id="gallery" className="full-section bg-white overflow-hidden">
            <GallerySection />
        </section>

        {/* Section 7: Footer (Full Section wrapper) */}
        <section id="contact" className="full-section bg-slate-900">
            <Footer />
        </section>
      </main>

      {/* Auth Modal Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500" onClick={() => setIsLoginModalOpen(false)}></div>
            <div className="relative w-full max-w-md transform transition-all animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <button 
                    onClick={() => setIsLoginModalOpen(false)}
                    className="absolute -top-16 right-0 text-white/50 hover:text-white transition-colors p-3 bg-white/5 rounded-full backdrop-blur-md border border-white/10"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden border border-white/10">
                    {isSignUpMode ? (
                        <SignUpForm onLogin={onLogin} onSwitchToLogin={() => setIsSignUpMode(false)} />
                    ) : (
                        <LoginForm onLogin={onLogin} onSwitchToSignUp={() => setIsSignUpMode(true)} />
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Login;