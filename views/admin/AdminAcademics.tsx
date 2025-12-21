
import React, { useState, useMemo } from 'react';
import { MOCK_COURSES, MOCK_TIMETABLE, MOCK_EXAM_DUTIES, MOCK_SUBJECTS } from '../../constants';
import { CourseProgram, Subject } from '../../types';
import { Card, Button, Modal, Badge } from '../../components/UIComponents';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, MapPin, Edit, MoreVertical, UploadCloud, FileText, X, ChevronLeft, ChevronRight, User as UserIcon, Timer, AlertCircle, List, BookOpen, Filter, Download, CheckSquare, Square, Users, ArrowUpDown, ChevronDown } from 'lucide-react';

interface Props { 
  activeTab: string; 
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

interface ExtendedCourse extends CourseProgram {
    syllabusFileName?: string;
}

type ExamStatus = 'READY' | 'COMPLETED' | 'MISSED';

interface AdminExam {
    id: string;
    examName: string;
    date: string;
    time: string; 
    room: string;
    duration: number; 
    gracePeriod: number; 
    invigilators: string[];
    dueDate?: string;
    status: ExamStatus; // Added status field
}

type SortExamKey = 'DATE_ASC' | 'DATE_DESC' | 'NAME_ASC' | 'NAME_DESC';

const AdminAcademics: React.FC<Props> = ({ activeTab, onShowToast }) => {
  // Course & Timetable State
  const [timetable, setTimetable] = useState(MOCK_TIMETABLE);
  const [courses, setCourses] = useState<ExtendedCourse[]>(MOCK_COURSES);
  const [deptFilter, setDeptFilter] = useState('ALL');
  
  // Subject State
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({});
  const [academicSection, setAcademicSection] = useState<'PROGRAMS' | 'SUBJECTS'>('PROGRAMS');

  // Exam State
  const [exams, setExams] = useState<AdminExam[]>(MOCK_EXAM_DUTIES.map((e, idx) => ({
      id: e.id,
      examName: e.examName,
      date: e.date,
      time: e.time.split(' - ')[0] || '09:00 AM',
      room: e.room,
      duration: 180,
      gracePeriod: 15,
      invigilators: ['Prof. Smith', 'Dr. Carter'],
      dueDate: new Date(new Date(e.date).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: idx === 0 ? 'READY' : (idx % 2 === 0 ? 'COMPLETED' : 'MISSED') // Mock statuses
  })));
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);
  const [isBulkInvigilatorModalOpen, setIsBulkInvigilatorModalOpen] = useState(false);
  const [bulkInvigilators, setBulkInvigilators] = useState<string[]>([]);

  // Exam Filtering & Sorting State
  const [filterExamStatus, setFilterExamStatus] = useState<'ALL' | ExamStatus>('ALL');
  const [sortExamBy, setSortExamBy] = useState<SortExamKey>('DATE_ASC');

  const departments = useMemo(() => {
    return ['ALL', ...new Set(courses.map(c => c.department))];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (deptFilter === 'ALL') return courses;
    return courses.filter(c => c.department === deptFilter);
  }, [courses, deptFilter]);

  const processedExams = useMemo(() => {
    let result = exams;
    if (filterExamStatus !== 'ALL') {
      result = result.filter(e => e.status === filterExamStatus);
    }
    return [...result].sort((a, b) => {
      switch (sortExamBy) {
        case 'DATE_ASC': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'DATE_DESC': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'NAME_ASC': return a.examName.localeCompare(b.examName);
        case 'NAME_DESC': return b.examName.localeCompare(a.examName);
        default: return 0;
      }
    });
  }, [exams, filterExamStatus, sortExamBy]);

  const [examViewMode, setExamViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  
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

  // --- CSV Export Helper ---
  const downloadCSV = (filename: string, data: any[][]) => {
    const csvContent = data.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportCourses = () => {
    const headers = ["Name", "Code", "Credits", "Duration", "Department", "Head of Dept"];
    const rows = filteredCourses.map(c => [c.name, c.code, c.credits, c.duration, c.department, c.headOfDept]);
    downloadCSV("course_programs_registry.csv", [headers, ...rows]);
    onShowToast?.("Export Complete", "Course registry has been exported to CSV.", "success");
  };

  const handleExportSubjects = () => {
    const headers = ["Subject Name", "Code", "Total Classes", "Attended Classes"];
    const rows = subjects.map(s => [s.name, s.code, s.totalClasses, s.attendedClasses]);
    downloadCSV("academic_subjects_report.csv", [headers, ...rows]);
    onShowToast?.("Export Complete", "Subject data has been exported to CSV.", "success");
  };

  const handleExportExams = () => {
    const headers = ["Exam Name", "Date", "Reg. Deadline", "Time", "Room", "Duration (min)", "Status", "Invigilators"];
    const rows = exams.map(e => [e.examName, e.date, e.dueDate || 'N/A', e.time, e.room, e.duration, e.status, e.invigilators.join("; ")]);
    downloadCSV("exam_schedule_master.csv", [headers, ...rows]);
    onShowToast?.("Export Complete", "Exam schedule has been exported to CSV.", "success");
  };

  // --- Multi-Select Handlers ---
  const toggleExamSelection = (id: string) => {
    setSelectedExamIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAllExams = () => {
    if (selectedExamIds.length === exams.length) {
      setSelectedExamIds([]);
    } else {
      setSelectedExamIds(exams.map(e => e.id));
    }
  };

  const handleBulkAssignInvigilators = () => {
    if (bulkInvigilators.length === 0) return;
    setExams(prev => prev.map(exam => 
      selectedExamIds.includes(exam.id) 
        ? { ...exam, invigilators: Array.from(new Set([...exam.invigilators, ...bulkInvigilators])) }
        : exam
    ));
    setIsBulkInvigilatorModalOpen(false);
    setSelectedExamIds([]);
    setBulkInvigilators([]);
    onShowToast?.("Success", `Assigned invigilators to ${selectedExamIds.length} exam slots.`, "success");
  };

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
      onShowToast?.("Course Added", "The new program has been successfully cataloged.", "success");
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
          onShowToast?.("Subject Updated", "Changes to the subject unit have been saved.", "success");
      } else {
          setSubjects([...subjects, newSub]);
          onShowToast?.("Subject Added", "A new academic unit has been added.", "success");
      }
      setIsSubjectModalOpen(false);
      setCurrentSubject({});
  };

  const handleDeleteSubject = (id: string) => {
      if(confirm('Delete this subject?')) {
          setSubjects(subjects.filter(s => s.id !== id));
          onShowToast?.("Subject Deleted", "The academic unit has been removed.", "info");
      }
  };

  const handleSaveExam = () => {
      if (!currentExam.examName || !currentExam.date) return;
      
      const newExamData: AdminExam = {
          id: currentExam.id || Math.random().toString(),
          examName: currentExam.examName!,
          date: currentExam.date!,
          dueDate: currentExam.dueDate!,
          time: currentExam.time || '09:00',
          room: currentExam.room || 'TBD',
          duration: currentExam.duration || 180,
          gracePeriod: currentExam.gracePeriod || 0,
          invigilators: currentExam.invigilators || [],
          status: currentExam.status || 'READY'
      };

      if (currentExam.id) {
          setExams(exams.map(e => e.id === currentExam.id ? newExamData : e));
          onShowToast?.("Exam Updated", "Schedule adjustments have been saved.", "success");
      } else {
          setExams([...exams, newExamData]);
          onShowToast?.("Exam Scheduled", "New examination slot has been finalized.", "success");
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
          onShowToast?.("Exam Cancelled", "The examination has been removed from the calendar.", "warning");
      }
  };

  const renderTimetableGrid = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

    return (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px]">
                <div className="grid grid-cols-9 gap-2 mb-2">
                    <div className="font-bold text-slate-400 text-[10px] uppercase p-2">Time / Day</div>
                    {timeSlots.map(t => <div key={t} className="font-bold text-slate-600 text-[10px] text-center p-2 bg-slate-100 rounded">{t}</div>)}
                </div>
                {days.map(day => (
                    <div key={day} className="grid grid-cols-9 gap-2 mb-2">
                        <div className="font-bold text-slate-700 text-xs flex items-center p-2">{day}</div>
                        {timeSlots.map(time => {
                             const slot = timetable.find(t => t.day === day && t.startTime.startsWith(time));
                             return (
                                <div key={`${day}-${time}`} className={`relative p-2 rounded-lg border h-20 flex flex-col justify-center text-[10px] transition-all hover:shadow-md ${slot ? 'bg-indigo-50 border-indigo-200 cursor-pointer' : 'bg-white border-slate-100 border-dashed'}`}>
                                    {slot ? (
                                        <>
                                            <div className="font-black text-indigo-700 truncate" title={slot.subject}>{slot.subject}</div>
                                            <div className="text-slate-500 mt-1 font-bold">{slot.room}</div>
                                        </>
                                    ) : (
                                        <div className="opacity-0 hover:opacity-100 flex justify-center items-center h-full">
                                            <button className="text-slate-300 hover:text-indigo-500"><Plus className="w-3 h-3"/></button>
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
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">{monthNames[month]} {year}</h3>
                  <div className="flex gap-2">
                      <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-4 h-4"/></button>
                      <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-4 h-4"/></button>
                  </div>
              </div>
              <div className="grid grid-cols-7 mb-2 text-center text-[10px] font-black text-slate-400 uppercase">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                  {padding.map(i => <div key={`pad-${i}`} className="h-20 bg-slate-50/30 rounded-lg"></div>)}
                  {days.map(day => {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayExams = processedExams.filter(e => e.date === dateStr);
                      return (
                          <div key={day} className={`h-20 border rounded-lg p-1.5 flex flex-col justify-between transition-all hover:border-indigo-300 ${dayExams.length > 0 ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100'}`}>
                              <span className={`text-[10px] font-black ${dayExams.length > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>{day}</span>
                              <div className="space-y-0.5 overflow-y-auto max-h-[40px] scrollbar-none">
                                  {dayExams.map(exam => (
                                      <div key={exam.id} onClick={() => handleEditExam(exam)} className="text-[7px] font-black leading-none bg-white border border-indigo-200 text-indigo-700 px-1 py-0.5 rounded shadow-sm truncate cursor-pointer hover:bg-indigo-50">
                                          {exam.examName}
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

  const getExamStatusVariant = (status: ExamStatus) => {
    switch (status) {
        case 'COMPLETED': return 'success';
        case 'MISSED': return 'error';
        default: return 'warning';
    }
  };

  if (activeTab === 'academics') return (
    <div className="space-y-4 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Academic Terminal</h2>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Configure Institutional Units</p>
           </div>
           <div className="flex flex-wrap items-center gap-3">
               {academicSection === 'PROGRAMS' && (
                   <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                       <Filter className="w-3 h-3 text-slate-400" />
                       <select 
                           value={deptFilter} 
                           onChange={(e) => setDeptFilter(e.target.value)}
                           className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-700 cursor-pointer"
                       >
                           {departments.map(dept => <option key={dept} value={dept}>{dept === 'ALL' ? 'Filter Dept: All' : `Dept: ${dept}`}</option>)}
                       </select>
                   </div>
               )}
               <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                   <button 
                       onClick={() => setAcademicSection('PROGRAMS')} 
                       className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${academicSection === 'PROGRAMS' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                       Programs
                   </button>
                   <button 
                       onClick={() => setAcademicSection('SUBJECTS')} 
                       className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${academicSection === 'SUBJECTS' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                       Subjects
                   </button>
               </div>
               <div className="flex gap-2">
                   <Button variant="outline" onClick={academicSection === 'PROGRAMS' ? handleExportCourses : handleExportSubjects} className="h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-600">
                       <Download className="w-3.5 h-3.5 mr-1.5"/> CSV
                   </Button>
                   <Button onClick={() => academicSection === 'PROGRAMS' ? setIsCourseModalOpen(true) : (setCurrentSubject({}), setIsSubjectModalOpen(true))} className="h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest">
                       <Plus className="w-3.5 h-3.5 mr-1.5"/> Add {academicSection === 'PROGRAMS' ? 'Course' : 'Subject'}
                   </Button>
               </div>
           </div>
       </div>

       {academicSection === 'PROGRAMS' ? (
           <Card className="rounded-[24px] overflow-hidden border-slate-100">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-[0.2em] font-black border-b border-slate-100">
                        <tr>
                            <th className="p-4">Program Designation</th>
                            <th className="p-4">Node</th>
                            <th className="p-4">Weight</th>
                            <th className="p-4">Phase</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Lead Faculty</th>
                            <th className="p-4">Technical Manual</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                        {filteredCourses.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-900 font-black">{c.name}</td>
                                <td className="p-4"><Badge className="bg-indigo-50 text-indigo-700 font-black border-none text-[8px] uppercase">{c.code}</Badge></td>
                                <td className="p-4">{c.credits} CRS</td>
                                <td className="p-4">{c.duration}</td>
                                <td className="p-4 font-black uppercase text-slate-500">{c.department}</td>
                                <td className="p-4">{c.headOfDept}</td>
                                <td className="p-4">
                                    {c.syllabusFileName ? (
                                        <div className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg w-fit cursor-pointer hover:bg-indigo-100 transition-colors shadow-sm">
                                            <FileText className="w-3 h-3 mr-1"/> SYLLABUS
                                        </div>
                                    ) : <span className="text-slate-300 font-black">-</span>}
                                </td>
                                <td className="p-4 text-right">
                                    <Button size="sm" variant="outline" className="h-7 w-7 p-0 rounded-lg border-slate-200"><Edit className="w-3 h-3"/></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
           </Card>
       ) : (
           <Card className="rounded-[24px] overflow-hidden border-slate-100">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-[0.2em] font-black border-b border-slate-100">
                        <tr>
                            <th className="p-4">Subject Vector</th>
                            <th className="p-4">Node</th>
                            <th className="p-4 text-center">Load (Total)</th>
                            <th className="p-4 text-center">Status (Attended)</th>
                            <th className="p-4 text-right">Terminal Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                        {subjects.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-900 font-black">{s.name}</td>
                                <td className="p-4"><Badge className="bg-slate-100 text-slate-700 font-black border-none text-[8px] uppercase">{s.code}</Badge></td>
                                <td className="p-4 text-center font-black text-indigo-600">{s.totalClasses}</td>
                                <td className="p-4 text-center font-black text-emerald-600">{s.attendedClasses}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <Button size="sm" variant="outline" className="h-7 w-7 p-0 rounded-lg" onClick={() => { setCurrentSubject(s); setIsSubjectModalOpen(true); }}>
                                        <Edit className="w-3 h-3"/>
                                    </Button>
                                    <Button size="sm" variant="danger" className="h-7 w-7 p-0 rounded-lg" onClick={() => handleDeleteSubject(s.id)}>
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

  if (activeTab === 'exams') return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Exam Schedules</h2>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Manage exams, durations, and invigilation duties.</p>
           </div>
           <div className="flex flex-wrap gap-2">
               <Button variant="outline" onClick={handleExportExams} className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-600">
                   <Download className="w-3.5 h-3.5 mr-1.5"/> Master CSV
               </Button>
               <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                   <button onClick={() => setExamViewMode('LIST')} className={`p-2 rounded-lg transition-all ${examViewMode === 'LIST' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><List className="w-4 h-4"/></button>
                   <button onClick={() => setExamViewMode('CALENDAR')} className={`p-2 rounded-lg transition-all ${examViewMode === 'CALENDAR' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><CalendarIcon className="w-4 h-4"/></button>
               </div>
               <Button onClick={() => { setCurrentExam({}); setIsExamModalOpen(true); }} className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">
                 <Plus className="w-3.5 h-3.5 mr-1.5"/> Schedule New Exam
               </Button>
           </div>
       </div>

       {/* Enhanced Control Bar */}
       <div className="bg-white p-3 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 no-scrollbar">
               <div className="flex items-center gap-1.5 text-slate-400 mr-2 shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Status Filter</span>
               </div>
               {(['ALL', 'READY', 'COMPLETED', 'MISSED'] as const).map((s) => (
                  <button
                     key={s}
                     onClick={() => setFilterExamStatus(s)}
                     className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter whitespace-nowrap transition-all border ${
                        filterExamStatus === s ? 'bg-indigo-600 text-white shadow-lg border-indigo-600' : 'bg-white text-slate-500 hover:border-indigo-200 border-slate-100'
                     }`}
                  >
                     {s === 'ALL' ? 'View All' : s}
                  </button>
               ))}
            </div>
            
            <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-50">
               <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Sort By</span>
               </div>
               <div className="relative flex-1 xl:flex-none">
                  <select 
                     value={sortExamBy} 
                     onChange={(e) => setSortExamBy(e.target.value as SortExamKey)}
                     className="w-full xl:w-64 bg-slate-50 border border-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer pr-10"
                  >
                     <option value="DATE_ASC">Schedule: Soonest First</option>
                     <option value="DATE_DESC">Schedule: Latest First</option>
                     <option value="NAME_ASC">Name: Alphabetical (A-Z)</option>
                     <option value="NAME_DESC">Name: Alphabetical (Z-A)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <ChevronDown className="w-3.5 h-3.5" />
                  </div>
               </div>
            </div>
          </div>
       </div>

       {examViewMode === 'LIST' && (
           <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm animate-in fade-in duration-300">
               <div className="flex items-center gap-4">
                   <button 
                       onClick={toggleSelectAllExams}
                       className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 hover:text-indigo-600 transition-colors"
                   >
                       {selectedExamIds.length === exams.length ? <CheckSquare className="w-5 h-5 text-indigo-600"/> : <Square className="w-5 h-5"/>}
                       {selectedExamIds.length === 0 ? "Select All" : `Selected ${selectedExamIds.length}`}
                   </button>
                   {selectedExamIds.length > 0 && (
                       <Button 
                           size="sm" 
                           variant="secondary" 
                           className="h-8 px-4 text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700"
                           onClick={() => setIsBulkInvigilatorModalOpen(true)}
                       >
                           <Users className="w-3.5 h-3.5 mr-1.5"/> Batch Assign Invigilators
                       </Button>
                   )}
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{processedExams.length} Filtered Slots</span>
           </div>
       )}

       {examViewMode === 'LIST' ? (
           <Card className="rounded-[24px] overflow-hidden border-slate-100 shadow-sm animate-in fade-in duration-500 p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-[0.2em] font-black border-b border-slate-100">
                        <tr>
                            <th className="p-4 w-10 text-center">
                                <button onClick={toggleSelectAllExams}>
                                    {selectedExamIds.length === exams.length ? <CheckSquare className="w-4 h-4 text-indigo-600"/> : <Square className="w-4 h-4"/>}
                                </button>
                            </th>
                            <th className="p-4">Exam Nomenclature</th>
                            <th className="p-4">Schedule Date</th>
                            <th className="p-4">Status Node</th>
                            <th className="p-4">Reg. Deadline (Due)</th>
                            <th className="p-4">Venue & Node</th>
                            <th className="p-4">Load (Duration)</th>
                            <th className="p-4">Invigilators</th>
                            <th className="p-4 text-right">Terminals</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                        {processedExams.map(e => (
                            <tr key={e.id} className={`hover:bg-slate-50 transition-colors group ${selectedExamIds.includes(e.id) ? 'bg-indigo-50/50' : ''}`}>
                                <td className="p-4 text-center">
                                    <button onClick={() => toggleExamSelection(e.id)}>
                                        {selectedExamIds.includes(e.id) ? <CheckSquare className="w-4 h-4 text-indigo-600"/> : <Square className="w-4 h-4 text-slate-300 group-hover:text-indigo-400"/>}
                                    </button>
                                </td>
                                <td className="p-4 font-black text-slate-900 uppercase tracking-tight">{e.examName}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="w-3 h-3 text-indigo-500"/> {e.date}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge variant={getExamStatusVariant(e.status)} className="font-black border-none text-[8px] uppercase px-2 shadow-sm">
                                        {e.status}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-lg w-fit">
                                        <Timer className="w-3 h-3"/> {e.dueDate || 'TBD'}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                                        <MapPin className="w-3 h-3 text-indigo-400"/> {e.room} @ {e.time}
                                    </div>
                                </td>
                                <td className="p-4 font-black">{e.duration} MIN</td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {e.invigilators.length > 0 ? e.invigilators.map((inv, i) => (
                                            <Badge key={i} variant="neutral" className="text-[8px] py-0 px-1 border-none bg-slate-100">{inv.split(' ').pop()}</Badge>
                                        )) : <span className="text-[9px] text-slate-300 italic">None</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="outline" className="h-7 w-7 p-0 rounded-lg" onClick={() => handleEditExam(e)}>
                                            <Edit className="w-3 h-3"/>
                                        </Button>
                                        <Button size="sm" variant="danger" className="h-7 w-7 p-0 rounded-lg" onClick={() => handleDeleteExam(e.id)}>
                                            <Trash2 className="w-3 h-3"/>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {processedExams.length === 0 && (
                    <div className="text-center py-24 bg-white">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">No Examinations Configured for this View</h3>
                        {/* Fix: Removed call to non-existent setSearchQuery */}
                        <Button variant="outline" className="mt-6 h-8 text-[9px] font-black uppercase tracking-widest border-slate-100" onClick={() => { setFilterExamStatus('ALL'); }}>Reset Visual Filter</Button>
                    </div>
                )}
             </div>
           </Card>
       ) : (
           renderCalendar()
       )}

       {/* Bulk Invigilator Modal */}
       <Modal isOpen={isBulkInvigilatorModalOpen} onClose={() => setIsBulkInvigilatorModalOpen(false)} title="Batch Assign Invigilators">
            <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-800 font-medium">Assigning invigilators to <strong>{selectedExamIds.length}</strong> selected exam slots. This will add new names to existing lists.</p>
                </div>
                
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Add Invigilators</label>
                   <div className="p-3 border rounded-lg bg-slate-50 space-y-2">
                       <div className="flex items-center gap-2">
                           <UserIcon className="w-4 h-4 text-slate-400"/>
                           <input 
                                className="bg-transparent text-sm w-full outline-none placeholder:text-slate-400 font-bold" 
                                placeholder="Type faculty name and press Enter..." 
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.currentTarget.value.trim();
                                        if(val) {
                                            setBulkInvigilators(prev => [...prev, val]);
                                            e.currentTarget.value = '';
                                        }
                                    }
                                }}
                           />
                       </div>
                       <div className="flex flex-wrap gap-2">
                           {bulkInvigilators.map((inv, i) => (
                               <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-white border border-slate-200 text-xs font-black text-slate-700 uppercase tracking-tighter">
                                   {inv} <button onClick={() => setBulkInvigilators(prev => prev.filter((_, idx) => idx !== i))} className="ml-1 text-slate-400 hover:text-red-500 transition-colors"><X className="w-3 h-3"/></button>
                                </span>
                           ))}
                       </div>
                   </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <Button variant="secondary" className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsBulkInvigilatorModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-200" onClick={handleBulkAssignInvigilators} disabled={bulkInvigilators.length === 0}>Deploy Assignments</Button>
                </div>
            </div>
       </Modal>

       <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title={currentExam.id ? "Edit Exam Schedule" : "Schedule New Exam"}>
           <div className="space-y-4">
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Exam Name</label>
                   <input className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. CS202 Mid-Term" value={currentExam.examName || ''} onChange={e => setCurrentExam({...currentExam, examName: e.target.value})} />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Exam Date</label>
                       <input type="date" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={currentExam.date || ''} onChange={e => setCurrentExam({...currentExam, date: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Registration Due Date</label>
                       <input type="date" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={currentExam.dueDate || ''} onChange={e => setCurrentExam({...currentExam, dueDate: e.target.value})} />
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Start Time</label>
                       <input type="time" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={currentExam.time || ''} onChange={e => setCurrentExam({...currentExam, time: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Duration (mins)</label>
                       <div className="relative">
                           <input type="number" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="180" value={currentExam.duration || ''} onChange={e => setCurrentExam({...currentExam, duration: parseInt(e.target.value) || 0})} />
                           <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">MIN</span>
                       </div>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Status Node</label>
                       <select 
                           className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" 
                           value={currentExam.status || 'READY'} 
                           onChange={e => setCurrentExam({...currentExam, status: e.target.value as ExamStatus})}
                       >
                           <option value="READY">READY</option>
                           <option value="COMPLETED">COMPLETED</option>
                           <option value="MISSED">MISSED</option>
                       </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Room / Venue</label>
                       <input className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Examination Hall A" value={currentExam.room || ''} onChange={e => setCurrentExam({...currentExam, room: e.target.value})} />
                   </div>
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

               <Button className="w-full mt-4 h-12 font-black uppercase tracking-widest text-[10px]" onClick={handleSaveExam} disabled={!currentExam.examName || !currentExam.date}>Save Schedule Node</Button>
           </div>
       </Modal>
    </div>
  );

  return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-[0.2em] animate-pulse bg-slate-50 rounded-[40px] border border-dashed border-slate-200">Terminal Access Initializing...</div>;
};

export default AdminAcademics;
