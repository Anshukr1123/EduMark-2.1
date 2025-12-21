import { User, UserRole, Subject, ClassSession, Department, AttendanceRecord, Assignment, FeeRecord, ExamResult, InternalAssessment, TimeTableSlot, Notice, Message, CourseMaterial, CourseProgram, CollegeEvent, PlacementJob, SupportTicket, ServiceRequest, ExamDuty, Notification } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 's1',
    name: 'Alice Johnson',
    email: 'alice@edumark.edu',
    role: UserRole.STUDENT,
    departmentId: 'CS',
    avatar: 'https://picsum.photos/200/200?random=1',
    phone: '+1 (555) 123-4567',
    address: '123 College Ave, Dorm A, Room 101'
  },
  {
    id: 't1',
    name: 'Prof. Robert Smith',
    email: 'robert@edumark.edu',
    role: UserRole.TEACHER,
    departmentId: 'CS',
    avatar: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'a1',
    name: 'Dr. Emily Carter',
    email: 'admin@edumark.edu',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: 'p1',
    name: 'Sarah Johnson',
    email: 'parent@example.com',
    role: UserRole.PARENT,
    avatar: 'https://picsum.photos/200/200?random=4',
    phone: '+1 (555) 987-0000',
    address: '456 Suburb Lane, Valley City'
  }
];

export const MOCK_COLLEGE_INFO = {
  name: "EduMark Institute of Technology",
  founded: "1995",
  address: "42 Knowledge Park, Silicon Valley, CA",
  contact: "+1 (555) 987-6543",
  email: "info@edumark.edu",
  website: "www.edumark.edu",
  accreditation: "NAAC A++ Accredited",
  director: "Dr. Alan Grant",
  dean: "Prof. Ellie Sattler"
};

export const MOCK_SUBJECTS: Subject[] = [
  { id: 'math101', name: 'Advanced Calculus', code: 'MAT101', totalClasses: 45, attendedClasses: 40 },
  { id: 'cs202', name: 'Data Structures', code: 'CS202', totalClasses: 42, attendedClasses: 35 },
  { id: 'phy101', name: 'Quantum Physics', code: 'PHY101', totalClasses: 30, attendedClasses: 28 },
  { id: 'eng301', name: 'Technical Writing', code: 'ENG301', totalClasses: 20, attendedClasses: 20 },
];

export const MOCK_TEACHER_CLASSES: ClassSession[] = [
  { id: 'c1', subjectName: 'Data Structures (CS202)', time: '09:00 AM - 10:30 AM', room: 'Lab 3', status: 'COMPLETED', studentCount: 58 },
  { id: 'c2', subjectName: 'Algorithms (CS301)', time: '11:00 AM - 12:30 PM', room: 'Hall A', status: 'LIVE', studentCount: 62 },
  { id: 'c3', subjectName: 'Capstone Project', time: '02:00 PM - 04:00 PM', room: 'Conf 1', status: 'UPCOMING', studentCount: 15 },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'cs', name: 'Computer Science', headOfDept: 'Prof. Alan Turing', totalStudents: 450, attendanceRate: 88 },
  { id: 'ee', name: 'Electrical Eng.', headOfDept: 'Prof. Nikola Tesla', totalStudents: 320, attendanceRate: 82 },
  { id: 'me', name: 'Mechanical Eng.', headOfDept: 'Prof. Isaac Newton', totalStudents: 280, attendanceRate: 75 },
];

