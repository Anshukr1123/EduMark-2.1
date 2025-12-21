
import React from 'react';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Users, BookOpen, AlertCircle, Sparkles, TrendingUp, DollarSign, Activity, UserPlus, CheckSquare, BarChart3, ScrollText, Server, HardDrive, Settings, Bell, ArrowRight, Zap, CheckCircle, ShieldAlert, History, Globe } from 'lucide-react';
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
      { label: 'Provision User', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Institutional Node' },
      { label: 'Approvals', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50', sub: '5 Pending Tasks' },
      { label: 'Financial Audit', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Master Ledger' },
      { label: 'System Audit', icon: ScrollText, color: 'text-slate-700', bg: 'bg-slate-100', sub: 'Security Logs' },
  ];

  const detailedLogs = [
      { id: 'L-101', event: 'Database Encrypted Backup', user: 'System-Auto', status: 'SUCCESS', time: '02:00 AM' },
      { id: 'L-102', event: 'Auth Layer Security Patch v2.1', user: 'Emily Admin', status: 'COMPLETED', time: 'Yesterday' },
      { id: 'L-103', event: 'User Audit Export Protocol', user: 'Robert Staff', status: 'IN_PROGRESS', time: '10 mins ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command Center</h2>
              <div className="flex items-center gap-3 mt-3">
                  <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">System Health: <span className="text-green-600 underline decoration-2 underline-offset-4">NOMINAL</span></p>
              </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-2xl"><History className="w-4 h-4 mr-2.5"/> Central Audit</Button>
            <Button className="shadow-2xl shadow-indigo-200 font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-2xl"><Sparkles className="w-4 h-4 mr-2.5"/> AI Forecasting</Button>
          </div>
       </div>

       {/* Massive Stats Display */}
       <div className="grid gap-6 md:grid-cols-4 animate-in slide-in-from-top-4 duration-700">
          <Card className="hover:shadow-2xl transition-all border-none bg-slate-900 text-white relative overflow-hidden p-8 group">
             <div className="relative z-10 space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Global Population</p>
                        <div className="font-black text-6xl mt-2 tracking-tighter leading-none">1,370</div>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform"><Users className="w-6 h-6"/></div>
                 </div>
                 <div className="flex items-center text-[11px] font-black text-indigo-300 uppercase tracking-widest"><TrendingUp className="w-4 h-4 mr-2"/> +5.2% Quarterly Intake</div>
             </div>
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] transform translate-x-12 -translate-y-12"></div>
          </Card>

          <Card className="hover:shadow-2xl transition-all bg-white border-2 border-slate-50 p-8 group">
             <div className="space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Financial Yield</p>
                        <div className="font-black text-5xl text-slate-900 mt-2 tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">₹42.5L</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner"><DollarSign className="w-6 h-6"/></div>
                 </div>
                 <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 w-fit px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    <TrendingUp className="w-4 h-4 mr-2"/> +12% Efficiency
                 </div>
             </div>
          </Card>

          <Card className="hover:shadow-2xl transition-all bg-white border-2 border-slate-50 p-8 group">
             <div className="space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Consistency</p>
                        <div className="font-black text-5xl text-slate-900 mt-2 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">87.4%</div>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"><Activity className="w-6 h-6"/></div>
                 </div>
                 <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"><div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> Network Stable</div>
             </div>
          </Card>

          <Card className="hover:shadow-2xl transition-all bg-white border-2 border-slate-50 p-8 group">
             <div className="space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Escalations</p>
                        <div className="font-black text-5xl text-slate-900 mt-2 tracking-tighter leading-none group-hover:text-red-600 transition-colors">04</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner"><ShieldAlert className="w-6 h-6"/></div>
                 </div>
                 <div className="flex items-center text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-4 py-1.5 rounded-full">ACTION REQUIRED</div>
             </div>
          </Card>
       </div>

       <div className="grid gap-8 md:grid-cols-3">
           <Card title="Financial Recovery Mapping" className="md:col-span-2 p-10">
             <div className="h-80 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9"/>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 900}} dy={15}/>
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}/>
                      <Tooltip contentStyle={{borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}} itemStyle={{fontWeight: 900}}/>
                      <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={2000}/>
                   </AreaChart>
                </ResponsiveContainer>
             </div>
           </Card>

           <Card title="Core Distribution" className="p-10 flex flex-col items-center justify-center">
                <div className="h-80 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={12}>
                                {userDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', fontWeight: 900}} />
                            <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em'}}/>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">1.37k</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Population</span>
                    </div>
                </div>
           </Card>
       </div>

       {/* Audit Interface */}
       <Card className="rounded-[40px] overflow-hidden border-none shadow-2xl p-0">
          <div className="bg-slate-50 px-10 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                  <History className="w-5 h-5 text-indigo-600"/> Audit Protocol Feed
              </h3>
              <Button size="sm" variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200">Full Archive</Button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-white text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                   <tr>
                      <th className="px-10 py-5">Node ID</th>
                      <th className="px-10 py-5">System Event</th>
                      <th className="px-10 py-5">Originator</th>
                      <th className="px-10 py-5">Timestamp</th>
                      <th className="px-10 py-5 text-right">Verification</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                   {detailedLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                         <td className="px-10 py-6 font-mono text-xs font-bold text-slate-400">{log.id}</td>
                         <td className="px-10 py-6 font-black text-slate-900 text-sm tracking-tight uppercase">{log.event}</td>
                         <td className="px-10 py-6 text-slate-600 font-bold text-xs">{log.user}</td>
                         <td className="px-10 py-6 text-slate-400 text-xs font-bold">{log.time}</td>
                         <td className="px-10 py-6 text-right">
                             <Badge variant={log.status === 'SUCCESS' || log.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[10px] font-black uppercase px-4 py-1 border-none shadow-sm">
                                 {log.status}
                             </Badge>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </Card>

       <div className="grid md:grid-cols-4 gap-6 pb-20">
            {quickActions.map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-10 bg-white border-2 border-slate-50 rounded-[40px] hover:shadow-2xl hover:border-indigo-600 transition-all group h-full shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[48px] -mr-8 -mt-8 group-hover:bg-indigo-600 transition-all duration-500"></div>
                    <div className={`p-6 rounded-[28px] ${action.bg} ${action.color} mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl group-hover:bg-indigo-600 group-hover:text-white relative z-10`}>
                        <action.icon className="w-8 h-8"/>
                    </div>
                    <span className="text-base font-black text-slate-900 text-center group-hover:text-indigo-600 uppercase tracking-tighter leading-none relative z-10">{action.label}</span>
                    <span className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest opacity-80 relative z-10">{action.sub}</span>
                </button>
            ))}
       </div>
    </div>
  );
};
export default AdminDashboard;
