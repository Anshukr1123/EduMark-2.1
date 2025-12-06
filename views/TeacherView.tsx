
import React, { useState } from 'react';
import { User } from '../types';
import Layout, { NavItem } from '../components/Layout';
import { LayoutDashboard, CalendarCheck, ClipboardList, FileCheck, FileSpreadsheet, Folder, Megaphone, Users, User as UserIcon, BookOpen } from 'lucide-react';

// Sub-components
import TeacherDashboard from './teacher/TeacherDashboard';
import TeacherAttendance from './teacher/TeacherAttendance';
import TeacherAcademics from './teacher/TeacherAcademics';
import TeacherCommunication from './teacher/TeacherCommunication';

interface TeacherViewProps {
  user: User;
  onLogout: () => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5"/> },
    { id: 'classes', label: 'My Classes', icon: <ClipboardList className="w-5 h-5"/> },
    { id: 'attendance_mgmt', label: 'Attendance Control', icon: <CalendarCheck className="w-5 h-5"/> },
    { id: 'assignments', label: 'Assignments', icon: <FileCheck className="w-5 h-5"/> },
    { id: 'internal_exams', label: 'Internal Exams', icon: <BookOpen className="w-5 h-5"/> },
    { id: 'exams', label: 'Exams & Duties', icon: <FileSpreadsheet className="w-5 h-5"/> },
    { id: 'materials', label: 'Course Materials', icon: <Folder className="w-5 h-5"/> },
    { id: 'communication', label: 'Announcements', icon: <Megaphone className="w-5 h-5"/> },
    { id: 'students', label: 'Students', icon: <Users className="w-5 h-5"/> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5"/> },
  ];

  return (
    <Layout user={user} onLogout={onLogout} navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
      {(activeTab === 'dashboard' || activeTab === 'classes') && <TeacherDashboard user={user} activeTab={activeTab} />}
      {activeTab === 'attendance_mgmt' && <TeacherAttendance user={user} />}
      {['assignments', 'exams', 'materials', 'internal_exams'].includes(activeTab) && <TeacherAcademics user={user} activeTab={activeTab} />}
      {['communication', 'students', 'profile'].includes(activeTab) && <TeacherCommunication user={user} activeTab={activeTab} />}
    </Layout>
  );
};

export default TeacherView;