export const MOCK_ATTENDANCE_LIST: AttendanceRecord[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `att-${i}`,
  studentId: `stu-${i}`,
  studentName: `Student ${i + 1}`,
  subjectName: i % 3 === 0 ? 'Data Structures' : i % 3 === 1 ? 'Advanced Calculus' : 'Quantum Physics',
  status: Math.random() > 0.7 ? 'PRESENT' : Math.random() > 0.4 ? 'LATE' : 'ABSENT',
  date: new Date().toISOString().split('T')[0]
}));

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { 
    id: 'a1', 
    subject: 'Data Structures', 
    title: 'Binary Trees Implementation', 
    description: 'Implement a Binary Search Tree in C++ with insertion, deletion, and traversal methods.', 
    dueDate: '2023-10-15', 
    status: 'PENDING', 
    maxMarks: 20,
    complexity: 'HIGH'
  },
  { 
    id: 'a2', 
    subject: 'Advanced Calculus', 
    title: 'Problem Set 4: Integration', 
    description: 'Solve problems 1-15 from Chapter 4. Focus on improper integrals.', 
    dueDate: '2023-10-10', 
    status: 'SUBMITTED', 
    maxMarks: 10,
    complexity: 'MEDIUM',
    submittedDate: '2023-10-09',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  { 
    id: 'a3', 
    subject: 'Quantum Physics', 
    title: 'Lab Report: Wave Function', 
    description: 'Submit the detailed lab report for the wave function experiment.', 
    dueDate: '2023-09-30', 
    status: 'GRADED', 
    marks: '18', 
    maxMarks: 20,
    complexity: 'MEDIUM',
    feedback: 'Excellent detailed analysis.',
    submittedDate: '2023-09-28',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  { 
    id: 'a4', 
    subject: 'Technical Writing', 
    title: 'Research Proposal Draft', 
    description: 'Draft a 1000-word research proposal for your final year project.', 
    dueDate: '2023-09-25', 
    status: 'OVERDUE', 
    maxMarks: 50,
    complexity: 'HIGH'
  },
  { 
    id: 'a5', 
    subject: 'Data Structures', 
    title: 'Linked List Operations', 
    description: 'Implement a doubly linked list with all standard operations.', 
    dueDate: '2023-09-20', 
    status: 'GRADED', 
    marks: '19', 
    maxMarks: 20,
    complexity: 'LOW',
    feedback: 'Code is clean and efficient.',
    submittedDate: '2023-09-18',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
];

export const MOCK_FEES: FeeRecord[] = [
  { id: 'f1', title: 'Semester 1 Tuition', amount: 2500, dueDate: '2023-08-15', status: 'PAID', datePaid: '2023-08-10' },
  { id: 'f2', title: 'Lab Maintenance Fee', amount: 300, dueDate: '2023-09-01', status: 'PAID', datePaid: '2023-08-28' },
  { id: 'f3', title: 'Semester 2 Tuition', amount: 2500, dueDate: '2024-01-15', status: 'PENDING' },
  { id: 'f4', title: 'Library Fine', amount: 15, dueDate: '2023-10-01', status: 'OVERDUE' },
];

export const MOCK_RESULTS: ExamResult[] = [
  { id: 'r1', examName: 'Mid-Term Exam', subject: 'Data Structures', marksObtained: 42, totalMarks: 50, grade: 'A', date: '2023-09-15' },
  { id: 'r2', examName: 'Mid-Term Exam', subject: 'Advanced Calculus', marksObtained: 35, totalMarks: 50, grade: 'B', date: '2023-09-18' },
  { id: 'r3', examName: 'Quiz 1', subject: 'Quantum Physics', marksObtained: 18, totalMarks: 20, grade: 'A-', date: '2023-08-30' },
];

export const MOCK_INTERNAL_ASSESSMENTS: InternalAssessment[] = [
  { id: 'ia1', title: 'Unit Test 1', subject: 'Data Structures', score: 18, totalScore: 20, date: '2023-09-10', status: 'COMPLETED' },
  { id: 'ia2', title: 'Quiz 1', subject: 'Advanced Calculus', score: 8, totalScore: 10, date: '2023-09-12', status: 'COMPLETED' },
  { id: 'ia3', title: 'Internal 1', subject: 'Quantum Physics', score: 25, totalScore: 30, date: '2023-10-05', status: 'COMPLETED' },
  { id: 'ia4', title: 'Surprise Quiz', subject: 'Technical Writing', score: 0, totalScore: 10, date: '2023-10-08', status: 'MISSED' },
  { id: 'ia5', title: 'Lab Assessment', subject: 'Data Structures', score: 0, totalScore: 20, date: '2023-10-25', status: 'UPCOMING' },
];

export const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'Campus Maintenance Schedule', content: 'Library server maintenance scheduled for this Saturday 10 PM.', date: '2023-10-05', type: 'ADMIN', sender: 'IT Department' },
  { id: 'n2', title: 'Tech Fest Registration', content: 'Annual Tech Fest registration is now open. Visit the student center.', date: '2023-10-01', type: 'EVENT', sender: 'Student Council' },
  { id: 'n3', title: 'Mid-Term Syllabus Update', content: 'Physics syllabus has been updated. Chapter 5 is excluded.', date: '2023-09-28', type: 'ACADEMIC', sender: 'Physics Dept' },
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'm1', sender: 'Prof. Robert Smith', recipient: 'Alice Johnson', subject: 'Re: Data Structures Query', body: 'Yes, you can use a linked list for that problem.', date: '2023-10-26', isRead: false, type: 'INBOX' },
    { id: 'm2', sender: 'Alice Johnson', recipient: 'Prof. Robert Smith', subject: 'Data Structures Query', body: 'Professor, can I use a linked list?', date: '2023-10-25', isRead: true, type: 'SENT' },
];

