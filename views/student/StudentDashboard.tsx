import React, { useMemo, useState, useEffect, useRef } from 'react';
import { User, Subject, Assignment, FeeRecord, Notice } from '../../types';
import { Card, Button, Badge } from '../../components/UIComponents';
import { 
  Rocket, Bell, CheckCircle2, History, ListTodo, Library, Activity, 
  Zap, Megaphone, Clock, Layers, ArrowRight, ChevronDown, ArrowUpRight, Star, 
  ShieldCheck, GraduationCap, TrendingUp, DollarSign
} from 'lucide-react';
import { NavItem } from '../../components/Layout';
import { MOCK_TIMETABLE } from '../../constants';

import StudentHeader from './dashboard/StudentHeader';
import StudentStats from './dashboard/StudentStats';
import AttendanceChart from './dashboard/AttendanceChart';
import LiveClock from './dashboard/LiveClock';

interface StudentDashboardProps {
  user: User;
  subjects: Subject[];
  assignments: Assignment[];
  fees: FeeRecord[];
  averageAttendance: number;
  isOnline: boolean;
  notices: Notice[];
  lastUpdate: string | null;
  onNavigate: (tabId: string) => void;
  navItems: NavItem[];
}

// DASHBOARD_PHASES used only for scroll snapping target IDs now
const DASHBOARD_PHASES = [
  { id: 'overview', label: 'Institutional Overview', node: 'NODE-01' },
  { id: 'analytics', label: 'Neural Analytics', node: 'NODE-02' },
  { id: 'projects', label: 'Active Pipeline', node: 'NODE-03' },
  { id: 'schedule', label: 'Terminal Schedule', node: 'NODE-04' },
  { id: 'bulletin', label: 'Global Bulletin', node: 'NODE-05' }
];

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  user, subjects, assignments, fees, averageAttendance, notices, onNavigate 
}) => {
  const [activePhase, setActivePhase] = useState('overview');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePhase(entry.target.id);
          }
        });
      },
      { threshold: 0.5, root: containerRef.current }
    );

    const sections = containerRef.current?.querySelectorAll('.dashboard-section');
    sections?.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToPhase = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextSession = useMemo(() => MOCK_TIMETABLE.find(t => t.day === 'Monday') || null, []);

  // Detailed Data
  const milestones = [
    { id: 1, title: 'Final Year Project Pitch', date: 'Oct 30', status: 'pending', priority: 'high' },
    { id: 2, title: 'Tuition Fee Installment 2', date: 'Nov 05', status: 'paid', priority: 'medium' },
    { id: 3, title: 'Annual Tech-Symposium', date: 'Nov 12', status: 'upcoming', priority: 'low' },
  ];

  const activities = [
    { id: 'act-1', text: 'Checked into Advanced Calculus', time: '10:15 AM', location: 'Hall A' },
    { id: 'act-2', text: 'Submitted Binary Trees Draft', time: 'Yesterday', location: 'Portal' },
    { id: 'act-3', text: 'Borrowed "Neural Networks v2"', time: '2 days ago', location: 'Section B' },
  ];

  const curriculumModules = [
    { name: 'Core Engineering', completed: 18, total: 24, color: 'indigo', credits: 72 },
    { name: 'Humanities', completed: 4, total: 4, color: 'emerald', credits: 12 },
    { name: 'Technical Electives', completed: 2, total: 6, color: 'amber', credits: 18 },
  ];

  return (
    <div className="relative h-full flex overflow-hidden">
      {/* Side Phase Indicator removed to satisfy "hide menu section" requirement */}

      <div ref={containerRef} className="dashboard-snap-container w-full">
        {/* Phase 1: Institutional Overview */}
        <section id="overview" className="dashboard-section">
            <div className="flex-1 space-y-4 max-w-[1400px] mx-auto w-full pt-4">
                <div className="bg-slate-900 text-white h-8 flex items-center overflow-hidden rounded-xl shadow-lg border border-white/5 relative mb-4">
                    <div className="bg-indigo-600 h-full px-3 flex items-center gap-2 z-10">
                        <Megaphone className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Broadcast</span>
                    </div>
                    <div className="flex-1 animate-marquee whitespace-nowrap pl-4">
                        {notices.map((n, i) => (
                            <span key={i} className="mx-8 text-[10px] font-bold text-slate-300">
                                <span className="text-indigo-400 mr-2">#SYSTEM</span> {n.title}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-9 h-full">
                        <StudentHeader user={user} />
                    </div>
                    <div className="md:col-span-3 h-full">
                        <LiveClock />
                    </div>
                </div>

                <StudentStats averageAttendance={averageAttendance} assignments={assignments} fees={fees} onNavigate={onNavigate} />
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-30 cursor-pointer" onClick={() => scrollToPhase('analytics')}>
                    <span className="text-[8px] font-black uppercase tracking-widest">Analytics Layer</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </section>

        {/* Phase 2: Neural Analytics */}
        <section id="analytics" className="dashboard-section bg-slate-50/50">
            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-center">
                <Card title="Institutional Mastery" className="bg-white rounded-[32px] p-8 border-none shadow-xl h-fit">
                    <div className="space-y-6">
                        {curriculumModules.map((module, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>{module.name}</span>
                                    <span className="text-indigo-600">{module.credits} CRS</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                                    <div className={`h-full bg-indigo-500 rounded-full transition-all duration-1000`} style={{ width: activePhase === 'analytics' ? `${(module.completed / module.total) * 100}%` : '0%' }}></div>
                                </div>
                            </div>
                        ))}
                        <div className="pt-6 border-t border-slate-50 mt-4 flex items-center justify-between">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> Node Verified</span>
                            <Button size="sm" variant="outline" className="text-[9px] h-8 px-4 font-black uppercase tracking-widest border-slate-200">Audit</Button>
                        </div>
                    </div>
                </Card>

                <div className="lg:col-span-2 h-full flex flex-col justify-center">
                   <div className={`transition-all duration-1000 ${activePhase === 'analytics' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                       <AttendanceChart subjects={subjects} />
                   </div>
                </div>
            </div>
        </section>

        {/* Phase 3: Project Pipeline */}
        <section id="projects" className="dashboard-section">
            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 h-full items-center">
                <Card title="Project Terminal" className="lg:col-span-3 bg-slate-900 rounded-[40px] p-10 border-none shadow-2xl text-white relative overflow-hidden h-fit">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-600 rounded-[24px] shadow-xl"><Rocket className="w-6 h-6" /></div>
                            <div>
                                <Badge className="bg-indigo-500/20 text-indigo-400 border-none font-black text-[9px] px-3 py-1 mb-1 tracking-[0.2em] uppercase backdrop-blur-md">Active Cycle</Badge>
                                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Neural Core V2.4</h3>
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-6">
                            <div className="text-center"><p className="text-[9px] text-slate-400 uppercase mb-1">Status</p><span className="text-xl font-black text-indigo-400">82%</span></div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-center"><p className="text-[9px] text-slate-400 uppercase mb-1">Deadline</p><span className="text-sm font-black text-white uppercase">NOV 15</span></div>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2"><Layers className="w-4 h-4"/> Sprint Tasks</h4>
                            {['Vector Optimization', 'Quantization Protocols', 'Edge Inference'].map((task, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    <span className="text-xs font-bold text-slate-300">{task}</span>
                                    {i === 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="h-5 w-5 rounded-full border-2 border-white/10"></div>}
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-indigo-600/20 rounded-[32px] border border-indigo-500/20 flex flex-col justify-between h-full group/box">
                            <p className="text-lg text-indigo-100 font-bold leading-relaxed italic opacity-80 group-hover/box:opacity-100 transition-opacity">"The primary research node requires immediate data synchronization before the next audit cycle."</p>
                            <div className="mt-6 flex items-center gap-3 border-t border-indigo-500/20 pt-4">
                                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-[8px] font-black text-white border-2 border-white/20">RS</div>
                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Lead: Robert Smith</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Activity Log" className="bg-white rounded-[32px] p-6 shadow-xl h-fit border-none">
                        <div className="space-y-6">
                            {activities.map((act, i) => (
                                <div key={i} className="relative pl-6 group/item hover:translate-x-1 transition-transform">
                                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                                    <div className="absolute left-[2px] top-4 w-px h-full bg-slate-100 group-last/item:bg-transparent"></div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight leading-none">{act.text}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{act.time} • {act.location}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="bg-slate-900 border-none rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden h-fit">
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <Activity className="w-8 h-8 text-indigo-400 mb-4 animate-pulse" />
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Academic Pulse</p>
                            <span className="text-5xl font-black tracking-tighter">8.85</span>
                            <Badge variant="success" className="mt-4 bg-emerald-500/20 text-emerald-400 border-none font-black text-[9px] px-4 py-1">TOP 5% IN SECTOR</Badge>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        {/* Phase 4: Terminal Schedule */}
        <section id="schedule" className="dashboard-section bg-slate-50/50">
            <div className="max-w-[1400px] mx-auto w-full flex flex-col justify-center gap-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-white border border-slate-200 relative overflow-hidden group shadow-2xl rounded-[40px] p-8 h-fit">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-60"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-[32px] shadow-2xl w-full md:w-36 text-center shrink-0 border-4 border-slate-800">
                                <Zap className="w-8 h-8 text-indigo-400 mb-2 animate-pulse" />
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Node Time</p>
                                <h4 className="text-3xl font-black tabular-nums tracking-tighter text-white leading-none mt-1">09:00</h4>
                                <p className="text-[9px] font-bold uppercase tracking-widest mt-2 text-indigo-400">AM / LAB 3</p>
                            </div>
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <Badge className="bg-indigo-600 text-white border-none font-black text-[10px] px-4 py-1 mb-2 uppercase tracking-widest shadow-lg">LIVE TERMINAL</Badge>
                                    <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-slate-900 group-hover:text-indigo-600 transition-colors">{nextSession?.subject}</h3>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-8">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Lead Faculty</span>
                                        <span className="text-base font-black text-slate-800 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-indigo-500"/> {nextSession?.teacher}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Sync Status</span>
                                        <span className="text-base font-black text-emerald-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> 42 PEERS ACTIVE</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button className="h-12 px-10 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-100 hover:scale-105 transition-all">
                                        SYNC NOW <ArrowRight className="w-4 h-4 ml-3" />
                                    </Button>
                                    <Button variant="outline" className="h-12 w-12 rounded-2xl p-0 border-slate-200 hover:bg-slate-100">DS</Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Roadmap" className="bg-white rounded-[40px] p-8 border-none shadow-2xl flex flex-col justify-between h-fit">
                        <div className="space-y-3 mt-4">
                            {milestones.map((m) => (
                                <div key={m.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:border-indigo-200 transition-all cursor-default">
                                    <div className={`p-2 rounded-xl ${m.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : m.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <ListTodo className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{m.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{m.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 transition-all">Details</button>
                    </Card>
                </div>
            </div>
        </section>

        {/* Phase 5: Global Bulletin */}
        <section id="bulletin" className="dashboard-section bg-slate-900 text-white">
            <div className="max-w-[1400px] mx-auto w-full flex flex-col justify-center h-full gap-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <Badge className="bg-indigo-500 text-white border-none font-black text-[11px] px-6 py-2 tracking-[0.4em] uppercase mb-4 shadow-xl shadow-indigo-500/20">Institutional Bulletin</Badge>
                            <h2 className="text-6xl font-black tracking-tighter leading-none uppercase">Knowledge <br/><span className="text-indigo-400">Expansion 2024</span></h2>
                        </div>
                        <div className="grid gap-6">
                            {notices.slice(0, 3).map((notice, i) => (
                                <div key={notice.id} className="flex gap-6 group cursor-pointer" onClick={() => onNavigate('notices')}>
                                    <div className="shrink-0 w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-2xl group-hover:scale-110">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">{notice.title}</h4>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{notice.date}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium opacity-70 leading-relaxed line-clamp-1">{notice.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="h-14 px-12 rounded-2xl border-white/10 text-white hover:bg-white hover:text-slate-900 font-black uppercase tracking-widest text-[11px]" onClick={() => onNavigate('notices')}>
                            Full Archive <ArrowUpRight className="w-5 h-5 ml-3"/>
                        </Button>
                    </div>

                    <div className="relative group perspective-1000 hidden lg:block">
                        <div className="bg-gradient-to-br from-indigo-600/40 to-purple-600/40 h-[450px] rounded-[60px] p-[2px] rotate-[-5deg] group-hover:rotate-0 transition-all duration-[1500ms] shadow-2xl overflow-hidden">
                             <div className="bg-[#020617] w-full h-full rounded-[58px] p-12 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                                <div className="relative z-10 text-center space-y-6">
                                    <Library className="w-20 h-20 text-indigo-500 mx-auto opacity-20" />
                                    <h4 className="text-2xl font-black uppercase tracking-tighter">System Health Nominal</h4>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">All institutional nodes are operational. Data synchronization cycle complete.</p>
                                    <div className="pt-8 border-t border-white/5 flex justify-center gap-8">
                                        <div className="text-center"><p className="text-[10px] text-slate-600 font-black uppercase mb-1">Load</p><span className="font-mono text-indigo-400">0.42ms</span></div>
                                        <div className="text-center"><p className="text-[10px] text-slate-600 font-black uppercase mb-1">Secure</p><span className="font-mono text-emerald-400">Active</span></div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
                
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em]">© 2024 EduMark Institutional Node v4.2.0 • Phase Verified</p>
                    <div className="flex gap-8">
                        <span className="text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-indigo-400">Privacy Protocol</span>
                        <span className="text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-indigo-400">Audit Trail</span>
                    </div>
                </div>
            </div>
        </section>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 60s linear infinite; }
        .dashboard-snap-container::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default StudentDashboard;