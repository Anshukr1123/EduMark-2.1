
import React from 'react';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Users, BookOpen, AlertCircle, Sparkles, TrendingUp, DollarSign, Activity, UserPlus, CheckSquare, BarChart3, ScrollText, Server, HardDrive, Settings, Bell, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { MOCK_DEPARTMENTS, MOCK_FEES, MOCK_TICKETS } from '../../constants';

const AdminDashboard: React.FC = () => {
  // Mock Data Enhancements
  const revenueData = [
    { month: 'Jan', amount: 120000 }, { month: 'Feb', amount: 150000 },
    { month: 'Mar', amount: 180000 }, { month: 'Apr', amount: 140000 },
    { month: 'May', amount: 200000 }, { month: 'Jun', amount: 250000 },
  ];

  const userDistribution = [
      { name: 'Students', value: 1240, color: '#4f46e5' }, // Indigo-600
      { name: 'Teachers', value: 85, color: '#06b6d4' }, // Cyan-500
      { name: 'Staff', value: 45, color: '#8b5cf6' }, // Violet-500
  ];

  const quickActions = [
      { label: 'Add User', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Student/Staff' },
      { label: 'Approvals', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50', sub: '5 Pending' },
      { label: 'Fee Reports', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Download' },
      { label: 'System Logs', icon: ScrollText, color: 'text-slate-600', bg: 'bg-slate-50', sub: 'View Audit' },
      { label: 'CMS Config', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Manage Site' },
      { label: 'Broadcast', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'Send Alerts' },
  ];

  const recentActivity = [
      { title: 'New Student Registration', time: '2 mins ago', type: 'USER', detail: 'John Doe added to Computer Science Dept', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
      { title: 'Fee Payment Received', time: '15 mins ago', type: 'FINANCE', detail: '₹25,000 received via UPI (Transaction ID: TXN8829)', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
      { title: 'System Backup Completed', time: '1 hour ago', type: 'SYSTEM', detail: 'Daily database backup successful (4.2GB)', icon: Server, color: 'text-slate-500', bg: 'bg-slate-100' },
      { title: 'Support Ticket Raised', time: '2 hours ago', type: 'SUPPORT', detail: '#T-402: WiFi Connectivity Issues in Block B', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100' },
      { title: 'Content Update', time: '4 hours ago', type: 'CMS', detail: 'New event "Tech Symposium" published', icon: ScrollText, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Overview</h2>
              <div className="flex items-center gap-2 mt-1">
                  <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-slate-500 text-sm font-medium">System Status: <span className="text-green-600">Operational</span></p>
              </div>
          </div>
          <Button variant="outline"><Sparkles className="w-4 h-4 mr-2"/> Generate Report</Button>
       </div>

       {/* Detailed Stats Cards */}
       <div className="grid gap-6 md:grid-cols-4">
          <Card className="hover:shadow-lg transition-all border-none bg-gradient-to-br from-indigo-500 to-indigo-600 text-white relative overflow-hidden">
             <div className="relative z-10">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs font-bold text-indigo-100 uppercase opacity-80">Total Users</p>
                       <div className="font-bold text-3xl mt-1">1,370</div>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Users className="w-5 h-5"/></div>
                 </div>
                 <div className="mt-4 flex items-center text-xs font-medium text-indigo-100">
                    <TrendingUp className="w-3 h-3 mr-1"/> +5.2% from last month
                 </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          </Card>
          
          <Card className="hover:shadow-lg transition-all border-none bg-white">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase">Total Revenue</p>
                   <div className="font-bold text-3xl text-slate-900 mt-1">₹42.5L</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><DollarSign className="w-5 h-5"/></div>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1"/> +12% YoY
             </div>
          </Card>

          <Card className="hover:shadow-lg transition-all border-none bg-white">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase">Avg Attendance</p>
                   <div className="font-bold text-3xl text-slate-900 mt-1">87%</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><BookOpen className="w-5 h-5"/></div>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Stable (7 days)
             </div>
          </Card>

          <Card className="hover:shadow-lg transition-all border-none bg-white">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase">Pending Issues</p>
                   <div className="font-bold text-3xl text-slate-900 mt-1">{MOCK_TICKETS.filter(t => t.status === 'OPEN').length}</div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle className="w-5 h-5"/></div>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-red-600">
                3 high priority tickets
             </div>
          </Card>
       </div>

       <div className="grid gap-6 md:grid-cols-3">
           {/* Charts Section */}
           <Card title="Financial Overview" className="md:col-span-2">
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

           <Card title="User Distribution">
                <div className="h-72 mt-4 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={userDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {userDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
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

       {/* System Health & Quick Actions */}
       <div className="grid md:grid-cols-4 gap-6">
           <div className="md:col-span-1 space-y-4">
               {/* Server Status Widget */}
               <Card className="bg-slate-900 text-white border-none">
                   <div className="flex items-center justify-between mb-4">
                       <h3 className="font-bold text-sm flex items-center"><Activity className="w-4 h-4 mr-2 text-green-400"/> Server Status</h3>
                       <Badge variant="success" className="bg-green-500/20 text-green-400 border-none">Good</Badge>
                   </div>
                   <div className="space-y-4">
                       <div>
                           <div className="flex justify-between text-xs text-slate-400 mb-1"><span>CPU Usage</span><span>24%</span></div>
                           <div className="w-full bg-slate-700 h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: '24%'}}></div></div>
                       </div>
                       <div>
                           <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Memory</span><span>4.2GB / 16GB</span></div>
                           <div className="w-full bg-slate-700 h-1.5 rounded-full"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: '32%'}}></div></div>
                       </div>
                       <div>
                           <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Storage</span><span>85%</span></div>
                           <div className="w-full bg-slate-700 h-1.5 rounded-full"><div className="bg-amber-500 h-1.5 rounded-full" style={{width: '85%'}}></div></div>
                       </div>
                   </div>
               </Card>
           </div>
           
           <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActions.map((action, i) => (
                    <button key={i} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-indigo-200 transition-all group h-full">
                        <div className={`p-3 rounded-full ${action.bg} ${action.color} mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                            <action.icon className="w-5 h-5"/>
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-center group-hover:text-indigo-700">{action.label}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{action.sub}</span>
                    </button>
                ))}
           </div>
       </div>

       {/* Recent Activity Feed */}
       <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
              <Card title="Live System Activity" className="h-full">
                 <div className="space-y-0 divide-y divide-slate-50 mt-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {recentActivity.map((act, i) => (
                       <div key={i} className="flex items-start p-4 hover:bg-slate-50 transition-colors group rounded-lg">
                          <div className={`p-2.5 rounded-xl mr-4 ${act.bg} ${act.color} group-hover:scale-110 transition-transform`}>
                             <act.icon className="w-5 h-5"/>
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-sm text-slate-800">{act.title}</h4>
                                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{act.time}</span>
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed">{act.detail}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="p-4 border-t border-slate-100 text-center">
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-center mx-auto">View Full Logs <ArrowRight className="w-4 h-4 ml-1"/></button>
                 </div>
              </Card>
          </div>
          <div>
             <Card title="Pending Actions" className="h-full">
                <div className="space-y-4 mt-2">
                   <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-full -mr-4 -mt-4 opacity-50"></div>
                       <div className="flex justify-between items-center mb-2 relative z-10">
                           <span className="text-xs font-bold text-amber-700 uppercase">Approvals</span>
                           <Badge variant="warning">5 Pending</Badge>
                       </div>
                       <p className="text-xs text-amber-800 mb-3 relative z-10">5 student leave requests require approval.</p>
                       <Button size="sm" className="w-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 h-8 text-xs relative z-10">Review Now</Button>
                   </div>
                   
                   <div className="p-4 bg-red-50 rounded-xl border border-red-100 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full -mr-4 -mt-4 opacity-50"></div>
                       <div className="flex justify-between items-center mb-2 relative z-10">
                           <span className="text-xs font-bold text-red-700 uppercase">Alerts</span>
                           <Badge variant="error">2 Critical</Badge>
                       </div>
                       <p className="text-xs text-red-800 mb-3 relative z-10">Storage capacity exceeding 85% limit.</p>
                       <Button size="sm" className="w-full bg-white text-red-700 border border-red-200 hover:bg-red-100 h-8 text-xs relative z-10">Check Diagnostics</Button>
                   </div>

                   <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-full -mr-4 -mt-4 opacity-50"></div>
                       <div className="flex justify-between items-center mb-2 relative z-10">
                           <span className="text-xs font-bold text-indigo-700 uppercase">Feedback</span>
                           <Badge variant="neutral" className="bg-indigo-100 text-indigo-700 border-indigo-200">New</Badge>
                       </div>
                       <p className="text-xs text-indigo-800 mb-3 relative z-10">New course feedback available for review.</p>
                       <Button size="sm" className="w-full bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100 h-8 text-xs relative z-10">View Report</Button>
                   </div>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
};
export default AdminDashboard;
