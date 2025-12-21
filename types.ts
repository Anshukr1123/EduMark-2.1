export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  PARENT = 'PARENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  departmentId?: string;
  phone?: string;
  address?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface ClassSession {
  id: string;
  subjectName: string;
  time: string;
  room: string;
  status: 'UPCOMING' | 'COMPLETED' | 'LIVE';
  studentCount: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subjectName?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  date: string;
}

export interface Department {
  id: string;
  name: string;
  headOfDept: string;
  totalStudents: number;
  attendanceRate: number;
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  marks?: string;
  maxMarks?: number;
  feedback?: string;
  submittedDate?: string;
  fileUrl?: string; // Optional field for assignment file links
  complexity?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface FeeRecord {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  datePaid?: string;
}

export interface ExamResult {
  id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  date: string;
}

export interface InternalAssessment {
  id: string;
  title: string;
  subject: string;
  score: number;
  totalScore: number;
  date: string;
  status: 'COMPLETED' | 'MISSED' | 'UPCOMING';
}

export interface TimeTableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  teacher: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'ACADEMIC' | 'EVENT' | 'ADMIN';
  sender: string;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  type: 'INBOX' | 'SENT';
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'LINK';
  subject: string;
  date: string;
  url: string;
}

export interface CourseProgram {
  id: string;
  name: string;
  code: string;
  duration: string;
  headOfDept: string;
  department: string;
  credits: number;
}

export interface CollegeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'WORKSHOP' | 'SEMINAR' | 'CULTURAL' | 'SPORTS';
  organizer: string;
  registrationStatus: 'OPEN' | 'CLOSED' | 'REGISTERED';
  image?: string;
}

export interface PlacementJob {
  id: string;
  company: string;
  role: string;
  salary: string;
  location: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'ACADEMIC' | 'TECHNICAL' | 'ADMIN' | 'FACILITY';
  status: 'OPEN' | 'RESOLVED' | 'PENDING';
  date: string;
  lastUpdate: string;
}

export interface ServiceRequest {
    id: string;
    type: 'HOSTEL' | 'TRANSPORT' | 'SCHOLARSHIP';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date: string;
    details: string;
}

export interface ExamDuty {
  id: string;
  examName: string;
  date: string;
  time: string;
  room: string;
  role: 'INVIGILATOR' | 'EXAMINER';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
}