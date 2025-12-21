
import React, { useState, useCallback } from 'react';
import { User } from '../types';
import Layout, { NavItem } from '../components/Layout';
import { LayoutDashboard, BookOpen, Calendar, FileSpreadsheet, Users, CheckSquare, CreditCard, Globe, Settings, FileText } from 'lucide-react';
import { Toast, ToastProps } from '../components/UIComponents';

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
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleShowToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    addToast(title, message, type);
  }, [addToast]);

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
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
         {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={removeToast} />)}
      </div>

      <div key={activeTab} className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
        {activeTab === 'overview' && <AdminDashboard />}
        {['academics', 'timetable', 'exams'].includes(activeTab) && <AdminAcademics activeTab={activeTab} onShowToast={handleShowToast} />}
        {['users', 'approvals'].includes(activeTab) && <AdminUsers activeTab={activeTab} onShowToast={handleShowToast} />}
        {['fees', 'reports'].includes(activeTab) && <AdminFinance activeTab={activeTab} onShowToast={handleShowToast} />}
        {['cms', 'settings'].includes(activeTab) && <AdminSystem activeTab={activeTab} onShowToast={handleShowToast} />}
      </div>
    </Layout>
  );
};

export default AdminView;
