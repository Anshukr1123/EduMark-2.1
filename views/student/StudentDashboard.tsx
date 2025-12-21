
import React, { useMemo, useState } from 'react';
import { User, Subject, Assignment, FeeRecord, Notice } from '../../types';
import { Card, Button, Badge } from '../../components/UIComponents';
import { 
  WifiOff, School, ChevronRight, MessageSquare, ArrowRight, Bell, GraduationCap, 
  Briefcase, Settings, Book, Calendar, ClipboardCheck, LayoutGrid, Target, 
  Sparkles, Zap, Megaphone, Clock, AlertCircle, ZoomIn, ZoomOut, Maximize2,
  TrendingUp, Activity, Star, CheckCircle2, History, ListTodo, Library, Users,
  Rocket, Lightbulb, BookOpen, Layers, Map, Compass, ShieldCheck
} from 'lucide-react';
import { NavItem } from '../../components/Layout';
import { MOCK_COLLEGE_INFO, MOCK_TIMETABLE } from '../../constants';

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

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  user, subjects, assignments, fees, averageAttendance, isOnline, notices, lastUpdate, onNavigate, navItems 
}) => {
  const getNavItem = (id: string) => navItems.find(n => n.id === id);

  const nextSession = useMemo(() => MOCK_TIMETABLE.find(t => t.day === 'Monday') || null, []);

  // Detailed Data: Milestones
  const milestones = [
    { id: 1, title: 'Final Year Project Pitch', date: 'Oct 30', status: 'pending', priority: 'high', progress: 40, department: 'CS Lab' },
    { id: 2, title: 'Tuition Fee Installment 2', date: 'Nov 05', status: 'paid', priority: 'medium', progress: 100, department: 'Finance' },
    { id: 3, title: 'Annual Tech-Symposium', date: 'Nov 12', status: 'upcoming', priority: 'low', progress: 0, department: 'Events' },
  ];

  // Detailed Data: Activity Log
  const activities = [
    { id: 'act-1', type: 'ATTENDANCE', text: 'Checked into Advanced Calculus', time: '10:15 AM', location: 'Hall A' },
    { id: 'act-2', type: 'ASSIGNMENT', text: 'Submitted Binary Trees Draft', time: 'Yesterday', location: 'Portal' },
    { id: 'act-3', type: 'LIBRARY', text: 'Borrowed "Neural Networks v2"', time: '2 days ago', location: 'Section B' },
  ];

  // Detailed Data: Curriculum Progress
  const curriculumModules = [
    { name: 'Core Engineering', completed: 18, total: 24, color: 'indigo', credits: 72 },
    { name: 'Humanities', completed: 4, total: 4, color: 'emerald', credits: 12 },
    { name: 'Technical Electives', completed: 2, total: 6, color: 'amber', credits: 18 },
  ];

  const quickAccessGroups = [
    {
      title: "Academic Core",
      subtitle: "Daily essentials",
      accent: "indigo",
      items: [
        { id: 'attendance', desc: 'Verify presence', meta: `${averageAttendance}%`, metaType: averageAttendance >= 75 ? 'success' : 'error', highlight: averageAttendance < 75 ? "CRITICAL" : "" },
        { id: 'timetable', desc: 'Daily schedule', meta: '09:00 AM', metaType: 'neutral', highlight: "NEXT CLASS" },
        { id: 'assignments', desc: 'Pending tasks', meta: `${assignments.filter(a => a.status === 'PENDING').length} Due`, metaType: 'warning', highlight: "DUE SOON" },
        { id: 'online_exam', desc: 'Digital testing', meta: '1 Active', metaType: 'error', highlight: "LIVE" },
      ]
    },
    {
      title: "Digital Ecosystem",
      subtitle: "Content channels",
      accent: "purple",
      items: [
        { id: 'library', desc: 'Library', meta: '45k+ Books', metaType: 'neutral' },
        { id: 'materials', desc: 'Notes', meta: '12 New', metaType: 'success' },
        { id: 'messages', desc: 'Chat', meta: '2 Unread', metaType: 'warning' },
        { id: 'course_registration', desc: 'Enrollment', meta: 'Open', metaType: 'success' },
      ]
    },
    {
      title: "Growth",
      subtitle: "Career records",
      accent: "emerald",
      items: [
        { id: 'placements', desc: 'Job board', meta: '12 Live', metaType: 'success', highlight: "NEW JOBS" },
        { id: 'results', desc: 'Grades', meta: '8.85 CGPA', metaType: 'neutral' },
        { id: 'fees', desc: 'Ledger', meta: 'Settled', metaType: 'success' },
        { id: 'id_card', desc: 'Identity', meta: 'Active', metaType: 'success' },
      ]
    }
  ];

  return (
    <div className="space-y-2 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      {/* Dynamic News Ticker */}
      <div className="bg-slate-900 text-white h-7 flex items-center overflow-hidden rounded-lg shadow-sm border border-white/5 relative">
          <div className="bg-indigo-600 h-full px-2.5 flex items-center gap-1.5 z-10 shadow-[5px_0_15px_rgba(0,0,0,0.4)]">
              <Megaphone className="w-2.5 h-2.5 animate-bounce" />
              <span className="text-[7px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Broadcast</span>
          </div>
          <div className="flex-1 whitespace-nowrap overflow-hidden relative">
              <div className="inline-block animate-marquee pl-[100%] hover:pause py-0.5">
                  {notices.map((n, i) => (
                      <span key={i} className="mx-6 text-[9.5px] font-bold text-slate-300">
                          <span className="text-indigo-400 mr-1.5 font-black">#FLASH</span>
                          {n.title}
                          <span className="ml-2 text-slate-500 font-mono text-[7.5px] opacity-40">[{n.date}]</span>
                      </span>
                  ))}
              </div>
          </div>
      </div>

      {/* Unified Header Block - High Density */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-9">
             <StudentHeader user={user} />
          </div>
          <div className="md:col-span-3 h-full">
             <LiveClock />
          </div>
      </div>

      {/* Central Stats Hub */}
      <StudentStats averageAttendance={averageAttendance} assignments={assignments} fees={fees} onNavigate={onNavigate} />

      {/* High-Density Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Card title="Institutional Mastery" className="bg-white rounded-[18px] p-3.5 border-none shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-[0.01] group-hover:opacity-[0.02] transition-opacity">
                  <Map className="w-20 h-20 rotate-12" />
              </div>
              <div className="space-y-1.5 mt-1 relative z-10">
                  {curriculumModules.map((module, idx) => (
                      <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-center text-[6.5px] font-black uppercase tracking-widest">
                              <span className="text-slate-500">{module.name}</span>
                              <span className={`text-${module.color}-600`}>{module.credits} CRS</span>
                          </div>
                          <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                              <div 
                                  className={`h-full bg-${module.color}-500 rounded-full transition-all duration-1000`} 
                                  style={{ width: `${(module.completed / module.total) * 100}%` }}
                              ></div>
                          </div>
                      </div>
                  ))}
                  <div className="pt-1.5 border-t border-slate-50 mt-1 flex items-center justify-between">
                       <div className="flex items-center gap-1">
                           <ShieldCheck className="w-2.5 h-2.5 text-indigo-600"/>
                           <span className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest">Status: SECURED</span>
                       </div>
                       <Button size="sm" variant="outline" className="text-[6px] font-black uppercase h-3.5 px-1 border-slate-100">Audit</Button>
                  </div>
              </div>
          </Card>

          <Card title="Activity Feed" className="bg-white rounded-[18px] p-3.5 border-none shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 opacity-[0.01] rotate-12"><History className="w-16 h-16" /></div>
             <div className="space-y-1.5 relative z-10">
                {activities.map((act) => (
                    <div key={act.id} className="relative pl-3 group/item hover:translate-x-0.5 transition-transform">
                        <div className="absolute left-0 top-1 w-0.5 h-0.5 rounded-full border border-indigo-600 bg-white z-10"></div>
                        <div className="absolute left-[0.5px] top-2 w-px h-full bg-slate-100 group-last:bg-transparent"></div>
                        <p className="text-[8.5px] font-bold text-slate-800 leading-none">{act.text}</p>
                        <p className="text-[6.5px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{act.time} • {act.location}</p>
                    </div>
                ))}
             </div>
             <button className="w-full mt-1.5 py-0.5 bg-slate-900 text-white rounded-md text-[6.5px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Export Log</button>
          </Card>

          <Card className="bg-slate-900 text-white border-none shadow-md relative overflow-hidden rounded-[18px] p-3.5 group">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-1">
                     <span className="text-indigo-400 text-[6.5px] font-black uppercase tracking-[0.3em]">Phase Benchmark</span>
                     <TrendingUp className="w-2.5 h-2.5 text-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                      <div>
                          <div className="flex justify-between text-[6px] font-black uppercase tracking-widest mb-1">
                             <span className="text-slate-400">Class percentile</span>
                             <span className="text-indigo-400">Top 4%</span>
                          </div>
                          <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_#4f46e5]" style={{width: '96%'}}></div>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-white/5">
                          <div>
                              <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
                              <p className="text-xs font-black text-white tabular-nums">0.92</p>
                          </div>
                          <div>
                              <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest">Impact</p>
                              <p className="text-xs font-black text-white tabular-nums">840</p>
                          </div>
                      </div>
                  </div>
                  <div className="mt-2 p-1 bg-white/5 rounded-lg border border-white/10 flex items-center gap-1.5">
                      <Users className="w-2 h-2 text-indigo-400" />
                      <p className="text-[6px] text-slate-400 font-medium">Leading <span className="text-white font-black">134 peers</span> in Core Units.</p>
                  </div>
              </div>
          </Card>
      </div>

      {/* Lab Module & Roadmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <Card title="Project Terminal" className="lg:col-span-3 bg-white rounded-[18px] p-3.5 border-none shadow-sm relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-indigo-50 rounded-full blur-[40px] opacity-30"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-600 rounded-[12px] shadow-lg">
                          <Rocket className="w-3 h-3 text-white" />
                      </div>
                      <div>
                          <Badge className="bg-indigo-50 text-indigo-700 border-none font-black text-[5.5px] px-1 py-0.5 mb-0.5 tracking-[0.2em] uppercase">Pipeline</Badge>
                          <h3 className="text-sm font-black tracking-tighter uppercase text-slate-900 leading-none">Neural Core V2.4</h3>
                      </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-[10px] border border-slate-100 shadow-inner">
                      <div className="text-center px-1">
                          <p className="text-[5px] font-black text-slate-400 uppercase mb-0.5">Cycle</p>
                          <span className="text-xs font-black text-indigo-600 leading-none">68%</span>
                      </div>
                      <div className="w-px h-2.5 bg-slate-200"></div>
                      <div className="text-center px-1">
                          <p className="text-[5px] font-black text-slate-400 uppercase mb-0.5">Target</p>
                          <span className="text-[6.5px] font-black text-slate-900 leading-none uppercase">Nov 15</span>
                      </div>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                      <h4 className="text-[6.5px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-1"><Layers className="w-1.5 h-1.5"/> Unit Tasks</h4>
                      <div className="space-y-0.5">
                          {['Optimization', 'Quantization', 'Alpha'].map((task, i) => (
                              <div key={i} className="flex items-center justify-between p-1 bg-slate-50 rounded-md border border-slate-100 hover:bg-white transition-all cursor-pointer">
                                  <span className="text-[7.5px] font-bold text-slate-700">{task}</span>
                                  {i === 0 ? <CheckCircle2 className="w-2 h-2 text-emerald-500" /> : <div className="h-2 w-2 rounded-full border border-slate-200"></div>}
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="space-y-1">
                       <h4 className="text-[6.5px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-1"><Lightbulb className="w-1.5 h-1.5"/> Advisory</h4>
                       <div className="p-2 bg-indigo-50/50 rounded-[12px] border border-indigo-100 shadow-inner h-full flex flex-col justify-between">
                           <p className="text-[7.5px] text-indigo-900 font-bold leading-tight italic opacity-80 line-clamp-2">"Edge inference latency remains critical."</p>
                           <div className="mt-1 flex items-center gap-1 border-t border-indigo-100/50 pt-0.5">
                               <div className="h-3 w-3 rounded-full bg-indigo-200 flex items-center justify-center text-[4px] font-black text-indigo-700 border border-white">RS</div>
                               <span className="text-[5.5px] font-black text-indigo-600 uppercase tracking-widest">Prof. Smith</span>
                           </div>
                       </div>
                  </div>
              </div>
          </Card>

          <Card title="Strategic Roadmap" className="bg-white rounded-[18px] p-3 border-none shadow-sm flex flex-col justify-between group">
              <div className="space-y-1 mt-0.5 flex-1">
                  {milestones.map((m) => (
                      <div key={m.id} className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-100 group/item">
                          <div className={`p-0.5 rounded-md ${m.status === 'paid' ? 'bg-green-100 text-green-600' : m.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                              <ListTodo className="w-2 h-2" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-[7px] font-black text-slate-900 truncate uppercase tracking-tighter">{m.title}</p>
                              <p className="text-[5.5px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-0.5">{m.date}</p>
                          </div>
                      </div>
                  ))}
              </div>
              <button className="w-full mt-1.5 py-1 bg-slate-50 hover:bg-indigo-50 rounded-md text-[6.5px] font-black text-indigo-600 uppercase tracking-[0.3em] border border-slate-100">Details</button>
          </Card>
      </div>

      {/* Next Class Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Card className="lg:col-span-2 bg-white border border-slate-100 relative overflow-hidden group shadow-sm rounded-[18px] p-3.5">
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex flex-col items-center justify-center p-2.5 bg-slate-900 rounded-[18px] shadow-lg w-full sm:w-24 text-center shrink-0">
                      <Zap className="w-4 h-4 text-indigo-400 mb-0.5 animate-pulse" />
                      <p className="text-[5.5px] font-black uppercase tracking-[0.3em] text-slate-500">Node</p>
                      <h4 className="text-lg font-black tabular-nums tracking-tighter text-white leading-none mt-0.5">09:00</h4>
                      <p className="text-[5.5px] font-bold uppercase tracking-widest mt-0.5 text-indigo-400">AM / LAB 3</p>
                  </div>
                  
                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                      <div>
                          <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[5.5px] px-1 py-0.5 mb-0.5 uppercase">TERMINAL</Badge>
                          <h3 className="text-base font-black tracking-tighter uppercase leading-none text-slate-900 group-hover:text-indigo-600 transition-colors">{nextSession?.subject}</h3>
                      </div>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <div className="space-y-0 text-left">
                              <span className="text-[5.5px] font-black text-slate-400 uppercase block">Faculty</span>
                              <span className="text-[8px] font-black text-slate-700 flex items-center gap-1"><GraduationCap className="w-1.5 h-1.5 text-indigo-500"/> {nextSession?.teacher}</span>
                          </div>
                          <div className="space-y-0 text-left">
                              <span className="text-[5.5px] font-black text-slate-400 uppercase block">Presence</span>
                              <span className="text-[8px] font-black text-emerald-600 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div> 42 Active</span>
                          </div>
                      </div>
                      <div className="flex gap-1.5 pt-0.5">
                        <Button variant="primary" className="h-6 px-3 rounded-md bg-indigo-600 text-white font-black uppercase tracking-widest text-[6.5px] shadow-md transition-all">
                            SYNC <ArrowRight className="w-2 h-2 ml-1" />
                        </Button>
                        <Button variant="outline" className="h-6 w-6 rounded-md p-0 border-slate-100 hover:bg-slate-50"><Settings className="w-2 h-2 text-slate-300"/></Button>
                      </div>
                  </div>
              </div>
          </Card>

          <Card className="bg-white rounded-[18px] p-3.5 border-none shadow-sm flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-[0.01]"><Target className="w-28 h-28" /></div>
              <div className="relative z-10 space-y-2.5">
                  <div>
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5">Academic Pulse</p>
                      <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-900 tracking-tighter">8.85</span>
                          <span className="text-[6.5px] font-black text-indigo-600 uppercase bg-indigo-50 px-1 py-0.5 rounded leading-none">GPA</span>
                      </div>
                  </div>
                  <div className="space-y-1">
                      <div className="flex justify-between text-[6px] font-black text-slate-400 uppercase">
                          <span>Merit track</span>
                          <span className="text-indigo-600 font-black">90%</span>
                      </div>
                      <div className="h-0.5 w-full bg-slate-50 rounded-full border border-slate-100">
                          <div className="h-full bg-indigo-500 rounded-full" style={{width: '90%'}}></div>
                      </div>
                  </div>
                  <div className="flex items-start gap-1.5 bg-indigo-50/50 p-1.5 rounded-[12px] border border-indigo-100">
                    <Star className="w-2 h-2 text-indigo-600 fill-indigo-600/20 shrink-0" />
                    <p className="text-[6.5px] text-indigo-900 font-bold leading-tight italic uppercase">
                      "Trending #1 in Dist. Systems."
                    </p>
                  </div>
              </div>
          </Card>
      </div>

      {/* Categorized Quick Access Section */}
      <div className="space-y-4 pt-1">
         {quickAccessGroups.map((group, gIdx) => ( group.items.length > 0 && (
             <div key={gIdx} className="space-y-1.5">
                 <div className="flex items-center gap-1.5 px-1">
                    <div className="text-left shrink-0">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">{group.title}</h3>
                        <p className="text-[6px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">{group.subtitle}</p>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {group.items.map((item) => {
                        const nav = getNavItem(item.id);
                        if (!nav) return null;
                        return (
                            <div 
                                key={item.id} 
                                className="bg-white border border-slate-100 rounded-[18px] p-3 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 group shadow-sm min-h-[110px] relative overflow-hidden"
                                onClick={() => onNavigate(item.id)}
                            >
                                <div className="absolute top-0 right-0 p-3 bg-slate-50 rounded-bl-[24px] opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100"></div>
                                
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="p-2 rounded-[8px] bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-indigo-400 transition-all shadow-inner">
                                        {React.cloneElement(nav.icon as React.ReactElement<any>, { className: "w-3 h-3" })}
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5">
                                        <Badge variant={item.metaType as any} className="font-black text-[5.5px] px-1 py-0.5 uppercase tracking-widest border-none">
                                            {item.meta}
                                        </Badge>
                                        {item.highlight && (
                                            <span className="px-1 py-0.5 rounded-full bg-indigo-600 text-white text-[4px] font-black uppercase tracking-[0.2em] animate-pulse">
                                                {item.highlight}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-auto relative z-10">
                                    <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-none">{nav.label}</h4>
                                    <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-70">{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                 </div>
             </div>
         )))}
      </div>

      {/* Footer Charts Section */}
      <div className="grid gap-2 lg:grid-cols-3 pb-4 pt-1">
        <div className="lg:col-span-2">
            <AttendanceChart subjects={subjects} />
        </div>

        <Card title="System Circulars" className="h-full border-none shadow-sm rounded-[18px] overflow-hidden flex flex-col bg-white border border-slate-100">
            <div className="p-3 space-y-2.5 flex-1">
                {notices.slice(0, 4).map((notice, i) => (
                    <div 
                        key={notice.id} 
                        onClick={() => onNavigate('notices')}
                        className="relative pl-5 group cursor-pointer transition-all hover:translate-x-0.5" 
                    >
                        <div className="absolute left-0 top-1 w-1 h-1 rounded-full bg-slate-100 group-hover:bg-indigo-600 transition-all border border-white shadow-sm"></div>
                        <div className="absolute left-[1.5px] top-2.5 w-px h-7 bg-slate-50 group-last:hidden"></div>
                        <p className="text-[6px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5">{notice.date}</p>
                        <h4 className="text-[8px] font-black text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight line-clamp-1 uppercase">{notice.title}</h4>
                        <p className="text-[7px] text-slate-400 mt-0.5 line-clamp-1 font-medium leading-relaxed">{notice.content}</p>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => onNavigate('notices')}
                className="w-full py-2.5 mt-auto text-[6.5px] font-black text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-1 border-t border-slate-50 group"
            >
                Feed <ChevronRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </Card>
      </div>
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .pause:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
