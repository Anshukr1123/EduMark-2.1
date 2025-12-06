
import React, { useState } from 'react';
import { User, AttendanceRecord } from '../types';
import Layout, { NavItem } from '../components/Layout';
import { LayoutDashboard, Bell, CreditCard, User as UserIcon, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, Badge, Button } from '../components/UIComponents';
import { MOCK_USERS, MOCK_NOTICES, MOCK_SUBJECTS, MOCK_COLLEGE_EVENTS } from '../constants';

interface ParentViewProps {
  user: User;
  onLogout: () => void;
}

const ParentView: React.FC<ParentViewProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Navigation Items for Parent
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5"/> },
    { id: 'notices', label: 'Notices', icon: <Bell className="w-5 h-5"/> },
    { id: 'fees', label: 'Fee Status', icon: <CreditCard className="w-5 h-5"/> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5"/> },
  ];

  // Mock Child Data (Linked to Alice for demo)
  const child = MOCK_USERS.find(u => u.role === 'STUDENT') || MOCK_USERS[0];
  const totalClasses = MOCK_SUBJECTS.reduce((acc, sub) => acc + sub.totalClasses, 0);
  const attendedClasses = MOCK_SUBJECTS.reduce((acc, sub) => acc + sub.attendedClasses, 0);
  const attendancePercentage = Math.round((attendedClasses / totalClasses) * 100);

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-900">Parent Dashboard</h2>
        
        {/* Child Profile Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
            <div className="h-20 w-20 rounded-full border-4 border-white/30 overflow-hidden bg-slate-200">
                <img src={child.avatar} alt="Child" className="w-full h-full object-cover" />
            </div>
            <div>
                <p className="text-indigo-200 text-sm font-bold uppercase tracking-wide">Student Profile</p>
                <h3 className="text-2xl font-bold">{child.name}</h3>
                <p className="text-indigo-100 text-sm mt-1">Class: B.Tech CS • Sem 5 • Roll No: {child.id.toUpperCase()}</p>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Attendance Widget */}
            <Card title="Attendance Overview">
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * attendancePercentage) / 100} className={attendancePercentage >= 75 ? "text-green-500" : "text-amber-500"} />
                        </svg>
                        <span className="absolute text-2xl font-bold text-slate-800">{attendancePercentage}%</span>
                    </div>
                    <p className={`mt-4 text-sm font-bold ${attendancePercentage >= 75 ? "text-green-600" : "text-amber-600"}`}>
                        {attendancePercentage >= 75 ? "Excellent Attendance" : "Needs Improvement"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Total Classes: {totalClasses} | Attended: {attendedClasses}</p>
                </div>
            </Card>

            {/* Recent Notices */}
            <Card title="Recent Announcements" className="lg:col-span-2">
                <div className="space-y-4 mt-2">
                    {MOCK_NOTICES.slice(0, 3).map(notice => (
                        <div key={notice.id} className="border-l-4 border-indigo-500 pl-4 py-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900">{notice.title}</h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{notice.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-1 mt-1">{notice.content}</p>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('notices')}>View All Notices</Button>
                </div>
            </Card>
        </div>

        {/* Upcoming Events */}
        <h3 className="text-xl font-bold text-slate-900 mt-4">Upcoming College Events</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {MOCK_COLLEGE_EVENTS.slice(0, 3).map(event => (
                 <Card key={event.id} className="flex gap-4">
                     <div className="flex flex-col items-center justify-center bg-indigo-50 p-3 rounded-lg min-w-[60px]">
                         <span className="text-xs font-bold text-indigo-500 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                         <span className="text-xl font-black text-indigo-700">{new Date(event.date).getDate()}</span>
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-900 text-sm">{event.title}</h4>
                         <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                         <div className="mt-2 flex items-center text-xs font-medium text-slate-600">
                             <Calendar className="w-3 h-3 mr-1"/> {event.time}
                         </div>
                     </div>
                 </Card>
             ))}
        </div>
    </div>
  );

  const renderNotices = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-slate-900">Circulars & Notices</h2>
          <div className="grid gap-4">
              {MOCK_NOTICES.map(notice => (
                  <Card key={notice.id} className="hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                          <Badge variant="neutral" className="bg-slate-100">{notice.type}</Badge>
                          <span className="text-xs text-slate-500">{notice.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{notice.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{notice.content}</p>
                      <p className="text-xs text-slate-400 mt-4 font-semibold uppercase">From: {notice.sender}</p>
                  </Card>
              ))}
          </div>
      </div>
  );

  const renderFees = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-slate-900">Fee Status</h2>
          <Card className="bg-green-50 border-green-200">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-700 rounded-full"><CheckCircle2 className="w-8 h-8"/></div>
                  <div>
                      <h3 className="text-lg font-bold text-green-800">No Outstanding Dues</h3>
                      <p className="text-green-700 text-sm">All fees for the current semester have been paid.</p>
                  </div>
              </div>
          </Card>
          
          <h3 className="font-bold text-slate-900 mt-4">Payment History</h3>
          <Card>
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                      <tr><th className="p-3">Description</th><th className="p-3">Amount</th><th className="p-3">Date</th><th className="p-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-3 font-medium">Semester 1 Tuition</td><td className="p-3">₹2500</td><td className="p-3">Aug 10, 2023</td><td className="p-3"><Badge variant="success">PAID</Badge></td></tr>
                      <tr><td className="p-3 font-medium">Lab Fee</td><td className="p-3">₹300</td><td className="p-3">Aug 28, 2023</td><td className="p-3"><Badge variant="success">PAID</Badge></td></tr>
                  </tbody>
              </table>
          </Card>
      </div>
  );

  const renderProfile = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
          <Card className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-slate-400"/>
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                      <p className="text-slate-500">{user.email}</p>
                  </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                      <p className="font-medium text-slate-900">{user.phone}</p>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
                      <p className="font-medium text-slate-900">{user.address}</p>
                  </div>
              </div>
          </Card>
      </div>
  );

  return (
    <Layout user={user} onLogout={onLogout} navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'notices' && renderNotices()}
        {activeTab === 'fees' && renderFees()}
        {activeTab === 'profile' && renderProfile()}
    </Layout>
  );
};

export default ParentView;
