
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, UserRole } from '../../types';
import { MOCK_ATTENDANCE_LIST, MOCK_USERS, MOCK_SUBJECTS } from '../../constants';
import { Card, Button, Badge, Modal } from '../../components/UIComponents';
import { Plus, CheckCheck, Calendar, RefreshCcw, Users, CheckCircle2, XCircle, Clock, Percent, Save, Loader2, BookOpen } from 'lucide-react';
import { databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, ID } from '../../appwriteClient';

// Added onShowToast to Props interface
interface Props { 
  user: User; 
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// Added user and onShowToast to component parameters
const TeacherAttendance: React.FC<Props> = ({ user, onShowToast }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_LIST);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal State
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState(MOCK_SUBJECTS[0]?.name || 'General');
  const [studentList, setStudentList] = useState<{id: string, name: string, status: 'PRESENT'|'ABSENT'|'LATE'}[]>([]);

  useEffect(() => {
    if (isAttendanceModalOpen) {
        // Initialize list with students, default status ABSENT
        const students = MOCK_USERS
            .filter(u => u.role === UserRole.STUDENT)
            .map(u => ({ id: u.id, name: u.name, status: 'ABSENT' as const }));
        setStudentList(students);
    }
  }, [isAttendanceModalOpen]);

  const handleMarkAllPresent = () => {
      setStudentList(prev => prev.map(s => ({ ...s, status: 'PRESENT' })));
  };

  const handleReset = () => {
      setStudentList(prev => prev.map(s => ({ ...s, status: 'ABSENT' })));
  };

