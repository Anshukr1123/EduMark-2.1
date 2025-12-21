
import React from 'react';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Users, BookOpen, AlertCircle, Sparkles, TrendingUp, DollarSign, Activity, UserPlus, CheckSquare, BarChart3, ScrollText, Server, HardDrive, Settings, Bell, ArrowRight, Zap, CheckCircle, ShieldAlert, History } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { MOCK_DEPARTMENTS, MOCK_FEES, MOCK_TICKETS } from '../../constants';

const AdminDashboard: React.FC = () => {
  const revenueData = [
    { month: 'Jan', amount: 120000 }, { month: 'Feb', amount: 150000 },
    { month: 'Mar', amount: 180000 }, { month: 'Apr', amount: 140000 },
    { month: 'May', amount: 200000 }, { month: 'Jun', amount: 250000 },
  ];

  const userDistribution = [
      { name: 'Students', value: 1240, color: '#4f46e5' },
      { name: 'Teachers', value: 85, color: '#06b6d4' },
      { name: 'Staff', value: 45, color: '#8b5cf6' },
  ];

  const quickActions = [
      { label: 'Add User', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Student/Staff' },
      { label: 'Approvals', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50', sub: '5 Pending' },
      { label: 'Fee Reports', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Download' },
      { label: 'System Logs', icon: ScrollText, color: 'text-slate-600', bg: 'bg-slate-50', sub: 'View Audit' },
      { label: 'CMS Config', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Manage Site' },
      { label: 'Broadcast', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'Send Alerts' },
  ];

  const detailedLogs = [
      { id: 'L-101', event: 'Database Backup', user: 'System-Auto', status: 'SUCCESS', time: '02:00 AM' },
      { id: 'L-102', event: 'Security Patch v2.1', user: 'Emily Admin', status: 'COMPLETED', time: 'Yesterday' },
      { id: 'L-103', event: 'User Audit Export', user: 'Robert Staff', status: 'IN_PROGRESS', time: '10 mins ago' },
      { id: 'L-104', event: 'Mass Email Broadcast', user: 'Admin Portal', status: 'FAILED', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Intelligence Dashboard</h2>
              <div className="flex items-center gap-2 mt-1">
                  <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-slate-500 text-sm font-medium">System Status: <span className="text-green-600 font-bold uppercase tracking-tight">Operational</span></p>
              </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200"><History className="w-4 h-4 mr-2"/> Audit Vault</Button>
            <Button className="shadow-lg shadow-indigo-100"><Sparkles className="w-4 h-4 mr-2"/> Generate Intelligence</Button>
          </div>
       </div>

       {/* Detailed Stats Cards */}
       <div className="grid gap-6 md:grid-cols-4 animate-in slide-in-from-top-4 duration-500 fill-mode-backwards">
          <Card className="hover:shadow-lg transition-all border-none bg-slate-900 text-white relative overflow-hidden">
             <div className="relative z-10">
                 <div className="flex justify-between items-start">
                    <div><p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Population</p><div className="font-bold text-3xl mt-1 tracking-tighter">1,370</div></div>
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><Users className="w-5 h-5"/></div>
                 </div>
                 <div className="mt-4 flex items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest"><TrendingUp className="w-3 h-3 mr-1"/> +5.2% YoY Growth</div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
          </Card>
          <Card className="hover:shadow-lg transition-all bg-white border-slate-200">
             <div className="flex justify-between items-start">
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Yield</p><div className="font-bold text-3xl text-slate-900 mt-1 tracking-tighter">₹42.5L</div></div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="w-5 h-5"/></div>
             </div>
             <div className="mt-4 flex items-center text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full uppercase tracking-tighter"><TrendingUp className="w-3 h-3 mr-1"/> +12% Collection Efficiency</div>
          </Card>
          <Card className="hover:shadow-lg transition-all bg-white border-slate-200">
             <div className="flex justify-between items-start">
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Health</p><div className="font-bold text-3xl text-slate-900 mt-1 tracking-tighter">87%</div></div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><BookOpen className="w-5 h-5"/></div>
             </div>
             <div className="mt-4 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Attendance Stable</div>
          </Card>
          <Card className="hover:shadow-lg transition-all bg-white border-slate-200">
             <div className="flex justify-between items-start">
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Escalations</p><div className="font-bold text-3xl text-slate-900 mt-1 tracking-tighter">{MOCK_TICKETS.filter(t => t.status === 'OPEN').length}</div></div>
                <div className="p-2 bg-red-50 rounded-lg text-red-600"><ShieldAlert className="w-5 h-5"/></div>
             </div>
             <div className="mt-4 flex items-center text-[10px] font-bold text-red-600 uppercase tracking-tighter">3 High Priority Reports</div>
          </Card>
       </div>

       {/* Detailed System Logs Table */}
       <Card title="Granular System Logs" className="animate-in slide-in-from-top-4 duration-500 delay-100 fill-mode-backwards">
          <div className="overflow-x-auto mt-2">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                   <tr>
                      <th className="p-4">Event ID</th>
                      <th className="p-4">System Event</th>
                      <th className="p-4">Initiated By</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {detailedLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="p-4 font-mono text-xs text-slate-500">{log.id}</td>
                         <td className="p-4 font-bold text-slate-900">{log.event}</td>
                         <td className="p-4 text-slate-600">{log.user}</td>
                         <td className="p-4 text-slate-500 text-xs">{log.time}</td>
                         <td className="p-4 text-right">
                             <Badge variant={log.status === 'SUCCESS' || log.status === 'COMPLETED' ? 'success' : log.status === 'FAILED' ? 'error' : 'warning'} className="text-[9px] font-black uppercase">
                                 {log.status}
                             </Badge>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </Card>

       <div className="grid gap-6 md:grid-cols-3 animate-in slide-in-from-top-4 duration-500 delay-200 fill-mode-backwards">
           <Card title="Financial Recovery Trend" className="md:col-span-2">
             <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}/>
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}}/>
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                      <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
           </Card>

           <Card title="Identity Distribution">
                <div className="h-72 mt-4 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {userDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <span className="text-2xl font-bold text-slate-800">1,370</span>
                        <span className="text-xs text-slate-400 uppercase font-bold">Total</span>
                    </div>
                </div>
           </Card>
       </div>

       <div className="grid md:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-500 delay-300 fill-mode-backwards pb-10">
            {quickActions.map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-2xl hover:border-indigo-200 transition-all group h-full shadow-sm">
                    <div className={`p-4 rounded-2xl ${action.bg} ${action.color} mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner`}>
                        <action.icon className="w-6 h-6"/>
                    </div>
                    <span className="text-sm font-black text-slate-800 text-center group-hover:text-indigo-700 uppercase tracking-tighter">{action.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{action.sub}</span>
                </button>
            ))}
       </div>
    </div>
  );
};
export default AdminDashboard;
