
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Subject, AttendanceRecord, Assignment, FeeRecord, CollegeEvent, Notice } from '../types';
import { MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_FEES, MOCK_NOTICES, MOCK_COLLEGE_EVENTS, MOCK_TICKETS, MOCK_SERVICE_REQUESTS, MOCK_JOBS, MOCK_MESSAGES, MOCK_INTERNAL_ASSESSMENTS } from '../constants';
import Layout, { NavItem } from '../components/Layout';
import { appwrite, databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, Query, ID } from '../appwriteClient';
import { LayoutDashboard, CalendarDays, CalendarCheck, Clock, FileText, Folder, Award, Briefcase, Bus, Calendar, CreditCard, Bell, MessageSquare, HelpCircle, User as UserIcon, ScrollText, Laptop, Library, FilePlus, BadgeCheck, Building2 } from 'lucide-react';
import { Toast, ToastProps } from '../components/UIComponents';

// Sub-components
import StudentDashboard from './student/StudentDashboard';
import StudentAttendance from './student/StudentAttendance';
import StudentAcademics from './student/StudentAcademics';
import StudentFinances from './student/StudentFinances';
import StudentSocial from './student/StudentSocial';
import StudentProfile from './student/StudentProfile';
import StudentCertificates from './student/StudentCertificates';
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
  const [tabHistory, setTabHistory] = useState<string[]>(['dashboard']);
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  // Data State
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [fees, setFees] = useState<FeeRecord[]>(MOCK_FEES);
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [events, setEvents] = useState<CollegeEvent[]>(MOCK_COLLEGE_EVENTS);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Helper to add toast
  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // INITIAL DATA FETCH
  useEffect(() => {
    if (!isAppwriteConfigured) {
        setHistory([
            { id: '1', studentId: user.id, studentName: user.name, subjectName: 'Data Structures', status: 'PRESENT', date: new Date().toISOString() }, 
            { id: '2', studentId: user.id, studentName: user.name, subjectName: 'Advanced Calculus', status: 'PRESENT', date: new Date(Date.now() - 86400000).toISOString() }, 
        ]);
        return;
    }

    const fetchData = async () => {
        try {
            const attendanceResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ATTENDANCE, [Query.equal('student_id', user.id), Query.orderDesc('date')]);
            if (attendanceResponse.documents) {
                const mappedHistory: AttendanceRecord[] = attendanceResponse.documents.map(r => ({ id: r.$id, studentId: r.student_id, studentName: user.name, subjectName: r.subject_name, status: r.status, date: r.date }));
                setHistory(mappedHistory);
                const subjectStats = new Map<string, { total: number, attended: number }>();
                mappedHistory.forEach(r => {
                    const sub = r.subjectName || 'General';
                    const curr = subjectStats.get(sub) || { total: 0, attended: 0 };
                    curr.total++;
                    if (r.status === 'PRESENT') curr.attended++;
                    subjectStats.set(sub, curr);
                });
                setSubjects(prev => prev.map(s => {
                    const stat = subjectStats.get(s.name);
                    return stat ? { ...s, totalClasses: stat.total, attendedClasses: stat.attended } : s;
                }));
            }
        } catch (error) { console.error(error); }
    };
    fetchData();
  }, [user.id]);

  const handleMarkAttendance = useCallback(async (subjectName: string) => {
    const newRecord: AttendanceRecord = { id: Math.random().toString(36).substr(2, 9), studentId: user.id, studentName: user.name, subjectName: subjectName, status: 'PRESENT', date: new Date().toISOString() };
    setHistory(prev => [newRecord, ...prev]);
    setSubjects(prev => prev.map(s => s.name === subjectName ? { ...s, totalClasses: s.totalClasses + 1, attendedClasses: s.attendedClasses + 1 } : s));
    setLastUpdate(new Date().toLocaleTimeString());
    addToast("Attendance Marked", `Successfully registered for ${subjectName}`, "success");
  }, [user.id, user.name, addToast]);

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(prev => {
        if (prev === id) return prev;
        setTabHistory(history => [...history, id]);
        return id;
    });
  }, []);

  const handleBack = useCallback(() => {
    setTabHistory(prev => {
        if (prev.length <= 1) return prev;
        const newHistory = [...prev];
        newHistory.pop();
        const lastTab = newHistory[newHistory.length - 1];
        setActiveTab(lastTab);
        return newHistory;
    });
  }, []);

  const handleEventRegister = useCallback((id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, registrationStatus: 'REGISTERED' } : e));
    addToast("Registration Successful", "You have registered for the event.", "success");
  }, [addToast]);

  const handleShowToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    addToast(title, message, type);
  }, [addToast]);

  const navItems: NavItem[] = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5"/>, category: 'MAIN' },
    { id: 'id_card', label: 'ID Card', icon: <BadgeCheck className="w-5 h-5"/>, category: 'MAIN' },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'timetable', label: 'Timetable', icon: <Clock className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'online_exam', label: 'Online Exam', icon: <Laptop className="w-5 h-5"/>, category: 'ACADEMICS' },
    { id: 'course_registration', label: 'Course Reg.', icon: <FilePlus className="w-5 h-5"/>, category: 'ACADEMICS' },
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

  return (
    <Layout user={user} onLogout={onLogout} navItems={navItems} activeTab={activeTab} onTabChange={handleTabChange} onBack={handleBack} showBackButton={tabHistory.length > 1}>
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
         {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={removeToast} />)}
      </div>

      <div key={activeTab} className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
          {activeTab === 'dashboard' && <StudentDashboard user={user} subjects={subjects} assignments={assignments} fees={fees} averageAttendance={averageAttendance} isOnline={isOnline} notices={notices} lastUpdate={lastUpdate} onNavigate={handleTabChange} navItems={navItems} />}
          {activeTab === 'attendance' && <StudentAttendance history={history} subjects={subjects} lastUpdate={lastUpdate} onMarkAttendance={handleMarkAttendance} />}
          {activeTab === 'id_card' && <StudentIdCard user={user} />}
          {(['timetable', 'assignments', 'materials', 'course_registration'].includes(activeTab)) && <StudentAcademics activeTab={activeTab} user={user} assignments={assignments} setAssignments={setAssignments} isOnline={isOnline} subjects={subjects} />}
          {activeTab === 'online_exam' && <StudentOnlineExams />}
          {activeTab === 'library' && <StudentLibrary />}
          {activeTab === 'certificates' && <StudentCertificates />}
          {activeTab === 'results' && <StudentResults />}
          {(['fees', 'placements', 'services'].includes(activeTab)) && <StudentFinances activeTab={activeTab} user={user} fees={fees} setFees={setFees} jobs={MOCK_JOBS} serviceRequests={MOCK_SERVICE_REQUESTS} />}
          {(['events', 'calendar', 'notices', 'messages', 'support'].includes(activeTab)) && <StudentSocial activeTab={activeTab} user={user} events={events} notices={notices} messages={MOCK_MESSAGES} tickets={MOCK_TICKETS} history={history} onRegister={handleEventRegister} />}
          {activeTab === 'college_info' && <StudentCollegeInfo />}
          {activeTab === 'profile' && <StudentProfile user={user} onShowToast={handleShowToast} />}
      </div>
    </Layout>
  );
};

export default StudentView;
