
import React from 'react';
import { User } from '../../types';
import { MOCK_TEACHER_CLASSES, MOCK_NOTICES, MOCK_ASSIGNMENTS } from '../../constants';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Clock, MapPin, Users, QrCode, FileText, CheckCircle2, AlertCircle, Calendar, Plus, TrendingUp, CalendarCheck, FilePlus, UploadCloud, MessageSquare, Briefcase, File, ChevronRight, User as UserIcon, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';

interface Props { user: User; activeTab: string; }

const TeacherDashboard: React.FC<Props> = ({ user }) => {
  const upcomingClasses = MOCK_TEACHER_CLASSES.filter(c => c.status !== 'COMPLETED');
  const nextClass = upcomingClasses.find(c => c.status === 'LIVE') || upcomingClasses[0];

  const pendingGrading = MOCK_ASSIGNMENTS.filter(a => a.status === 'SUBMITTED' || a.status === 'PENDING').length; 
  
  // Enhanced Submissions Data
  const recentSubmissions = [
      { id: 1, student: "Alice Johnson", assignment: "Data Structures Project", time: "10 mins ago", status: "submitted", avatar: "https://picsum.photos/seed/s1/100" },
      { id: 2, student: "Bob Smith", assignment: "Calculus Quiz 1", time: "1 hour ago", status: "late", avatar: "https://picsum.photos/seed/s2/100" },
      { id: 3, student: "Charlie Brown", assignment: "Lab Report 3", time: "2 hours ago", status: "submitted", avatar: "https://picsum.photos/seed/s3/100" },
      { id: 4, student: "Diana Prince", assignment: "Technical Writing Draft", time: "3 hours ago", status: "submitted", avatar: "https://picsum.photos/seed/s4/100" },
  ];

  // Enhanced Deadlines Data
  const upcomingDeadlines = MOCK_ASSIGNMENTS
    .filter(a => new Date(a.dueDate) >= new Date())
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const pendingTasks = [
      { label: 'Grading', count: 12, total: 40, color: 'bg-amber-500' },
      { label: 'Attendance', count: 1, total: 3, color: 'bg-blue-500' },
      { label: 'Material Upload', count: 2, total: 5, color: 'bg-indigo-500' },
  ];

  // Mock Performance Data
  const performanceData = [
      { name: 'Quiz 1', avg: 75 },
      { name: 'Mid-Term', avg: 68 },
      { name: 'Lab 1', avg: 85 },
      { name: 'Quiz 2', avg: 72 },
      { name: 'Final Project', avg: 80 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h2>
           <p className="text-slate-500">Overview of your academic activities and pending actions.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
           <div className="px-3 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600">Fall 2024</div>
           <div className="h-4 w-px bg-slate-200"></div>
           <div className="px-3 py-1 text-xs font-medium text-slate-500 flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card className="p-4 border-l-4 border-l-indigo-600 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Students</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">142</h3>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg"><Users className="w-5 h-5 text-indigo-600"/></div>
             </div>
         </Card>
         <Card className="p-4 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg Attendance</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">88%</h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-600"/></div>
             </div>
         </Card>
         <Card className="p-4 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Grading</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingGrading}</h3>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg"><FileText className="w-5 h-5 text-amber-600"/></div>
             </div>
         </Card>
         <Card className="p-4 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Next Class</p>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">{nextClass?.time.split(' - ')[0] || 'Done'}</h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg"><Calendar className="w-5 h-5 text-purple-600"/></div>
             </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Active Class / Quick Action Hero */}
           <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
               {nextClass ? (
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                       <div>
                           <div className="flex items-center gap-2 mb-2">
                               {nextClass.status === 'LIVE' ? (
                                   <span className="flex items-center text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">● LIVE NOW</span>
                               ) : (
                                   <span className="flex items-center text-xs font-bold bg-indigo-500 text-white px-2 py-0.5 rounded">UP NEXT</span>
                               )}
                               <span className="text-slate-300 text-sm">{nextClass.time}</span>
                           </div>
                           <h3 className="text-2xl font-bold">{nextClass.subjectName}</h3>
                           <p className="text-slate-400 text-sm mt-1 flex items-center gap-3">
                               <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {nextClass.room}</span>
                               <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> {nextClass.studentCount} Students</span>
                           </p>
                       </div>
                       <Button variant="secondary" className="whitespace-nowrap shadow-lg">
                           <QrCode className="w-4 h-4 mr-2"/> {nextClass.status === 'LIVE' ? 'Take Attendance' : 'Start Session'}
                       </Button>
                   </div>
               ) : (
                   <div className="relative z-10 py-4">
                       <h3 className="text-2xl font-bold">No more classes today!</h3>
                       <p className="text-slate-400 mt-1">You're all caught up with your schedule.</p>
                   </div>
               )}
           </div>

           {/* Performance Trends Chart */}
           <Card title="Class Performance Trends">
                <div className="h-64 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
           </Card>

           <div className="grid md:grid-cols-2 gap-6">
               {/* Today's Schedule List */}
               <Card title="Today's Schedule" className="h-full">
                  <div className="divide-y divide-slate-100">
                     {MOCK_TEACHER_CLASSES.map((cls) => (
                        <div key={cls.id} className="flex items-center py-3 hover:bg-slate-50 transition-colors -mx-2 px-2 rounded-lg">
                           <div className="w-14 text-center flex-shrink-0">
                              <p className="text-xs font-bold text-slate-800">{cls.time.split(' ')[0]}</p>
                              <p className="text-[10px] font-medium text-slate-400">{cls.time.split(' ')[1]}</p>
                           </div>
                           <div className="flex-1 pl-3 border-l-2 border-slate-200">
                              <h4 className="font-bold text-sm text-slate-900 truncate">{cls.subjectName}</h4>
                              <div className="flex justify-between items-center mt-1">
                                  <p className="text-xs text-slate-500">{cls.room}</p>
                                  <Badge variant={cls.status === 'LIVE' ? 'success' : cls.status === 'COMPLETED' ? 'neutral' : 'warning'} className="text-[9px] px-1.5 py-0">{cls.status}</Badge>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>

               {/* Recent Student Submissions */}
               <Card title="Recent Student Submissions" className="h-full">
                   <div className="space-y-4">
                       {recentSubmissions.map((sub) => (
                           <div key={sub.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                               <img src={sub.avatar} alt={sub.student} className="w-8 h-8 rounded-full bg-slate-200" />
                               <div className="flex-1 min-w-0">
                                   <div className="flex justify-between items-start">
                                       <p className="text-sm font-bold text-slate-900 truncate">{sub.student}</p>
                                       <span className={`text-[10px] font-bold uppercase px-1.5 rounded ${sub.status === 'late' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{sub.status}</span>
                                   </div>
                                   <p className="text-xs text-slate-600 truncate">{sub.assignment}</p>
                                   <p className="text-[10px] text-slate-400 mt-0.5">{sub.time}</p>
                               </div>
                           </div>
                       ))}
                       <Button variant="outline" size="sm" className="w-full text-xs">View All Submissions <ChevronRight className="w-3 h-3 ml-1"/></Button>
                   </div>
               </Card>
           </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
           
           {/* Quick Actions Grid */}
           <div className="grid grid-cols-2 gap-3">
               <button className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center gap-2 group">
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform"><CalendarCheck className="w-5 h-5"/></div>
                   <span className="text-xs font-bold text-slate-700">Attendance</span>
               </button>
               <button className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all flex flex-col items-center gap-2 group">
                   <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform"><FilePlus className="w-5 h-5"/></div>
                   <span className="text-xs font-bold text-slate-700">Assignment</span>
               </button>
               <button className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-purple-200 transition-all flex flex-col items-center gap-2 group">
                   <div className="p-2.5 bg-purple-50 text-purple-600 rounded-full group-hover:scale-110 transition-transform"><UploadCloud className="w-5 h-5"/></div>
                   <span className="text-xs font-bold text-slate-700">Material</span>
               </button>
               <button className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-pink-200 transition-all flex flex-col items-center gap-2 group">
                   <div className="p-2.5 bg-pink-50 text-pink-600 rounded-full group-hover:scale-110 transition-transform"><BarChart3 className="w-5 h-5"/></div>
                   <span className="text-xs font-bold text-slate-700">Report</span>
               </button>
           </div>

           {/* Pending Tasks Summary */}
           <Card title="Pending Tasks Summary">
               <div className="space-y-4 mt-2">
                   {pendingTasks.map((task, i) => (
                       <div key={i}>
                           <div className="flex justify-between text-xs font-semibold mb-1">
                               <span className="text-slate-600">{task.label}</span>
                               <span className="text-slate-900">{task.count}/{task.total}</span>
                           </div>
                           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className={`h-full ${task.color} rounded-full`} style={{width: `${(task.count / task.total) * 100}%`}}></div>
                           </div>
                       </div>
                   ))}
               </div>
               <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                   <Button size="sm" variant="outline" className="text-xs">Grade All</Button>
                   <Button size="sm" variant="outline" className="text-xs">Review</Button>
               </div>
           </Card>

           {/* Upcoming Deadlines */}
           <Card title="Upcoming Deadlines">
               <div className="space-y-4 mt-2">
                   {upcomingDeadlines.map((a) => {
                       const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                       return (
                           <div key={a.id} className="flex gap-3 items-center group cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                               <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg p-2 min-w-[50px] shadow-sm group-hover:border-indigo-200">
                                   <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(a.dueDate).toLocaleString('default', {month:'short'})}</span>
                                   <span className="text-lg font-bold text-slate-800 leading-none">{new Date(a.dueDate).getDate()}</span>
                               </div>
                               <div className="flex-1 min-w-0">
                                   <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{a.title}</h4>
                                   <p className="text-xs text-slate-500 truncate">{a.subject}</p>
                                   <p className="text-[10px] font-semibold text-indigo-600 mt-0.5">
                                       {daysLeft === 0 ? 'Due Today' : `Due in ${daysLeft} days`}
                                   </p>
                               </div>
                           </div>
                       );
                   })}
                   {upcomingDeadlines.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No deadlines this week.</p>}
               </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
export default TeacherDashboard;