  const handleStatusChange = (id: string, status: 'PRESENT'|'ABSENT'|'LATE') => {
      setStudentList(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const saveAttendance = async () => {
      setIsSaving(true);
      const newRecords = studentList.map(s => ({
          id: Math.random().toString(),
          studentId: s.id,
          studentName: s.name,
          subjectName: selectedSubject,
          status: s.status,
          date: sessionDate
      }));
      
      // Optimistic Update: Update local state immediately
      setAttendanceData([...newRecords, ...attendanceData]); 
      
      // Real-time Update: Write to Appwrite to notify students
      if (isAppwriteConfigured) {
          try {
              const promises = newRecords.map(r => 
                  databases.createDocument(
                      DATABASE_ID,
                      COLLECTIONS.ATTENDANCE,
                      ID.unique(),
                      {
                          student_id: r.studentId,
                          status: r.status,
                          date: r.date,
                          subject_name: r.subjectName
                      }
                  )
              );
              await Promise.all(promises);
          } catch (error) {
              console.error("Failed to sync attendance to cloud:", error);
          }
      }

      // Simulate network delay for demo feel if offline
      if (!isAppwriteConfigured) {
          await new Promise(resolve => setTimeout(resolve, 800));
      }

      setIsSaving(false);
      setIsAttendanceModalOpen(false);
      
      // Added success toast notification
      if (onShowToast) {
        onShowToast("Attendance Saved", `Records for ${selectedSubject} have been updated successfully.`, "success");
      }
  };

  const total = attendanceData.length;
  const present = attendanceData.filter(r => r.status === 'PRESENT').length;
  const absent = attendanceData.filter(r => r.status === 'ABSENT').length;
  const late = attendanceData.filter(r => r.status === 'LATE').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-slate-900">Attendance Control</h2>
           <Button onClick={() => setIsAttendanceModalOpen(true)}>
               <Plus className="w-4 h-4 mr-2"/> Take Attendance
           </Button>
       </div>
       
       <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <Card className="bg-slate-50 border-slate-200 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Total Records</p>
                  <Users className="w-4 h-4 text-slate-400 opacity-70"/>
              </div>
              <p className="text-2xl font-bold text-slate-700">{total}</p>
          </Card>
          <Card className="bg-green-50 border-green-100 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-green-600 font-bold text-[10px] uppercase tracking-wider">Present</p>
                  <CheckCircle2 className="w-4 h-4 text-green-500 opacity-70"/>
              </div>
              <p className="text-2xl font-bold text-green-700">{present}</p>
          </Card>
          <Card className="bg-red-50 border-red-100 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-red-600 font-bold text-[10px] uppercase tracking-wider">Absent</p>
                  <XCircle className="w-4 h-4 text-red-500 opacity-70"/>
              </div>
              <p className="text-2xl font-bold text-red-700">{absent}</p>
          </Card>
          <Card className="bg-yellow-50 border-yellow-100 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-yellow-600 font-bold text-[10px] uppercase tracking-wider">Late</p>
                  <Clock className="w-4 h-4 text-yellow-500 opacity-70"/>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{late}</p>
          </Card>
          <Card className="bg-indigo-50 border-indigo-100 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-wider">Present %</p>
                  <Percent className="w-4 h-4 text-indigo-500 opacity-70"/>
              </div>
              <p className="text-2xl font-bold text-indigo-700">{percentage}%</p>
          </Card>
       </div>

       <Card title="Attendance Records">
         <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Subject</th><th className="px-6 py-3">Student</th><th className="px-6 py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {attendanceData.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{r.date}</td>
                            <td className="px-6 py-4 text-slate-600">{r.subjectName || 'General'}</td>
                            <td className="px-6 py-4">{r.studentName}</td>
                            <td className="px-6 py-4"><Badge variant={r.status === 'PRESENT' ? 'success' : r.status === 'LATE' ? 'warning' : 'error'}>{r.status}</Badge></td>
                        </tr>
                    ))}
                </tbody>
             </table>
         </div>
       </Card>

       <Modal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)} title="New Attendance Session">
          <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg">
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-2 py-1.5">
                          <Calendar className="w-4 h-4 text-slate-400"/>
                          <input 
                              type="date" 
                              value={sessionDate} 
                              onChange={(e) => setSessionDate(e.target.value)} 
                              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 p-0 w-full outline-none"
                          />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-2 py-1.5">
                          <BookOpen className="w-4 h-4 text-slate-400"/>
                          <select 
                              value={selectedSubject} 
                              onChange={(e) => setSelectedSubject(e.target.value)}
                              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 p-0 w-full outline-none"
                          >
                              {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                              <option value="General">General Session</option>
                          </select>
                      </div>
                  </div>
              </div>

              <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleReset} className="flex-1 text-slate-600 hover:bg-slate-100">
                      <RefreshCcw className="w-3 h-3 mr-1" /> Reset All
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleMarkAllPresent} className="flex-1 text-green-700 border-green-200 hover:bg-green-50 bg-white">
                      <CheckCheck className="w-3 h-3 mr-1" /> Mark All Present
                  </Button>
              </div>

              {/* Scrolling system for student list */}
              <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-50">
                  {studentList.map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${student.status === 'PRESENT' ? 'bg-green-100 text-green-700' : student.status === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {student.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-slate-900">{student.name}</span>
                          </div>
                          <div className="flex bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden shrink-0">
                              <button 
                                  onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors ${student.status === 'PRESENT' ? 'bg-green-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                  title="Present"
                              >
                                  P
                              </button>
                              <div className="w-px bg-slate-200"></div>
                              <button 
                                  onClick={() => handleStatusChange(student.id, 'LATE')}
                                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors ${student.status === 'LATE' ? 'bg-yellow-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                  title="Late"
                              >
                                  L
                              </button>
                              <div className="w-px bg-slate-200"></div>
                              <button 
                                  onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors ${student.status === 'ABSENT' ? 'bg-red-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                  title="Absent"
                              >
                                  A
                              </button>
                          </div>
                      </div>
                  ))}
                  {studentList.length === 0 && <div className="p-4 text-center text-sm text-slate-500">No students found.</div>}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 mt-2">
                  <Button variant="secondary" onClick={() => setIsAttendanceModalOpen(false)}>Cancel</Button>
                  <Button onClick={saveAttendance} isLoading={isSaving} disabled={isSaving}>
                      {isSaving ? 'Syncing...' : 'Save Session'}
                  </Button>
              </div>
          </div>
       </Modal>
    </div>
  );
};

export default TeacherAttendance;
