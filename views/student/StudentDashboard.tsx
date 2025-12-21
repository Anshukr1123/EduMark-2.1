
import React from 'react';
import { User, Subject, Assignment, FeeRecord, Notice } from '../../types';
import { Card, Button } from '../../components/UIComponents';
import { WifiOff, School, ChevronRight, MessageSquare, ArrowRight, Bell } from 'lucide-react';
import { NavItem } from '../../components/Layout';
import { MOCK_COLLEGE_INFO } from '../../constants';

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
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-sm text-amber-800 shadow-sm animate-in slide-in-from-top-2">
           <div className="flex items-center">
                <WifiOff className="w-5 h-5 mr-3" />
                <div>
                    <span className="font-bold">Connection Warning</span>
                    <p className="opacity-80">You are currently offline. Local data is being shown.</p>
                </div>
           </div>
           <Button size="sm" variant="outline" className="h-8 text-xs border-amber-200 hover:bg-amber-100 text-amber-800">Reconnect</Button>
        </div>
      )}

      {lastUpdate && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-4 border border-white/10 backdrop-blur-md animate-in slide-in-from-top-10 fade-in duration-500">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
            <div><p className="text-sm font-bold">Cloud Synced</p><p className="text-[10px] text-slate-400 font-mono">Verified at {lastUpdate}</p></div>
            <button onClick={() => window.location.reload()} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ArrowRight className="w-4 h-4 rotate-[-90deg]"/></button>
        </div>
      )}

      {/* Header Section with Isolated Live Clock */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="flex-1 animate-in slide-in-from-left-4 duration-500">
             <StudentHeader user={user} />
          </div>
          <LiveClock />
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-100 fill-mode-backwards">
          <StudentStats averageAttendance={averageAttendance} assignments={assignments} fees={fees} onNavigate={onNavigate} />
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-200 fill-mode-backwards">
         <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-black text-slate-900 flex items-center uppercase tracking-wider text-sm">
                <span className="w-8 h-1 bg-indigo-600 rounded-full mr-3"></span>
                Quick Access
            </h3>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {navItems.filter(i => ['attendance', 'assignments', 'timetable', 'library', 'results', 'fees'].includes(i.id)).map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 hover:-translate-y-2 transition-all duration-500 group shadow-sm border-b-4 border-b-slate-100 hover:border-b-indigo-500" 
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onNavigate(item.id)}
              >
                 <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 mb-4 shadow-inner group-hover:shadow-indigo-500/50 group-hover:rotate-6">
                   {item.icon}
                 </div>
                 <span className="text-xs font-black text-slate-600 text-center group-hover:text-indigo-700 uppercase tracking-widest transition-colors">{item.label}</span>
              </div>
            ))}
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-top-4 duration-700 delay-300 fill-mode-backwards pb-10">
        <div className="lg:col-span-2 space-y-6">
            <AttendanceChart subjects={subjects} />
            <Card className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-none transform transition-all hover:scale-[1.01] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:rotate-[-5deg] transition-transform"><School className="w-8 h-8 text-indigo-300"/></div>
                    <div className="flex-1">
                        <h4 className="font-black text-xl tracking-tight mb-1">{MOCK_COLLEGE_INFO.name}</h4>
                        <p className="text-sm text-slate-400 font-medium">{MOCK_COLLEGE_INFO.address}</p>
                    </div>
                    <Button variant="outline" className="hidden sm:flex border-white/20 text-white hover:bg-white hover:text-slate-900" onClick={() => onNavigate('college_info')}>
                        Campus Map <ChevronRight className="w-4 h-4 ml-1"/>
                    </Button>
                </div>
            </Card>
        </div>
        <div className="space-y-6">
            <Card title="Recent Notices" className="h-full border-none shadow-xl">
                <div className="space-y-4 mt-2">
                    {notices.slice(0, 3).map((notice, i) => (
                        <div 
                            key={notice.id} 
                            onClick={() => onNavigate('notices')}
                            className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-4 cursor-pointer hover:bg-indigo-50/50 p-3 rounded-r-2xl transition-all group" 
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-indigo-500 ring-4 ring-white group-hover:scale-125 transition-all"></div>
                            <p className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{notice.title}</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed opacity-80">{notice.content}</p>
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-[10px] font-black bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-700 px-2 py-0.5 rounded-lg text-slate-500 uppercase tracking-widest transition-colors">{notice.sender}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{notice.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => onNavigate('notices')}
                    className="w-full py-3 mt-4 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 border border-indigo-100 border-dashed"
                >
                    <Bell className="w-3 h-3" /> All Notices
                </button>
            </Card>

            <Card className="bg-indigo-600 text-white border-none shadow-lg shadow-indigo-200 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h4 className="font-bold mb-1">Messages</h4>
                    <p className="text-xs text-indigo-100 opacity-80 mb-4">Check for faculty feedback.</p>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-indigo-600 w-full font-bold"
                        onClick={() => onNavigate('messages')}
                    >
                        Open Inbox
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
