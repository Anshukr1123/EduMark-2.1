import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Subject, AttendanceRecord, Assignment, FeeRecord, CollegeEvent, Notice } from '../types';
import { MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_FEES, MOCK_NOTICES, MOCK_COLLEGE_EVENTS, MOCK_TICKETS, MOCK_SERVICE_REQUESTS, MOCK_JOBS, MOCK_MESSAGES, MOCK_INTERNAL_ASSESSMENTS } from '../constants';
import Layout, { NavItem } from '../components/Layout';
import { appwrite, databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, Query, ID } from '../appwriteClient';
import { Home as HomeIcon, CalendarCheck, Clock, FileText, Award, Briefcase, Bus, Calendar, CreditCard, Bell, MessageSquare, HelpCircle, User as UserIcon, Laptop, Library, FilePlus, BadgeCheck, Building2 } from 'lucide-react';
import { Toast, ToastProps } from '../components/UIComponents';

// Sub-components
import StudentDashboard from './student/StudentDashboard';
import StudentAttendance from './student/StudentAttendance';
import StudentAcademics from './student/StudentAcademics';
import StudentFinances from './student/StudentFinances';
import StudentSocial from './student/StudentSocial';
import StudentProfile from './student/StudentProfile';
import StudentLibrary from './student/StudentLibrary';
import StudentIdCard from './student/StudentIdCard';
import StudentOnlineExams from './student/academics/StudentOnlineExams';
import StudentCollegeInfo from './student/StudentCollegeInfo';
import StudentResults from './student/academics/StudentResults';

interface StudentViewProps {
  user: User;
  onLogout: () => void;
}

const StudentView: React.FC<StudentViewProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  // Data State
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [fees, setFees] = useState<FeeRecord[]>(MOCK_FEES);
  const [events, setEvents] = useState<CollegeEvent[]>(MOCK_COLLEGE_EVENTS);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Helper to add toast
  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleMarkAttendance = useCallback(async (subjectName: string) => {
    const newRecord: AttendanceRecord = { id: Math.random().toString(36).substr(2, 9), studentId: user.id, studentName: user.name, subjectName: subjectName, status: 'PRESENT', date: new Date().toISOString() };
    setHistory(prev => [newRecord, ...prev]);
    setSubjects(prev => prev.map(s => s.name === subjectName ? { ...s, totalClasses: s.totalClasses + 1, attendedClasses: s.attendedClasses + 1 } : s));
    setLastUpdate(new Date().toLocaleTimeString());
    addToast("Attendance Marked", `Successfully registered for ${subjectName}`, "success");
  }, [user.id, user.name, addToast]);

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id);
  }, []);

  const navItems: NavItem[] = useMemo(() => [
    { id: 'dashboard', label: 'Home', icon: <HomeIcon className="w-5 h-5"/>, category: 'MAIN' },
    { id: 'id_card', label: 'ID Card', icon: <BadgeCheck className="w-5 h-5"/>, category: 'MAIN' },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'timetable', label: 'Timetable', icon: <Clock className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'online_exam', label: 'Online Exam', icon: <Laptop className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'library', label: 'Library', icon: <Library className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'results', label: 'Exams & Results', icon: <Award className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'fees', label: 'Fees', icon: <CreditCard className="w-5 h-5"/>, category: 'FINANCE' },
    { id: 'placements', label: 'Placements', icon: <Briefcase className="w-5 h-5"/>, category: 'FINANCE' },
    { id: 'services', label: 'Services', icon: <Bus className="w-5 h-5"/>, category: 'FINANCE' },
    { id: 'events', label: 'Events', icon: <Calendar className="w-5 h-5"/>, category: 'SOCIAL' },
    { id: 'notices', label: 'Notices', icon: <Bell className="w-5 h-5"/>, category: 'SOCIAL' },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5"/>, category: 'SOCIAL' },
    { id: 'support', label: 'Helpdesk', icon: <HelpCircle className="w-5 h-5"/>, category: 'SOCIAL' },
    { id: 'college_info', label: 'College Info', icon: <Building2 className="w-5 h-5"/>, category: 'SOCIAL' },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5"/>, category: 'SOCIAL' },
  ], []);

  const averageAttendance = useMemo(() => {
    const total = subjects.reduce((a, b) => a + b.totalClasses, 0);
    const attended = subjects.reduce((a, b) => a + b.attendedClasses, 0);
    return total > 0 ? Math.round((attended / total) * 100) : 0;
  }, [subjects]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <StudentDashboard user={user} subjects={subjects} assignments={assignments} fees={fees} averageAttendance={averageAttendance} isOnline={true} notices={MOCK_NOTICES} lastUpdate={lastUpdate} onNavigate={handleTabChange} navItems={navItems} />;
      case 'attendance': return <StudentAttendance history={history} subjects={subjects} lastUpdate={lastUpdate} onMarkAttendance={handleMarkAttendance} />;
      case 'id_card': return <StudentIdCard user={user} />;
      case 'timetable':
      case 'assignments':
      case 'materials':
      case 'course_registration': return <StudentAcademics activeTab={activeTab} user={user} assignments={assignments} setAssignments={setAssignments} isOnline={true} subjects={subjects} />;
      case 'online_exam': return <StudentOnlineExams />;
      case 'library': return <StudentLibrary />;
      case 'results': return <StudentResults />;
      case 'fees':
      case 'placements':
      case 'services': return <StudentFinances activeTab={activeTab} user={user} fees={fees} setFees={setFees} jobs={MOCK_JOBS} serviceRequests={MOCK_SERVICE_REQUESTS} />;
      case 'events':
      case 'calendar':
      case 'notices':
      case 'messages':
      case 'support': return <StudentSocial activeTab={activeTab} user={user} events={events} notices={MOCK_NOTICES} messages={MOCK_MESSAGES} tickets={MOCK_TICKETS} history={history} onRegister={() => {}} />;
      case 'college_info': return <StudentCollegeInfo />;
      case 'profile': return <StudentProfile user={user} onShowToast={addToast} />;
      default: return null;
    }
  };

  return (
    <Layout user={user} onLogout={onLogout} navItems={navItems} activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
         {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={removeToast} />)}
      </div>

      {activeTab === 'dashboard' ? (
        <div className="flex-1 overflow-hidden">
           {renderActiveView()}
        </div>
      ) : (
        <section className="viewport-section p-4 sm:p-8">
          <div className="w-full max-w-[1400px] mx-auto pb-12">
            {renderActiveView()}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default StudentView;