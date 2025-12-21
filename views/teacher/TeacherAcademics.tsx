import React, { useState, useEffect } from 'react';
import { User, Assignment, CourseMaterial } from '../../types';
import { MOCK_ASSIGNMENTS, MOCK_COURSE_MATERIALS, MOCK_EXAM_DUTIES, MOCK_SUBJECTS } from '../../constants';
import { Card, Button, Badge, Modal } from '../../components/UIComponents';
// Added Clock icon to lucide-react imports to fix "Cannot find name 'Clock'"
import { Plus, FileText, UploadCloud, Trash2, Video, Link as LinkIcon, File as FileIcon, Calendar, ArrowLeft, Download, Save, CheckCircle, Edit, MessageSquare, CheckCircle2, Search, Filter, X, Loader2, User as UserIcon, Clock } from 'lucide-react';
import TeacherQuizzes from './TeacherQuizzes';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';

interface Props { user: User; activeTab: string; }

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';
  fileUrl: string;
  marks: string;
  feedback: string;
}

const TeacherAcademics: React.FC<Props> = ({ activeTab }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [materials, setMaterials] = useState<CourseMaterial[]>(MOCK_COURSE_MATERIALS);

  // Modal States
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: '', dueDate: '', maxMarks: 100 });
  const [newMaterial, setNewMaterial] = useState({ title: '', subject: '', type: 'PDF' as const });
  const [isSaving, setIsSaving] = useState(false);

  // Grading State
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<string | null>(null);
  const [gradeData, setGradeData] = useState({ marks: '', feedback: '' });
  const [submissionFilter, setSubmissionFilter] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch assignments from Supabase on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .order('due_date', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: Assignment[] = data.map(d => ({
            id: d.id,
            title: d.title,
            subject: d.subject,
            dueDate: d.due_date,
            status: d.status,
            maxMarks: d.max_marks,
            description: d.description
          }));
          setAssignments(mapped);
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async () => {
    setIsSaving(true);
    
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase.from('assignments').insert({
                title: newAssignment.title,
                subject: newAssignment.subject,
                due_date: newAssignment.dueDate,
                max_marks: newAssignment.maxMarks,
                status: 'PENDING',
                student_id: 's1', // For demo: assign to mock student Alice
                description: 'New assignment created by teacher.'
            }).select();

            if (error) throw error;
            
            if (data) {
                const assign: Assignment = {
                    id: data[0].id,
                    title: data[0].title,
                    subject: data[0].subject,
                    dueDate: data[0].due_date,
                    status: data[0].status,
                    maxMarks: data[0].max_marks
                };
                setAssignments([assign, ...assignments]);
            }
            alert("Assignment published successfully.");
        } catch (error: any) {
            console.error("Error creating assignment:", error);
            alert("Failed to create assignment.");
        }
    } else {
        const mock: Assignment = {
          id: Math.random().toString(),
          ...newAssignment,
          status: 'PENDING'
        };
        setAssignments([mock, ...assignments]);
    }

    setIsAssignmentModalOpen(false);
    setIsSaving(false);
    setNewAssignment({ title: '', subject: '', dueDate: '', maxMarks: 100 });
  };

  const openGrading = async (assignment: Assignment) => {
      setSelectedAssignment(assignment);
      setIsLoadingSubmissions(true);
      
      if (isSupabaseConfigured) {
          try {
              // Fetch submissions where title matches
              const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .eq('title', assignment.title)
                .neq('status', 'PENDING'); // Only show submitted or graded

              if (error) throw error;

              if (data) {
                  const mapped: Submission[] = data.map((d: any) => ({
                      id: d.id,
                      studentName: 'Student Alice', // Mock name link
                      studentId: d.student_id,
                      submittedDate: d.submitted_date || 'N/A',
                      status: d.status,
                      fileUrl: d.file_url || '',
                      marks: d.marks?.toString() || '',
                      feedback: d.feedback || ''
                  }));
                  setSubmissions(mapped);
              }
          } catch (e) {
              console.error("Fetch submissions error:", e);
          }
      } else {
          // Mock data if Supabase not configured
          setSubmissions([
            { id: 'sub1', studentName: 'Alice Johnson', studentId: 's1', submittedDate: '2023-10-14', status: 'SUBMITTED', fileUrl: 'assignment_v1.pdf', marks: '', feedback: '' },
            { id: 'sub2', studentName: 'Bob Smith', studentId: 's2', submittedDate: '2023-10-15', status: 'LATE', fileUrl: 'lab_report.pdf', marks: '', feedback: '' },
          ]);
      }
      
      setIsLoadingSubmissions(false);
      setSubmissionFilter('ALL');
      setSearchTerm('');
  };

  const handleSaveGrade = async (submissionId: string) => {
      setIsSaving(true);
      
      if (isSupabaseConfigured) {
          try {
              const { error } = await supabase
                  .from('assignments')
                  .update({
                      status: 'GRADED',
                      marks: parseFloat(gradeData.marks),
                      feedback: gradeData.feedback
                  })
                  .eq('id', submissionId);
              
              if (error) throw error;
          } catch (err) {
              console.error("Error updating grade:", err);
              alert("Failed to save grade.");
          }
      }

      setSubmissions(prev => prev.map(sub => 
          sub.id === submissionId 
          ? { ...sub, status: 'GRADED', marks: gradeData.marks, feedback: gradeData.feedback } 
          : sub
      ));
      
      setIsSaving(false);
      setEditingSubmission(null);
      setGradeData({ marks: '', feedback: '' });
  };

  // Added handleDeleteMaterial to fix "Cannot find name 'handleDeleteMaterial'"
  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Added handleUploadMaterial to fix "Cannot find name 'handleUploadMaterial'"
  const handleUploadMaterial = () => {
    if (!newMaterial.title || !newMaterial.subject) return;
    const material: CourseMaterial = {
      id: Math.random().toString(),
      title: newMaterial.title,
      subject: newMaterial.subject,
      type: newMaterial.type,
      date: new Date().toISOString().split('T')[0],
      url: '#'
    };
    setMaterials([material, ...materials]);
    setIsMaterialModalOpen(false);
    setNewMaterial({ title: '', subject: '', type: 'PDF' });
  };

  if (activeTab === 'internal_exams') {
      return <TeacherQuizzes />;
  }

  if (activeTab === 'assignments') {
      if (selectedAssignment) {
          const filteredSubmissions = submissions.filter(s => {
              const matchesFilter = submissionFilter === 'ALL' 
                  ? true 
                  : submissionFilter === 'GRADED' ? s.status === 'GRADED' : s.status !== 'GRADED';
              const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesFilter && matchesSearch;
          });

          const gradedCount = submissions.filter(s => s.status === 'GRADED').length;
          const totalCount = submissions.length;
          const progress = totalCount > 0 ? Math.round((gradedCount / totalCount) * 100) : 0;

          return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col gap-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(null)} className="w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assignments
                    </Button>
                    
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-900">{selectedAssignment.title}</h2>
                                <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-none">{selectedAssignment.subject}</Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400"/> Due: {selectedAssignment.dueDate}
                                <span className="text-slate-300">|</span>
                                <span>Max Marks: {selectedAssignment.maxMarks}</span>
                            </p>
                        </div>
                        <div className="w-full md:w-72">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                <span>Grading Progress</span>
                                <span className="text-indigo-600">{gradedCount} of {totalCount} Done</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out" style={{width: `${progress}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
                        {(['ALL', 'PENDING', 'GRADED'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setSubmissionFilter(f)}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all ${submissionFilter === f ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {f === 'ALL' ? 'All' : f === 'PENDING' ? 'To Grade' : 'Graded'}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by student name or ID..." 
                            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoadingSubmissions ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="font-medium">Loading submissions...</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredSubmissions.map(sub => (
                            <Card key={sub.id} className={`transition-all duration-200 ${editingSubmission === sub.id ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:border-indigo-200'}`}>
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                                                    <UserIcon className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{sub.studentName}</h4>
                                                    <p className="text-xs text-slate-500 font-bold uppercase">ID: {sub.studentId}</p>
                                                </div>
                                            </div>
                                            <Badge variant={sub.status === 'GRADED' ? 'success' : sub.status === 'LATE' ? 'error' : 'warning'}>
                                                {sub.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            {sub.fileUrl ? (
                                                <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center bg-indigo-50 px-3 py-2 rounded-lg text-sm text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                                    <FileIcon className="w-4 h-4 mr-2" /> 
                                                    <span className="font-semibold">View Submission</span>
                                                </a>
                                            ) : (
                                                <div className="flex items-center text-slate-400 text-sm px-3 py-2 bg-slate-50 rounded-lg italic">
                                                    No file uploaded
                                                </div>
                                            )}
                                            <div className="text-xs text-slate-400 font-medium">
                                                Submitted: {sub.submittedDate}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-[450px] bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                        {sub.status === 'GRADED' && editingSubmission !== sub.id ? (
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center">
                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-500"/> Result
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-black text-slate-900 text-xl">{sub.marks}</span>
                                                        <span className="text-xs text-slate-400 font-medium">/ {selectedAssignment.maxMarks}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100">
                                                    "{sub.feedback || 'No feedback provided.'}"
                                                </div>
                                                <Button size="sm" variant="outline" className="w-full h-8 text-xs font-bold" onClick={() => { setEditingSubmission(sub.id); setGradeData({ marks: sub.marks, feedback: sub.feedback }); }}>
                                                    <Edit className="w-3 h-3 mr-1.5"/> Update Grade
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-4 gap-4">
                                                    <div className="col-span-1">
                                                        <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">Score</label>
                                                        <input 
                                                            type="number"
                                                            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-black text-center focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                            placeholder="0"
                                                            value={editingSubmission === sub.id ? gradeData.marks : ''}
                                                            onChange={e => { if(editingSubmission !== sub.id) setEditingSubmission(sub.id); setGradeData({ ...gradeData, marks: e.target.value }); }}
                                                        />
                                                    </div>
                                                    <div className="col-span-3">
                                                        <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">Instructor Feedback</label>
                                                        <textarea 
                                                            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-[42px] focus:h-24 transition-all" 
                                                            placeholder="Great work! Next time focus on..."
                                                            value={editingSubmission === sub.id ? gradeData.feedback : ''}
                                                            onChange={e => { if(editingSubmission !== sub.id) setEditingSubmission(sub.id); setGradeData({ ...gradeData, feedback: e.target.value }); }}
                                                        />
                                                    </div>
                                                </div>

                                                {editingSubmission === sub.id && (
                                                    <div className="flex gap-2 animate-in slide-in-from-top-1 duration-200">
                                                        <Button size="sm" className="flex-1 shadow-md shadow-indigo-100" onClick={() => handleSaveGrade(sub.id)} isLoading={isSaving}>
                                                            <Save className="w-3.5 h-3.5 mr-2"/> Save Grade
                                                        </Button>
                                                        <Button size="sm" variant="secondary" onClick={() => setEditingSubmission(null)}>
                                                            <X className="w-3.5 h-3.5"/>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {filteredSubmissions.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No submissions found matching filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
          );
      }

      return (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
               <Button onClick={() => setIsAssignmentModalOpen(true)} className="shadow-lg shadow-indigo-100">
                   <Plus className="w-4 h-4 mr-2"/> Create New
               </Button>
           </div>
           <div className="grid gap-4">
             {assignments.map(a => (
               <Card key={a.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:border-indigo-200 transition-all">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 mt-1">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{a.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded">{a.subject}</span>
                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> Due: {a.dueDate}</span>
                        </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                    <Badge variant={a.status === 'PENDING' ? 'warning' : 'success'}>{a.status}</Badge>
                    <Button variant="outline" size="sm" onClick={() => openGrading(a)} className="flex-1 sm:flex-none">
                        Grade Submissions
                    </Button>
                 </div>
               </Card>
             ))}
           </div>
    
           <Modal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} title="Create New Assignment">
             <div className="space-y-4">
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Assignment Title</label>
                   <input placeholder="e.g. Chapter 4 Integration Practice" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} />
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Subject</label>
                   <select className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})}>
                       <option value="">Select Subject...</option>
                       {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                   </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Due Date</label>
                       <input type="date" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Max Marks</label>
                       <input type="number" placeholder="100" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNewAssignment({...newAssignment, maxMarks: parseInt(e.target.value)})} />
                   </div>
               </div>
               <div className="pt-2">
                   <Button className="w-full py-3" onClick={handleCreateAssignment} isLoading={isSaving}>Publish Assignment</Button>
               </div>
             </div>
           </Modal>
        </div>
      );
  }

  if (activeTab === 'materials') return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Course Materials</h2>
            <p className="text-sm text-slate-500">Upload study resources for your students.</p>
          </div>
          <Button onClick={() => setIsMaterialModalOpen(true)} className="shadow-lg shadow-indigo-100">
              <UploadCloud className="w-4 h-4 mr-2"/> Upload Material
          </Button>
       </div>
       
       <div className="grid gap-4">
         {materials.map(m => (
            <Card key={m.id} className="group hover:border-indigo-200 transition-colors">
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg text-slate-600 transition-colors ${m.type === 'PDF' ? 'bg-red-50 text-red-600' : m.type === 'VIDEO' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {m.type === 'PDF' && <FileIcon className="w-6 h-6"/>}
                    {m.type === 'VIDEO' && <Video className="w-6 h-6"/>}
                    {m.type === 'LINK' && <LinkIcon className="w-6 h-6"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 truncate pr-4">{m.title}</h4>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button size="sm" variant="outline" className="h-8">View</Button>
                             <button onClick={() => handleDeleteMaterial(m.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
                        <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase">{m.subject}</span>
                        <span>•</span>
                        <span>Uploaded: {m.date}</span>
                    </div>
                  </div>
               </div>
            </Card>
         ))}
       </div>

       <Modal isOpen={isMaterialModalOpen} onClose={() => setIsMaterialModalOpen(false)} title="Upload Course Material">
         <div className="space-y-4">
           <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase">Resource Title</label>
               <input placeholder="e.g. Chapter 1 Notes" className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                   <select className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={newMaterial.subject} onChange={e => setNewMaterial({...newMaterial, subject: e.target.value})}>
                       <option value="">Select...</option>
                       {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                   </select>
               </div>
               <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                   <select className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={newMaterial.type} onChange={e => setNewMaterial({...newMaterial, type: e.target.value as any})}>
                     <option value="PDF">PDF</option>
                     <option value="VIDEO">Video</option>
                     <option value="LINK">Link</option>
                   </select>
               </div>
           </div>

           <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">File / Link</label>
               <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all">
                   <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                   <p className="text-xs text-slate-500 font-medium">Click to select file or paste URL here</p>
               </div>
           </div>

           <Button className="w-full py-3" onClick={handleUploadMaterial} disabled={!newMaterial.title}>Confirm Upload</Button>
         </div>
       </Modal>
    </div>
  );

  return (
     <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-900">Exams & Duties</h2>
        <div className="grid gap-4">
           {MOCK_EXAM_DUTIES.map(d => (
             <Card key={d.id} className="flex items-center justify-between border-l-4 border-l-indigo-600">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">{d.examName}</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1 gap-3 font-medium">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5"/> {d.date}</span>
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5"/> {d.time}</span>
                        <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1.5"/> Room: {d.room}</span>
                    </div>
                </div>
                <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold">{d.role}</Badge>
             </Card>
           ))}
        </div>
     </div>
  );
};
export default TeacherAcademics;