export const MOCK_TIMETABLE: TimeTableSlot[] = [
  { id: 't1', day: 'Monday', startTime: '09:00', endTime: '10:30', subject: 'Data Structures', room: 'Lab 3', teacher: 'Prof. Smith' },
  { id: 't2', day: 'Monday', startTime: '11:00', endTime: '12:30', subject: 'Calculus', room: 'Hall A', teacher: 'Dr. Jones' },
];

export const MOCK_COURSE_MATERIALS: CourseMaterial[] = [
  { id: 'm1', title: 'Calculus III Lecture Notes - Ch 4', type: 'PDF', subject: 'Advanced Calculus', date: '2023-10-01', url: '#' },
];

export const MOCK_COURSES: CourseProgram[] = [
  { id: 'c1', name: 'B.Tech Computer Science (CSE)', code: 'CSE', duration: '4 Years', headOfDept: 'Prof. Alan Turing', department: 'Computer Science', credits: 160 },
];

export const MOCK_COLLEGE_EVENTS: CollegeEvent[] = [
  {
    id: 'e1',
    title: 'AI in 2024: Workshop',
    description: 'A hands-on workshop exploring the latest trends in Artificial Intelligence.',
    date: '2023-11-15',
    time: '10:00 AM - 04:00 PM',
    location: 'Main Auditorium',
    category: 'WORKSHOP',
    organizer: 'Computer Science Dept',
    registrationStatus: 'OPEN',
    image: 'https://picsum.photos/seed/ai/400/200'
  }
];

export const MOCK_JOBS: PlacementJob[] = [
    { id: 'j1', company: 'Google', role: 'Software Engineer Intern', salary: '₹45,000/mo', location: 'Remote / Bangalore', deadline: '2023-12-31', status: 'OPEN' },
];

export const MOCK_TICKETS: SupportTicket[] = [
    { id: 't1', subject: 'WiFi not connecting', category: 'TECHNICAL', status: 'OPEN', date: '2023-10-25', lastUpdate: '2023-10-25' },
];

export const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
    { id: 'sr1', type: 'HOSTEL', status: 'APPROVED', date: '2023-08-01', details: 'Room Allocation: Block A, Room 101' },
];

export const MOCK_EXAM_DUTIES: ExamDuty[] = [
  { id: 'ed1', examName: 'CS202 Mid-Term', date: '2023-11-05', time: '09:00 AM - 12:00 PM', room: 'Hall A', role: 'INVIGILATOR' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Assignment Due Soon', message: 'Binary Trees Implementation is due tomorrow.', time: '2 hours ago', type: 'WARNING', isRead: false },
];