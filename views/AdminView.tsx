
import React, { useState } from 'react';
import { User } from '../types';
import Layout, { NavItem } from '../components/Layout';
import { LayoutDashboard, BookOpen, Calendar, FileSpreadsheet, Users, CheckSquare, CreditCard, Globe, Settings, FileText } from 'lucide-react';

import AdminDashboard from './admin/AdminDashboard';
import AdminAcademics from './admin/AdminAcademics';
import AdminUsers from './admin/AdminUsers';
import AdminFinance from './admin/AdminFinance';
import AdminSystem from './admin/AdminSystem';

interface AdminViewProps {
  user: User;
  onLogout: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5"/>, category: 'MAIN' },
    { id: 'academics', label: 'Academics', icon: <BookOpen className="w-5 h-5"/>, category: 'ADMIN' },
    { id: 'timetable', label: 'Timetable', icon: <Calendar className="w-5 h-5"/>, category: 'ADMIN' },
    { id: 'exams', label: 'Exams & Results', icon: <FileSpreadsheet className="w-5 h-5"/>, category: 'ADMIN' },
    { id: 'users', label: 'User Mgmt', icon: <Users className="w-5 h-5"/>, category: 'SYSTEM' },
    { id: 'approvals', label: 'Approvals', icon: <CheckSquare className="w-5 h-5"/>, category: 'SYSTEM' },
    { id: 'fees', label: 'Fees & Finance', icon: <CreditCard className="w-5 h-5"/>, category: 'SYSTEM' },
    { id: 'cms', label: 'Website CMS', icon: <Globe className="w-5 h-5"/>, category: 'SYSTEM' },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5"/>, category: 'SYSTEM' },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5"/>, category: 'SYSTEM' },
  ];

  return (
    <Layout user={user} onLogout={onLogout} navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
      <div key={activeTab} className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
        {activeTab === 'overview' && <AdminDashboard />}
        {['academics', 'timetable', 'exams'].includes(activeTab) && <AdminAcademics activeTab={activeTab} />}
        {['users', 'approvals'].includes(activeTab) && <AdminUsers activeTab={activeTab} />}
        {['fees', 'reports'].includes(activeTab) && <AdminFinance activeTab={activeTab} />}
        {['cms', 'settings'].includes(activeTab) && <AdminSystem activeTab={activeTab} />}
      </div>
    </Layout>
  );
};

export default AdminView;
