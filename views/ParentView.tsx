
import React, { useState, useMemo } from 'react';
import { User, AttendanceRecord } from '../types';
import Layout, { NavItem } from '../components/Layout';
import { LayoutDashboard, Bell, CreditCard, User as UserIcon, Calendar, CheckCircle2, AlertCircle, Search, FileText, ChevronRight } from 'lucide-react';
import { Card, Badge, Button } from '../components/UIComponents';
import { MOCK_USERS, MOCK_NOTICES, MOCK_SUBJECTS, MOCK_COLLEGE_EVENTS } from '../constants';

interface ParentViewProps {
  user: User;
  onLogout: () => void;
}

const ParentView: React.FC<ParentViewProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [noticeSearch, setNoticeSearch] = useState('');

  // Navigation Items for Parent
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5"/>, category: 'MAIN' },
    { id: 'notices', label: 'Notices', icon: <Bell className="w-5 h-5"/>, category: 'SOCIAL' },
    { id: 'fees', label: 'Fee Status', icon: <CreditCard className="w-5 h-5"/>, category: 'FINANCE' },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5"/>, category: 'SYSTEM' },
  ];

  // Mock Child Data (Linked to Alice for demo)
  const child = MOCK_USERS.find(u => u.role === 'STUDENT') || MOCK_USERS[0];
  const totalClasses = MOCK_SUBJECTS.reduce((acc, sub) => acc + sub.totalClasses, 0);
  const attendedClasses = MOCK_SUBJECTS.reduce((acc, sub) => acc + sub.attendedClasses, 0);
  const attendancePercentage = Math.round((attendedClasses / totalClasses) * 100);

  const filteredNotices = useMemo(() => 
    MOCK_NOTICES.filter(n => n.title.toLowerCase().includes(noticeSearch.toLowerCase())),
    [noticeSearch]
  );

  const renderDashboard = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Parent Dashboard</h2>
        
        {/* Child Profile Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="h-24 w-24 rounded-full border-4 border-white/30 overflow-hidden bg-slate-200 shadow-xl relative z-10">
                <img src={child.avatar} alt="Child" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 text-center md:text-left">
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-1">Student Profile</p>
                <h3 className="text-2xl font-black">{child.name}</h3>
                <p className="text-indigo-100 text-sm mt-1 font-medium">B.Tech CSE • Semester 5 • Roll No: {child.id.toUpperCase()}</p>
                <div className="flex gap-2 mt-4 justify-center md:justify-start">
                    <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">Batch 2021-25</Badge>
                    <Badge className="bg-green-500/20 text-green-300 border-none backdrop-blur-sm">Active</Badge>
                </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Attendance Widget */}
            <Card title="Attendance Overview" className="group">
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative h-40 w-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-100" />
                            <circle 
                                cx="80" 
                                cy="80" 
                                r="70" 
                                stroke="currentColor" 
                                strokeWidth="14" 
                                fill="transparent" 
                                strokeDasharray={440} 
                                strokeDashoffset={440 - (440 * attendancePercentage) / 100} 
                                className={`${attendancePercentage >= 75 ? "text-indigo-600" : "text-amber-500"} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-900">{attendancePercentage}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <p className={`mt-6 text-sm font-black uppercase tracking-wider ${attendancePercentage >= 75 ? "text-indigo-600" : "text-amber-600"}`}>
                        {attendancePercentage >= 75 ? "Status: Excellent" : "Status: Action Required"}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Classes: {attendedClasses} Attended of {totalClasses}</p>
                </div>
            </Card>

            {/* Recent Notices */}
            <Card title="Quick Announcements" className="lg:col-span-2">
                <div className="space-y-4 mt-2">
                    {MOCK_NOTICES.slice(0, 3).map(notice => (
                        <div key={notice.id} className="relative pl-6 border-l-2 border-slate-100 hover:border-indigo-500 transition-colors pb-4 last:border-0 last:pb-0">
                            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{notice.date}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-1 leading-relaxed">{notice.content}</p>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-4 border-dashed font-bold text-indigo-600 hover:bg-indigo-50" onClick={() => setActiveTab('notices')}>
                        <Bell className="w-3 h-3 mr-2"/> View Notice Board
                    </Button>
                </div>
            </Card>
        </div>

        {/* Upcoming Events */}
        <div className="flex items-center justify-between mt-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center">
                <span className="w-6 h-1 bg-indigo-600 rounded-full mr-3"></span>
                Campus Life
            </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {MOCK_COLLEGE_EVENTS.slice(0, 3).map(event => (
                 <Card key={event.id} className="flex gap-4 p-4 hover:shadow-lg transition-all cursor-pointer group">
                     <div className="flex flex-col items-center justify-center bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all p-3 rounded-xl min-w-[60px] shadow-inner">
                         <span className="text-[10px] font-bold uppercase tracking-widest mb-0.5 opacity-70">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                         <span className="text-xl font-black">{new Date(event.date).getDate()}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                         <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{event.description}</p>
                         <div className="mt-2 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                             <Calendar className="w-3 h-3 mr-1 text-indigo-400"/> {event.time}
                         </div>
                     </div>
                 </Card>
             ))}
        </div>
    </div>
  );

  const renderNotices = () => (
      <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h2 className="text-2xl font-bold text-slate-900">Notice Board</h2>
                  <p className="text-sm text-slate-500">Official circulars and academic updates.</p>
              </div>
              <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                      type="text" 
                      placeholder="Search circulars..." 
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                      value={noticeSearch}
                      onChange={(e) => setNoticeSearch(e.target.value)}
                  />
              </div>
          </div>
          <div className="grid gap-4">
              {filteredNotices.map(notice => (
                  <Card key={notice.id} className="hover:border-indigo-300 transition-colors relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                          <Bell className="w-24 h-24" />
                      </div>
                      <div className="flex justify-between items-start mb-3 relative z-10">
                          <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-3">{notice.type}</Badge>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notice.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{notice.content}</p>
                      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Released by: <span className="text-slate-600">{notice.sender}</span></p>
                          <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center">Download PDF <ChevronRight className="w-3 h-3 ml-1"/></button>
                      </div>
                  </Card>
              ))}
              {filteredNotices.length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Bell className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                      <p className="text-slate-500 font-medium">No circulars matching your search.</p>
                  </div>
              )}
          </div>
      </div>
  );

  const renderFees = () => (
      <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h2 className="text-2xl font-bold text-slate-900">Fee Summary</h2>
                  <p className="text-sm text-slate-500">Track and pay your child's academic fees.</p>
              </div>
              <Button className="shadow-lg shadow-indigo-200"><CreditCard className="w-4 h-4 mr-2"/> Online Payment</Button>
          </div>

          <Card className="bg-green-50 border-green-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 text-green-500/10"><CheckCircle2 className="w-24 h-24" /></div>
              <div className="flex items-center gap-4 relative z-10 p-2">
                  <div className="p-4 bg-green-100 text-green-700 rounded-2xl shadow-inner"><CheckCircle2 className="w-8 h-8"/></div>
                  <div>
                      <h3 className="text-xl font-black text-green-800 uppercase tracking-tight">No Outstanding Dues</h3>
                      <p className="text-green-700 text-sm font-medium">All fees for Semester 5 have been successfully settled.</p>
                  </div>
              </div>
          </Card>
          
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center mt-8">
             <span className="w-6 h-1 bg-indigo-600 rounded-full mr-3"></span>
             Transaction Logs
          </h3>
          <Card className="overflow-hidden p-0 border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr><th className="px-6 py-4">Transaction Details</th><th className="px-6 py-4 text-right">Amount</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-center">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">Semester 1 Tuition Fee</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">₹2,500.00</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">Aug 10, 2023</td>
                            <td className="px-6 py-4 text-center"><Badge variant="success" className="px-3">PAID</Badge></td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">Digital Library & Lab Maintenance</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">₹300.00</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">Aug 28, 2023</td>
                            <td className="px-6 py-4 text-center"><Badge variant="success" className="px-3">PAID</Badge></td>
                        </tr>
                    </tbody>
                </table>
              </div>
          </Card>
          <div className="flex justify-center">
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 uppercase tracking-widest">
                  <FileText className="w-4 h-4"/> Request Statement (FY 2023-24)
              </button>
          </div>
      </div>
  );

  const renderProfile = () => (
      <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Guardian Profile</h2>
          <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 text-center p-8 bg-white shadow-sm border-slate-200">
                  <div className="relative inline-block mb-6">
                      <div className="h-32 w-32 rounded-full border-4 border-slate-50 overflow-hidden bg-slate-100 shadow-xl mx-auto">
                          <img src={user.avatar} className="w-full h-full object-cover" alt="Profile"/>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-green-500 h-6 w-6 rounded-full border-4 border-white shadow-sm"></div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{user.name}</h3>
                  <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mt-1">Authorized Guardian</p>
                  <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-3">
                      <Button variant="outline" className="w-full font-bold">Update Preferences</Button>
                      <Button variant="secondary" className="w-full font-bold text-red-500 border-red-100 hover:bg-red-50">Reset Password</Button>
                  </div>
              </Card>

              <Card className="lg:col-span-2 shadow-sm border-slate-200">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                      <UserIcon className="w-4 h-4 mr-2 text-indigo-500"/>
                      Account Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Email Address</label>
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                              <span className="text-indigo-500"><Search className="w-3.5 h-3.5"/></span> {user.email}
                          </p>
                      </div>
                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Contact Number</label>
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                              <span className="text-indigo-500"><CreditCard className="w-3.5 h-3.5"/></span> {user.phone || '+1 (555) 987-0000'}
                          </p>
                      </div>
                      <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Residential Address</label>
                          <p className="font-bold text-slate-800 flex items-start gap-2">
                              <span className="text-indigo-500 mt-0.5"><LayoutDashboard className="w-3.5 h-3.5"/></span> 
                              {user.address || '456 Suburb Lane, Valley City, CA 90210'}
                          </p>
                      </div>
                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Relationship</label>
                          <Badge variant="neutral" className="bg-slate-100 text-slate-600 border-none font-bold uppercase px-3">Parent / Legal Guardian</Badge>
                      </div>
                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Login Security</label>
                          <Badge variant="success" className="bg-green-50 text-green-700 border-green-100 font-bold uppercase px-3">2FA Enabled</Badge>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
  );

  return (
    <Layout user={user} onLogout={onLogout} navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
        <div key={activeTab} className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out fill-mode-forwards">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'notices' && renderNotices()}
            {activeTab === 'fees' && renderFees()}
            {activeTab === 'profile' && renderProfile()}
        </div>
    </Layout>
  );
};

export default ParentView;
