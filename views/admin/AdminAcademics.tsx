
import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_TIMETABLE, MOCK_EXAM_DUTIES, MOCK_SUBJECTS } from '../../constants';
import { CourseProgram, Subject } from '../../types';
import { Card, Button, Modal, Badge } from '../../components/UIComponents';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, MapPin, Edit, MoreVertical, UploadCloud, FileText, X, ChevronLeft, ChevronRight, User as UserIcon, Timer, AlertCircle, List, BookOpen } from 'lucide-react';

interface Props { activeTab: string; }

interface ExtendedCourse extends CourseProgram {
    syllabusFileName?: string;
}

// Extended Exam Interface for Admin Management
interface AdminExam {
    id: string;
    examName: string;
    date: string;
    time: string; // Start Time
    room: string;
    duration: number; // in minutes
    gracePeriod: number; // in minutes
    invigilators: string[];
}

const AdminAcademics: React.FC<Props> = ({ activeTab }) => {
  // Course & Timetable State
  const [timetable, setTimetable] = useState(MOCK_TIMETABLE);
  const [courses, setCourses] = useState<ExtendedCourse[]>(MOCK_COURSES);
  
  // Subject State
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({});
  const [academicSection, setAcademicSection] = useState<'PROGRAMS' | 'SUBJECTS'>('PROGRAMS');

  // Exam State
  // Initialize with MOCK data but extended with default values for new fields
  const [exams, setExams] = useState<AdminExam[]>(MOCK_EXAM_DUTIES.map(e => ({
      id: e.id,
      examName: e.examName,
      date: e.date,
      time: e.time.split(' - ')[0] || '09:00 AM', // Extract start time approximation
      room: e.room,
      duration: 180, // Default 3 hours
      gracePeriod: 15,
      invigilators: ['Prof. Smith', 'Dr. Carter']
  })));

  // View Mode for Exams
  const [examViewMode, setExamViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  
  // Form States
  const [newCourse, setNewCourse] = useState<{ 
    name: string; 
    code: string; 
    credits: number; 
    duration: string; 
    department: string; 
    headOfDept: string;
    syllabusFile: File | null;
  }>({ 
    name: '', code: '', credits: 0, duration: '', department: '', headOfDept: '', syllabusFile: null
  });

  const [currentExam, setCurrentExam] = useState<Partial<AdminExam>>({});

  // --- Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setNewCourse({ ...newCourse, syllabusFile: e.target.files[0] });
      }
  };

  const handleAddCourse = () => {
      const course: ExtendedCourse = {
          id: Math.random().toString(),
          name: newCourse.name,
          code: newCourse.code,
          credits: newCourse.credits,
          duration: newCourse.duration,
          department: newCourse.department,
          headOfDept: newCourse.headOfDept,
          syllabusFileName: newCourse.syllabusFile?.name
      };
      setCourses([...courses, course]);
      setNewCourse({ name: '', code: '', credits: 0, duration: '', department: '', headOfDept: '', syllabusFile: null });
      setIsCourseModalOpen(false);
  };

  const handleSaveSubject = () => {
      if (!currentSubject.name || !currentSubject.code) return;
      
      const newSub: Subject = {
          id: currentSubject.id || Math.random().toString(),
          name: currentSubject.name!,
          code: currentSubject.code!,
          totalClasses: currentSubject.totalClasses || 0,
          attendedClasses: currentSubject.attendedClasses || 0
      };

      if (currentSubject.id) {
          setSubjects(subjects.map(s => s.id === currentSubject.id ? newSub : s));
      } else {
          setSubjects([...subjects, newSub]);
      }
      setIsSubjectModalOpen(false);
      setCurrentSubject({});
  };

  const handleDeleteSubject = (id: string) => {
      if(confirm('Delete this subject?')) {
          setSubjects(subjects.filter(s => s.id !== id));
      }
  };

  const handleSaveExam = () => {
      if (!currentExam.examName || !currentExam.date) return;
      
      const newExamData: AdminExam = {
          id: currentExam.id || Math.random().toString(),
          examName: currentExam.examName!,
          date: currentExam.date!,
          time: currentExam.time || '09:00',
          room: currentExam.room || 'TBD',
          duration: currentExam.duration || 180,
          gracePeriod: currentExam.gracePeriod || 0,
          invigilators: currentExam.invigilators || []
      };

      if (currentExam.id) {
          setExams(exams.map(e => e.id === currentExam.id ? newExamData : e));
      } else {
          setExams([...exams, newExamData]);
      }
      setIsExamModalOpen(false);
      setCurrentExam({});
  };

  const handleEditExam = (exam: AdminExam) => {
      setCurrentExam(exam);
      setIsExamModalOpen(true);
  };

  const handleDeleteExam = (id: string) => {
      if(confirm('Are you sure you want to cancel this exam?')) {
          setExams(exams.filter(e => e.id !== id));
      }
  };

  // --- Render Helpers ---

  const renderTimetableGrid = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

    return (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px]">
                <div className="grid grid-cols-9 gap-2 mb-2">
                    <div className="font-bold text-slate-400 text-xs uppercase p-2">Time / Day</div>
                    {timeSlots.map(t => <div key={t} className="font-bold text-slate-600 text-xs text-center p-2 bg-slate-100 rounded">{t}</div>)}
                </div>
                {days.map(day => (
                    <div key={day} className="grid grid-cols-9 gap-2 mb-2">
                        <div className="font-bold text-slate-700 text-sm flex items-center p-2">{day}</div>
                        {timeSlots.map(time => {
                             const slot = timetable.find(t => t.day === day && t.startTime.startsWith(time));
                             return (
                                <div key={`${day}-${time}`} className={`relative p-2 rounded-lg border h-24 flex flex-col justify-center text-xs transition-all hover:shadow-md ${slot ? 'bg-indigo-50 border-indigo-200 cursor-pointer' : 'bg-white border-slate-100 border-dashed'}`}>
                                    {slot ? (
                                        <>
                                            <div className="font-bold text-indigo-700 truncate" title={slot.subject}>{slot.subject}</div>
                                            <div className="text-slate-500 mt-1">{slot.room}</div>
                                            <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 group-hover:opacity-100">
                                                <button className="p-1 hover:bg-white rounded-full text-indigo-600"><Edit className="w-3 h-3"/></button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="opacity-0 hover:opacity-100 flex justify-center items-center h-full">
                                            <button className="text-slate-300 hover:text-indigo-500"><Plus className="w-4 h-4"/></button>
                                        </div>
                                    )}
                                </div>
                             );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      const padding = Array.from({ length: firstDay }, (_, i) => i);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      return (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-800">{monthNames[month]} {year}</h3>
                  <div className="flex gap-2">
                      <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5"/></button>
                      <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-5 h-5"/></button>
                  </div>
              </div>
              <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-slate-400 uppercase">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                  {padding.map(i => <div key={`pad-${i}`} className="h-24 bg-slate-50/30 rounded-lg"></div>)}
                  {days.map(day => {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayExams = exams.filter(e => e.date === dateStr);
                      return (
                          <div key={day} className={`h-24 border rounded-lg p-2 flex flex-col justify-between transition-all hover:border-indigo-300 ${dayExams.length > 0 ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100'}`}>
                              <span className={`text-sm font-bold ${dayExams.length > 0 ? 'text-indigo-600' : 'text-slate-500'}`}>{day}</span>
                              <div className="space-y-1 overflow-y-auto max-h-[60px] scrollbar-none">
                                  {dayExams.map(exam => (
                                      <div key={exam.id} onClick={() => handleEditExam(exam)} className="text-[10px] bg-white border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded shadow-sm truncate cursor-pointer hover:bg-indigo-50">
                                          {exam.time} {exam.examName}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  if (activeTab === 'academics') return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
               <h2 className="text-2xl font-bold text-slate-900">Academic Management</h2>
               <p className="text-sm text-slate-500">Manage degree programs and individual subjects.</p>
           </div>
           <div className="flex items-center gap-4">
               <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                   <button 
                       onClick={() => setAcademicSection('PROGRAMS')} 
                       className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${academicSection === 'PROGRAMS' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                       Degree Programs
                   </button>
                   <button 
                       onClick={() => setAcademicSection('SUBJECTS')} 
                       className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${academicSection === 'SUBJECTS' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                       Subjects
                   </button>
               </div>
               <Button onClick={() => academicSection === 'PROGRAMS' ? setIsCourseModalOpen(true) : (setCurrentSubject({}), setIsSubjectModalOpen(true))}>
                   <Plus className="w-4 h-4 mr-2"/> {academicSection === 'PROGRAMS' ? 'Add Course' : 'Add Subject'}
               </Button>
           </div>
       </div>

       {academicSection === 'PROGRAMS' ? (
           <Card>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="p-4 font-semibold">Course Name</th>
                            <th className="p-4 font-semibold">Code</th>
                            <th className="p-4 font-semibold">Credits</th>
                            <th className="p-4 font-semibold">Duration</th>
                            <th className="p-4 font-semibold">Department</th>
                            <th className="p-4 font-semibold">Head/Instructor</th>
                            <th className="p-4 font-semibold">Syllabus</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {courses.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-900">{c.name}</td>
                                <td className="p-4"><Badge variant="neutral">{c.code}</Badge></td>
                                <td className="p-4">{c.credits}</td>
                                <td className="p-4">{c.duration}</td>
                                <td className="p-4">{c.department}</td>
                                <td className="p-4 text-slate-600">{c.headOfDept}</td>
                                <td className="p-4">
                                    {c.syllabusFileName ? (
                                        <div className="flex items-center text-indigo-600 text-xs font-medium bg-indigo-50 px-2 py-1 rounded w-fit cursor-pointer hover:bg-indigo-100">
                                            <FileText className="w-3 h-3 mr-1"/> PDF
                                        </div>
                                    ) : <span className="text-slate-400 text-xs">-</span>}
                                </td>
                                <td className="p-4 text-right">
                                    <Button size="sm" variant="outline"><Edit className="w-3 h-3"/></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
           </Card>
       ) : (
           <Card>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="p-4 font-bold text-slate-600">Subject Name</th>
                            <th className="p-4 font-bold text-slate-600">Code</th>
                            <th className="p-4 font-bold text-slate-600 text-center">Total Classes</th>
                            <th className="p-4 font-bold text-slate-600 text-center">Attended Classes</th>
                            <th className="p-4 text-right font-bold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {subjects.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">{s.name}</td>
                                <td className="p-4"><Badge variant="neutral" className="font-bold">{s.code}</Badge></td>
                                <td className="p-4 text-center font-bold text-indigo-700 bg-indigo-50/50">{s.totalClasses}</td>
                                <td className="p-4 text-center font-bold text-green-700 bg-green-50/50">{s.attendedClasses}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => { setCurrentSubject(s); setIsSubjectModalOpen(true); }}>
                                        <Edit className="w-3 h-3"/>
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteSubject(s.id)}>
                                        <Trash2 className="w-3 h-3"/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
           </Card>
       )}

       <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title="Add New Course Program">
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Course Name</label>
                    <input placeholder="e.g. B.Tech Computer Science" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Course Code</label>
                    <input placeholder="e.g. CSE" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} />
                 </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Credits</label>
                    <input type="number" placeholder="e.g. 160" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newCourse.credits || ''} onChange={e => setNewCourse({...newCourse, credits: parseInt(e.target.value) || 0})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Duration</label>
                    <input placeholder="e.g. 4 Years" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} />
                 </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <input placeholder="e.g. Computer Science" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newCourse.department} onChange={e => setNewCourse({...newCourse, department: e.target.value})} />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Head of Department / Instructor</label>
                <input placeholder="e.g. Prof. Alan Turing" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newCourse.headOfDept} onChange={e => setNewCourse({...newCourse, headOfDept: e.target.value})} />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Course Syllabus (PDF)</label>
                {!newCourse.syllabusFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                            <p className="text-xs text-slate-500">Click to upload syllabus</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    </label>
                ) : (
                    <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm text-indigo-900 font-medium truncate max-w-[200px]">{newCourse.syllabusFile.name}</span>
                        </div>
                        <button onClick={() => setNewCourse({...newCourse, syllabusFile: null})} className="text-slate-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <Button className="w-full mt-2" onClick={handleAddCourse} disabled={!newCourse.name || !newCourse.code}>Save Course Program</Button>
         </div>
       </Modal>

       <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title={currentSubject.id ? "Edit Subject" : "Add New Subject"}>
           <div className="space-y-4">
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Subject Name</label>
                   <input 
                       className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                       placeholder="e.g. Advanced Calculus" 
                       value={currentSubject.name || ''} 
                       onChange={e => setCurrentSubject({...currentSubject, name: e.target.value})} 
                   />
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Subject Code</label>
                   <input 
                       className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                       placeholder="e.g. MAT101" 
                       value={currentSubject.code || ''} 
                       onChange={e => setCurrentSubject({...currentSubject, code: e.target.value})} 
                   />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Total Classes</label>
                       <input 
                           type="number" 
                           className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                           placeholder="0" 
                           value={currentSubject.totalClasses || ''} 
                           onChange={e => setCurrentSubject({...currentSubject, totalClasses: parseInt(e.target.value) || 0})} 
                       />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Attended Classes</label>
                       <input 
                           type="number" 
                           className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                           placeholder="0" 
                           value={currentSubject.attendedClasses || ''} 
                           onChange={e => setCurrentSubject({...currentSubject, attendedClasses: parseInt(e.target.value) || 0})} 
                       />
                   </div>
               </div>
               <Button className="w-full mt-4 font-bold" onClick={handleSaveSubject} disabled={!currentSubject.name || !currentSubject.code}>
                   {currentSubject.id ? 'Update Subject' : 'Add Subject'}
               </Button>
           </div>
       </Modal>
    </div>
  );

  if (activeTab === 'timetable') return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-900">Visual Timetable</h2><div className="flex gap-2"><Button variant="outline">Export PDF</Button><Button><Plus className="w-4 h-4 mr-2"/> Add Slot</Button></div></div>
       <Card className="p-6">
           {renderTimetableGrid()}
       </Card>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
               <h2 className="text-2xl font-bold text-slate-900">Exam Schedules</h2>
               <p className="text-sm text-slate-500">Manage exams, durations, and invigilation duties.</p>
           </div>
           <div className="flex gap-2">
               <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                   <button onClick={() => setExamViewMode('LIST')} className={`p-2 rounded-md transition-all ${examViewMode === 'LIST' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><List className="w-4 h-4"/></button>
                   <button onClick={() => setExamViewMode('CALENDAR')} className={`p-2 rounded-md transition-all ${examViewMode === 'CALENDAR' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><CalendarIcon className="w-4 h-4"/></button>
               </div>
               <Button onClick={() => { setCurrentExam({}); setIsExamModalOpen(true); }}><Plus className="w-4 h-4 mr-2"/> Schedule New Exam</Button>
           </div>
       </div>

       {examViewMode === 'LIST' ? (
           <div className="grid gap-4">
              {exams.map(e => (
                 <Card key={e.id} className="flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-indigo-300 transition-colors">
                     <div className="flex items-start gap-4">
                         <div className="w-14 h-14 bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-indigo-700 font-bold border border-indigo-100 shadow-sm">
                             <span className="text-[10px] uppercase tracking-wide">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                             <span className="text-xl leading-none">{new Date(e.date).getDate()}</span>
                         </div>
                         <div>
                             <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">{e.examName}</h3>
                             <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                                 <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-500"/> {e.time}</span>
                                 <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-500"/> {e.room}</span>
                                 <span className="flex items-center"><Timer className="w-3.5 h-3.5 mr-1.5 text-indigo-500"/> {e.duration} mins</span>
                             </div>
                             <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 uppercase">Invigilators:</span>
                                {e.invigilators.map((inv, i) => (
                                    <Badge key={i} variant="neutral" className="text-[10px] py-0 px-1.5">{inv}</Badge>
                                ))}
                             </div>
                         </div>
                     </div>
                     <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                         <div className="text-right mr-4 hidden md:block">
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Grace Period</p>
                             <p className="text-sm font-semibold text-slate-700">{e.gracePeriod} mins</p>
                         </div>
                         <Button size="sm" variant="outline" onClick={() => handleEditExam(e)}><Edit className="w-4 h-4 mr-2"/> Edit</Button>
                         <button onClick={() => handleDeleteExam(e.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                     </div>
                 </Card>
              ))}
              {exams.length === 0 && <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">No exams scheduled yet.</div>}
           </div>
       ) : (
           renderCalendar()
       )}

       <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title={currentExam.id ? "Edit Exam Schedule" : "Schedule New Exam"}>
           <div className="space-y-4">
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Exam Name</label>
                   <input className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. CS202 Mid-Term" value={currentExam.examName || ''} onChange={e => setCurrentExam({...currentExam, examName: e.target.value})} />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Date</label>
                       <input type="date" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={currentExam.date || ''} onChange={e => setCurrentExam({...currentExam, date: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Start Time</label>
                       <input type="time" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={currentExam.time || ''} onChange={e => setCurrentExam({...currentExam, time: e.target.value})} />
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Duration (mins)</label>
                       <div className="relative">
                           <input type="number" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="180" value={currentExam.duration || ''} onChange={e => setCurrentExam({...currentExam, duration: parseInt(e.target.value) || 0})} />
                           <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">MIN</span>
                       </div>
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Grace Period (mins)</label>
                       <div className="relative">
                           <input type="number" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="15" value={currentExam.gracePeriod || ''} onChange={e => setCurrentExam({...currentExam, gracePeriod: parseInt(e.target.value) || 0})} />
                           <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">MIN</span>
                       </div>
                   </div>
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Room / Venue</label>
                   <input className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Examination Hall A" value={currentExam.room || ''} onChange={e => setCurrentExam({...currentExam, room: e.target.value})} />
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Assign Invigilators</label>
                   <div className="p-3 border rounded-lg bg-slate-50 space-y-2">
                       <div className="flex items-center gap-2">
                           <UserIcon className="w-4 h-4 text-slate-400"/>
                           <input 
                                className="bg-transparent text-sm w-full outline-none placeholder:text-slate-400" 
                                placeholder="Enter name and press Enter..." 
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.currentTarget.value.trim();
                                        if(val) {
                                            setCurrentExam({ ...currentExam, invigilators: [...(currentExam.invigilators || []), val] });
                                            e.currentTarget.value = '';
                                        }
                                    }
                                }}
                           />
                       </div>
                       <div className="flex flex-wrap gap-2">
                           {currentExam.invigilators?.map((inv, i) => (
                               <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-white border border-slate-200 text-xs font-medium text-slate-700">
                                   {inv} <button onClick={() => setCurrentExam({...currentExam, invigilators: currentExam.invigilators?.filter((_, idx) => idx !== i)})} className="ml-1 text-slate-400 hover:text-red-500"><X className="w-3 h-3"/></button>
                                </span>
                           ))}
                       </div>
                   </div>
                   <p className="text-[10px] text-slate-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Type name and press Enter to add multiple invigilators.</p>
               </div>

               <Button className="w-full mt-4" onClick={handleSaveExam} disabled={!currentExam.examName || !currentExam.date}>Save Schedule</Button>
           </div>
       </Modal>
    </div>
  );
};
export default AdminAcademics;
