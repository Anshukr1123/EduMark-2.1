
import React, { useEffect, useState } from 'react';
import { User, Subject, Assignment, FeeRecord, Notice } from '../../types';
import { Card } from '../../components/UIComponents';
import { WifiOff, School, Clock } from 'lucide-react';
import { NavItem } from '../../components/Layout';
import { MOCK_COLLEGE_INFO } from '../../constants';

import StudentHeader from './dashboard/StudentHeader';
import StudentStats from './dashboard/StudentStats';
import AttendanceChart from './dashboard/AttendanceChart';

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-center text-sm text-amber-800 animate-in slide-in-from-top-2">
           <WifiOff className="w-4 h-4 mr-2" />
           <span className="font-medium">You are currently offline.</span> Some features may be unavailable.
        </div>
      )}

      {lastUpdate && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3 animate-in slide-in-from-right-10 fade-in duration-500">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
            <div><p className="text-sm font-medium">Attendance Updated</p><p className="text-xs text-slate-400">{lastUpdate}</p></div>
        </div>
      )}

      {/* Header Section with Live Clock */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="flex-1 animate-in slide-in-from-left-4 duration-500">
             <StudentHeader user={user} />
          </div>
          <div className="hidden md:flex flex-col justify-center items-center bg-white border border-slate-200 rounded-2xl p-6 min-w-[180px] shadow-sm animate-in slide-in-from-right-4 duration-500">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Live Time</span>
              <div className="text-3xl font-black text-indigo-600 font-mono">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1"/> {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
          </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-backwards">
          <StudentStats averageAttendance={averageAttendance} assignments={assignments} fees={fees} onNavigate={onNavigate} />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
         <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">Quick Actions</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {navItems.filter(i => i.id !== 'dashboard').map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 group" 
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onNavigate(item.id)}
              >
                 <div className="p-3.5 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-3 shadow-sm">
                   {item.icon}
                 </div>
                 <span className="text-xs font-bold text-slate-700 text-center group-hover:text-indigo-700">{item.label}</span>
              </div>
            ))}
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
        <div className="lg:col-span-2 space-y-6">
            <AttendanceChart subjects={subjects} />
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none transform transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg"><School className="w-8 h-8 text-indigo-300"/></div>
                    <div>
                        <h4 className="font-bold text-lg">{MOCK_COLLEGE_INFO.name}</h4>
                        <p className="text-sm text-slate-400">{MOCK_COLLEGE_INFO.address}</p>
                    </div>
                </div>
            </Card>
        </div>
        <div className="space-y-6">
            <Card title="Recent Notices" className="h-full">
                <div className="space-y-5 mt-2">
                    {notices.slice(0, 3).map((notice, i) => (
                        <div key={notice.id} className="relative pl-4 border-l-2 border-slate-100 last:border-0 pb-1 hover:bg-slate-50 p-2 rounded-r transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="absolute -left-[5px] top-3.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white"></div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{notice.title}</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{notice.content}</p>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase">{notice.sender}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{notice.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
