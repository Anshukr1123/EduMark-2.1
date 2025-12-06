
import React, { useState, useEffect } from 'react';
import { User, Subject, AttendanceRecord, Assignment, FeeRecord, CollegeEvent, Notice } from '../types';
import { MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_FEES, MOCK_NOTICES, MOCK_COLLEGE_EVENTS, MOCK_TICKETS, MOCK_SERVICE_REQUESTS, MOCK_JOBS, MOCK_MESSAGES, MOCK_INTERNAL_ASSESSMENTS } from '../constants';
import Layout, { NavItem } from '../components/Layout';
import { appwrite, databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, Query } from '../appwriteClient';
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
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // INITIAL DATA FETCH
  useEffect(() => {
    if (!isAppwriteConfigured) {
        // Fallback to mock history if offline
        setHistory([
            { id: '1', studentId: user.id, studentName: user.name, subjectName: 'Data Structures', status: 'PRESENT', date: new Date().toISOString() }, 
            { id: '2', studentId: user.id, studentName: user.name, subjectName: 'Advanced Calculus', status: 'PRESENT', date: new Date(Date.now() - 86400000).toISOString() }, 
        ]);
        return;
    }

    const fetchData = async () => {
        try {
            // 1. Fetch Attendance
            const attendanceResponse = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ATTENDANCE,
                [Query.equal('student_id', user.id), Query.orderDesc('date')]
            );
            
            if (attendanceResponse.documents) {
                const mappedHistory: AttendanceRecord[] = attendanceResponse.documents.map(r => ({
                    id: r.$id,
                    studentId: r.student_id,
                    studentName: user.name,
                    subjectName: r.subject_name,
                    status: r.status,
                    date: r.date
                }));
                setHistory(mappedHistory);
                
                // Recalculate Subject Stats from real data
                const subjectStats = new Map<string, { total: number, attended: number }>();
                mappedHistory.forEach(r => {
                    const sub = r.subjectName || 'General';
                    const curr = subjectStats.get(sub) || { total: 0, attended: 0 };
                    curr.total++;
                    if (r.status === 'PRESENT') curr.attended++;
                    subjectStats.set(sub, curr);
                });
                
                // Update subjects state with calculated values
                setSubjects(prev => prev.map(s => {
                    const stat = subjectStats.get(s.name);
                    return stat ? { ...s, totalClasses: stat.total, attendedClasses: stat.attended } : s;
                }));
            }

            // 2. Fetch Assignments
            const assignResponse = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ASSIGNMENTS,
                [Query.equal('student_id', user.id)]
            );
            
            if (assignResponse.documents) {
                const mappedAssignments: Assignment[] = assignResponse.documents.map(a => ({
                    id: a.$id,
                    subject: a.subject,
                    title: a.title,
                    description: a.description,
                    dueDate: a.due_date,
                    status: a.status,
                    marks: a.marks,
                    maxMarks: a.max_marks,
                    feedback: a.feedback,
                    submittedDate: a.submitted_date,
                    fileUrl: a.file_url
                }));
                if (mappedAssignments.length > 0) setAssignments(mappedAssignments);
            }

            // 3. Fetch Fees
            const feeResponse = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FEES,
                [Query.equal('student_id', user.id)]
            );
            
            if (feeResponse.documents) {
                const mappedFees: FeeRecord[] = feeResponse.documents.map(f => ({
                    id: f.$id,
                    title: f.title,
                    amount: f.amount,
                    dueDate: f.due_date,
                    status: f.status,
                    datePaid: f.date_paid
                }));
                if (mappedFees.length > 0) setFees(mappedFees);
            }

            // 4. Fetch Notices (Global)
            const noticeResponse = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.NOTICES,
                [Query.limit(10), Query.orderDesc('date')]
            );
            
            if (noticeResponse.documents.length > 0) {
                setNotices(noticeResponse.documents.map(n => ({
                    id: n.$id,
                    title: n.title,
                    content: n.content,
                    date: n.date,
                    type: n.type,
                    sender: n.sender
                })) as Notice[]);
            }

        } catch (error) {
            console.error("Error fetching student data:", error);
            addToast("Sync Error", "Could not load latest data.", "error");
        }
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); addToast("Back Online", "Connection restored.", "success"); };
    const handleOffline = () => { setIsOnline(false); addToast("You are Offline", "Check your internet connection.", "warning"); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Notification System for Deadlines & Updates
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
      
      // 1. Check Assignments
      assignments.forEach(assign => {
        if (assign.status === 'PENDING' || assign.status === 'OVERDUE') {
          const dueDate = new Date(assign.dueDate);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

          if (assign.status === 'OVERDUE' || diffDays < 0) {
             setTimeout(() => addToast('Assignment Overdue', `"${assign.title}" was due on ${assign.dueDate}.`, 'error'), 1000);
          } else if (diffDays >= 0 && diffDays <= 3) {
             setTimeout(() => addToast('Assignment Due Soon', `"${assign.title}" is due in ${diffDays === 0 ? 'today' : diffDays + ' days'}.`, 'warning'), 1500);
          }
        }
      });

      // 2. Check Fees
      fees.forEach(fee => {
        if (fee.status === 'PENDING' || fee.status === 'OVERDUE') {
           const dueDate = new Date(fee.dueDate);
           const diffTime = dueDate.getTime() - today.getTime();
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

           if (fee.status === 'OVERDUE') {
              setTimeout(() => addToast('Fee Payment Overdue', `Please clear your pending dues for "${fee.title}".`, 'error'), 2000);
           } else if (diffDays >= 0 && diffDays <= 7) {
              setTimeout(() => addToast('Upcoming Fee Payment', `"${fee.title}" is due on ${fee.dueDate}.`, 'info'), 2500);
           }
        }
      });
    };

    const timer = setTimeout(checkDeadlines, 1000);
    return () => clearTimeout(timer);
  }, [assignments, fees]); 

  // Real-time Subscription (Appwrite)
  useEffect(() => {
    if (!isAppwriteConfigured) return;

    const unsubscribe = appwrite.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTIONS.ATTENDANCE}.documents`, 
        (response: any) => {
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                const newRecord = response.payload;
                
                // Only process if it belongs to this student
                if (newRecord.student_id !== user.id) return;

                // 1. Update History List
                setHistory((prev) => [{ 
                    id: newRecord.$id, 
                    studentId: newRecord.student_id, 
                    studentName: user.name, 
                    subjectName: newRecord.subject_name || 'General', 
                    status: newRecord.status, 
                    date: newRecord.date || new Date().toISOString() 
                }, ...prev]);

                // 2. Update Subject Stats (Total/Attended counts)
                if (newRecord.subject_name) {
                    setSubjects(prevSubjects => prevSubjects.map(sub => {
                        if (sub.name === newRecord.subject_name) {
                            return {
                                ...sub,
                                totalClasses: sub.totalClasses + 1,
                                attendedClasses: newRecord.status === 'PRESENT' ? sub.attendedClasses + 1 : sub.attendedClasses
                            };
                        }
                        return sub;
                    }));
                }

                setLastUpdate(new Date().toLocaleTimeString());
                addToast("Attendance Updated", `Marked ${newRecord.status} for ${newRecord.subject_name || 'Class'}`, newRecord.status === 'PRESENT' ? 'success' : 'error');
            }
        }
    );

    return () => { unsubscribe(); };
  }, [user.id, user.name]);

  // Weighted Average Calculation
  const totalClassesScheduled = subjects.reduce((acc, sub) => acc + sub.totalClasses, 0);
  const totalClassesAttended = subjects.reduce((acc, sub) => acc + sub.attendedClasses, 0);
  const averageAttendance = totalClassesScheduled > 0 
    ? Math.round((totalClassesAttended / totalClassesScheduled) * 100) 
    : 0;

  const handleTabChange = (id: string) => {
    if (activeTab === id) return;
    setActiveTab(id);
    setTabHistory(prev => [...prev, id]);
  };

  const handleBack = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop();
      setTabHistory(newHistory);
      setActiveTab(newHistory[newHistory.length - 1]);
    }
  };

  const handleEventRegister = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, registrationStatus: 'REGISTERED' } : e));
    addToast("Registration Successful", "You have registered for the event.", "success");
  };

  // Explicit Toast Handler
  const handleShowToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    addToast(title, message, type);
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5"/> },
    { id: 'id_card', label: 'ID Card', icon: <BadgeCheck className="w-5 h-5"/> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-5 h-5"/> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5"/> },
    { id: 'timetable', label: 'Timetable', icon: <Clock className="w-5 h-5"/> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="w-5 h-5"/> },
    { id: 'online_exam', label: 'Online Exam', icon: <Laptop className="w-5 h-5"/> },
    { id: 'materials', label: 'Materials', icon: <Folder className="w-5 h-5"/> },
    { id: 'course_registration', label: 'Course Reg.', icon: <FilePlus className="w-5 h-5"/> },
    { id: 'library', label: 'Library', icon: <Library className="w-5 h-5"/> },
    { id: 'results', label: 'Exams & Results', icon: <Award className="w-5 h-5"/> },
    { id: 'certificates', label: 'Certificates', icon: <ScrollText className="w-5 h-5"/> },
    { id: 'fees', label: 'Fees', icon: <CreditCard className="w-5 h-5"/> },
    { id: 'placements', label: 'Placements', icon: <Briefcase className="w-5 h-5"/> },
    { id: 'services', label: 'Services', icon: <Bus className="w-5 h-5"/> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-5 h-5"/> },
    { id: 'notices', label: 'Notices', icon: <Bell className="w-5 h-5"/> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5"/> },
    { id: 'support', label: 'Helpdesk', icon: <HelpCircle className="w-5 h-5"/> },
    { id: 'college_info', label: 'College Info', icon: <Building2 className="w-5 h-5"/> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5"/> },
  ];

  return (
    <Layout user={user} onLogout={onLogout} navItems={navItems} activeTab={activeTab} onTabChange={handleTabChange} onBack={handleBack} showBackButton={tabHistory.length > 1}>
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
         {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
         ))}
      </div>

      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          {activeTab === 'dashboard' && <StudentDashboard user={user} subjects={subjects} assignments={assignments} fees={fees} averageAttendance={averageAttendance} isOnline={isOnline} notices={notices} lastUpdate={lastUpdate} onNavigate={handleTabChange} navItems={navItems} />}
          {activeTab === 'attendance' && <StudentAttendance history={history} subjects={subjects} lastUpdate={lastUpdate} />}
          {activeTab === 'id_card' && <StudentIdCard user={user} />}
          
          {(['timetable', 'assignments', 'materials', 'course_registration'].includes(activeTab)) && (
            <StudentAcademics activeTab={activeTab} user={user} assignments={assignments} setAssignments={setAssignments} isOnline={isOnline} subjects={subjects} />
          )}

          {activeTab === 'online_exam' && <StudentOnlineExams />}
          {activeTab === 'library' && <StudentLibrary />}
          
          {activeTab === 'certificates' && <StudentCertificates />}
          {activeTab === 'results' && <StudentResults />}
          
          {(['fees', 'placements', 'services'].includes(activeTab)) && (
            <StudentFinances activeTab={activeTab} user={user} fees={fees} setFees={setFees} jobs={MOCK_JOBS} serviceRequests={MOCK_SERVICE_REQUESTS} />
          )}

          {(['events', 'calendar', 'notices', 'messages', 'support'].includes(activeTab)) && (
            <StudentSocial activeTab={activeTab} user={user} events={events} notices={notices} messages={MOCK_MESSAGES} tickets={MOCK_TICKETS} history={history} onRegister={handleEventRegister} />
          )}

          {activeTab === 'college_info' && <StudentCollegeInfo />}
          {activeTab === 'profile' && <StudentProfile user={user} onShowToast={handleShowToast} />}
      </div>
    </Layout>
  );
};

export default StudentView;
