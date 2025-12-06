
import React, { useState } from 'react';
import { User, Assignment, CourseMaterial } from '../../types';
import { MOCK_ASSIGNMENTS, MOCK_COURSE_MATERIALS, MOCK_EXAM_DUTIES, MOCK_SUBJECTS } from '../../constants';
import { Card, Button, Badge, Modal } from '../../components/UIComponents';
import { Plus, FileText, UploadCloud, Trash2, Video, Link as LinkIcon, File as FileIcon, Calendar, ArrowLeft, Download, Save, CheckCircle, Edit, MessageSquare, CheckCircle2, Search, Filter, X, Loader2 } from 'lucide-react';
import TeacherQuizzes from './TeacherQuizzes';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';

interface Props { user: User; activeTab: string; }

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedDate: string;
  status: 'PENDING' | 'GRADED' | 'LATE';
  fileUrl: string;
  marks: string;
  feedback: string;
}

const MOCK_SUBMISSIONS: Submission[] = [
  { id: 'sub1', studentName: 'Alice Johnson', studentId: 'S101', submittedDate: '2023-10-14', status: 'PENDING', fileUrl: 'assignment_v1.pdf', marks: '', feedback: '' },
  { id: 'sub2', studentName: 'Bob Smith', studentId: 'S102', submittedDate: '2023-10-15', status: 'LATE', fileUrl: 'lab_report_final.docx', marks: '', feedback: '' },
  { id: 'sub3', studentName: 'Charlie Brown', studentId: 'S103', submittedDate: '2023-10-12', status: 'GRADED', fileUrl: 'project_code.zip', marks: '18/20', feedback: 'Great work on the logic. Code structure is clean and well commented.' },
  { id: 'sub4', studentName: 'Diana Prince', studentId: 'S104', submittedDate: '2023-10-13', status: 'PENDING', fileUrl: 'analysis.pdf', marks: '', feedback: '' },
];

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
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [editingSubmission, setEditingSubmission] = useState<string | null>(null);
  const [gradeData, setGradeData] = useState({ marks: '', feedback: '' });
  const [submissionFilter, setSubmissionFilter] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateAssignment = async () => {
    setIsSaving(true);
    const newId = Math.random().toString();
    
    // 1. Local Update
    const assign: Assignment = {
      id: newId,
      title: newAssignment.title,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      status: 'PENDING',
      maxMarks: newAssignment.maxMarks
    };
    
    // 2. Supabase Update
    if (isSupabaseConfigured) {
        try {
            // For demo purposes, we assign this to the mock student 's1' (Alice)
            // In a real app, you would iterate through a list of student IDs in a class
            const { error } = await supabase.from('assignments').insert({
                title: newAssignment.title,
                subject: newAssignment.subject,
                due_date: newAssignment.dueDate,
                max_marks: newAssignment.maxMarks,
                status: 'PENDING',
                student_id: 's1', // Hardcoded to ensure visibility in Student View
                description: 'New assignment created by teacher.'
            });
            if (error) throw error;
            alert("Assignment published to Student Portal (Alice).");
        } catch (error: any) {
            console.error("Error creating assignment:", error);
            alert("Failed to sync with database, but added locally.");
        }
    } else {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    setAssignments([...assignments, assign]);
    setIsAssignmentModalOpen(false);
    setIsSaving(false);
    setNewAssignment({ title: '', subject: '', dueDate: '', maxMarks: 100 });
  };

  const handleUploadMaterial = () => {
    const mat: CourseMaterial = {
      id: Math.random().toString(),
      title: newMaterial.title,
      subject: newMaterial.subject || 'General',
      type: newMaterial.type,
      date: new Date().toISOString().split('T')[0],
      url: '#'
    };
    setMaterials([mat, ...materials]);
    setIsMaterialModalOpen(false);
    setNewMaterial({ title: '', subject: '', type: 'PDF' }); // Reset form
  };

  const handleDeleteMaterial = (id: string) => {
      if(window.confirm('Are you sure you want to delete this material?')) {
          setMaterials(materials.filter(m => m.id !== id));
      }
  }

  const openGrading = async (assignment: Assignment) => {
      setSelectedAssignment(assignment);
      
      if (isSupabaseConfigured) {
          // Fetch real submissions for this assignment title/subject from DB
          // Note: In this simple schema, we are looking for records that match the assignment details
          // In a proper relational DB, we would query by assignment_id foreign key
          const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('title', assignment.title)
            .neq('status', 'PENDING'); // Get submitted/graded ones

          if (data && data.length > 0) {
              const mappedSubmissions: Submission[] = data.map((d: any) => ({
                  id: d.id,
                  studentName: 'Student', // In real app, join with profiles
                  studentId: d.student_id,
                  submittedDate: d.submitted_date || d.due_date,
                  status: d.status,
                  fileUrl: d.file_url || 'No file',
                  marks: d.marks || '',
                  feedback: d.feedback || ''
              }));
              setSubmissions(mappedSubmissions);
          } else {
              // Fallback if no real data found or error
              setSubmissions(MOCK_SUBMISSIONS); 
          }
      } else {
          setSubmissions(MOCK_SUBMISSIONS);
      }
      
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
                      marks: gradeData.marks,
                      feedback: gradeData.feedback
                  })
                  .eq('id', submissionId);
              
              if (error) throw error;
          } catch (err) {
              console.error("Error updating grade:", err);
              alert("Failed to save grade to database.");
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

  if (activeTab === 'internal_exams') {
      return <TeacherQuizzes />;
  }

  if (activeTab === 'assignments') {
      if (selectedAssignment) {
          const filteredSubmissions = submissions.filter(s => {
              const matchesFilter = submissionFilter === 'ALL' 
                  ? true 
                  : submissionFilter === 'GRADED' ? s.status === 'GRADED' : (s.status === 'PENDING' || s.status === 'LATE');
              const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesFilter && matchesSearch;
          });

          const gradedCount = submissions.filter(s => s.status === 'GRADED').length;
          const totalCount = submissions.length;
          const progress = totalCount > 0 ? Math.round((gradedCount / totalCount) * 100) : 0;

          return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header with Back and Summary */}
                <div className="flex flex-col gap-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(null)} className="w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assignments
                    </Button>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{selectedAssignment.title}</h2>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <span className="bg-slate-100 px-2 py-0.5 rounded">{selectedAssignment.subject}</span>
                                <span>•</span>
                                <Calendar className="w-3 h-3 text-slate-400"/> Due: {selectedAssignment.dueDate}
                            </p>
                        </div>
                        <div className="w-full md:w-64">
                            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                <span>Grading Progress</span>
                                <span>{gradedCount}/{totalCount}</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        {(['ALL', 'PENDING', 'GRADED'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setSubmissionFilter(f)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${submissionFilter === f ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {f === 'ALL' ? 'All Submissions' : f === 'PENDING' ? 'Needs Grading' : 'Graded'}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search student..." 
                            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Submissions List */}
                <div className="grid gap-4">
                    {filteredSubmissions.map(sub => (
                        <Card key={sub.id} className={`transition-all duration-200 ${editingSubmission === sub.id ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:border-indigo-200'}`}>
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                {/* Student & File Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                {sub.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{sub.studentName}</h4>
                                                <p className="text-xs text-slate-500 font-medium">ID: {sub.studentId}</p>
                                            </div>
                                        </div>
                                        <Badge variant={sub.status === 'GRADED' ? 'success' : sub.status === 'LATE' ? 'error' : 'warning'}>{sub.status}</Badge>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-700 border border-slate-200 w-fit cursor-pointer hover:bg-slate-100 max-w-md truncate">
                                            <FileIcon className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" /> 
                                            <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:underline hover:text-indigo-600">{sub.fileUrl.split('/').pop()}</a>
                                        </div>
                                        <div className="text-xs text-slate-400">Submitted: {sub.submittedDate}</div>
                                    </div>
                                </div>

                                {/* Grading Interface */}
                                <div className="w-full lg:w-[450px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                                    {sub.status === 'GRADED' && editingSubmission !== sub.id ? (
                                        <div className="space-y-3 bg-green-50/50 p-4 rounded-xl border border-green-100">
                                            <div className="flex justify-between items-center pb-2 border-b border-green-200/50">
                                                <span className="text-xs font-bold text-green-700 uppercase tracking-wider flex items-center">
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5"/> Graded
                                                </span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="font-black text-green-700 text-xl">{sub.marks}</span>
                                                    {selectedAssignment.maxMarks && <span className="text-xs text-green-600 font-medium">/ {selectedAssignment.maxMarks}</span>}
                                                </div>
                                            </div>
                                            {sub.feedback ? (
                                                <div className="relative">
                                                    <MessageSquare className="w-3 h-3 text-green-400 absolute top-0.5 left-0" />
                                                    <p className="text-sm text-green-800 italic pl-5 leading-relaxed">"{sub.feedback}"</p>
                                                </div>
                                            ) : <span className="text-xs text-green-600 italic">No feedback provided.</span>}
                                            <Button size="sm" variant="outline" className="w-full bg-white text-green-700 border-green-200 hover:bg-green-100 h-8 text-xs" onClick={() => { setEditingSubmission(sub.id); setGradeData({ marks: sub.marks, feedback: sub.feedback }); }}>
                                                <Edit className="w-3 h-3 mr-1.5"/> Edit Grade
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className={`space-y-4 p-4 rounded-xl border transition-colors ${editingSubmission === sub.id ? 'bg-white border-indigo-100' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex justify-between items-center">
                                                <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center"><Edit className="w-3 h-3 mr-1.5"/> Grading</h5>
                                                {editingSubmission !== sub.id && <span className="text-[10px] text-slate-400">Click below to grade</span>}
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="col-span-1">
                                                    <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase">Marks</label>
                                                    <div className="relative">
                                                        <input 
                                                            className="w-full border border-slate-300 p-2 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                            placeholder="0"
                                                            value={editingSubmission === sub.id ? gradeData.marks : ''}
                                                            onFocus={() => { if(editingSubmission !== sub.id) { setEditingSubmission(sub.id); setGradeData({ marks: sub.marks, feedback: sub.feedback }); }}}
                                                            onChange={e => setGradeData({ ...gradeData, marks: e.target.value })}
                                                        />
                                                        {selectedAssignment.maxMarks && <span className="absolute -bottom-4 right-0 text-[9px] text-slate-400">Max: {selectedAssignment.maxMarks}</span>}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase">Feedback</label>
                                                    <textarea 
                                                        className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-[38px] min-h-[38px] focus:min-h-[80px] transition-all" 
                                                        rows={1}
                                                        placeholder="Enter feedback..."
                                                        value={editingSubmission === sub.id ? gradeData.feedback : ''}
                                                        onFocus={() => { if(editingSubmission !== sub.id) { setEditingSubmission(sub.id); setGradeData({ marks: sub.marks, feedback: sub.feedback }); }}}
                                                        onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {editingSubmission === sub.id && (
                                                <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200 pt-1">
                                                    <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => handleSaveGrade(sub.id)} isLoading={isSaving}>
                                                        <CheckCircle className="w-3 h-3 mr-1.5"/> Save Grade
                                                    </Button>
                                                    <Button size="sm" variant="secondary" onClick={() => setEditingSubmission(null)}>
                                                        <X className="w-3 h-3"/>
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
                        <div className="text-center py-12 text-slate-500">
                            <p>No submissions found matching filters.</p>
                        </div>
                    )}
                </div>
            </div>
          );
      }

      return (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-900">Assignments</h2><Button onClick={() => setIsAssignmentModalOpen(true)}><Plus className="w-4 h-4 mr-2"/> Create</Button></div>
           <div className="grid gap-4">
             {assignments.map(a => (
               <Card key={a.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-indigo-200 transition-colors group">
                 <div>
                     <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">{a.title}</h3>
                     <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                         <span className="bg-slate-100 px-2 py-0.5 rounded">{a.subject}</span>
                         <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> Due: {a.dueDate}</span>
                         {a.maxMarks && <span className="text-xs bg-indigo-50 text-indigo-700 px-1.5 rounded border border-indigo-100">Max: {a.maxMarks}</span>}
                     </div>
                 </div>
                 <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <Badge variant={a.status === 'PENDING' ? 'warning' : 'success'}>{a.status}</Badge>
                    <Button variant="outline" size="sm" onClick={() => openGrading(a)}>Grade Submissions</Button>
                 </div>
               </Card>
             ))}
           </div>
    
           <Modal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} title="Create Assignment">
             <div className="space-y-4">
               <input placeholder="Title" className="w-full border p-2 rounded" onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} />
               <input placeholder="Subject" className="w-full border p-2 rounded" onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})} />
               <input type="date" className="w-full border p-2 rounded" onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
               <input type="number" placeholder="Max Marks (e.g. 100)" className="w-full border p-2 rounded" onChange={e => setNewAssignment({...newAssignment, maxMarks: parseInt(e.target.value)})} />
               <Button className="w-full" onClick={handleCreateAssignment} isLoading={isSaving}>Create & Publish</Button>
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
            <p className="text-sm text-slate-500">Upload and manage study resources for your subjects.</p>
          </div>
          <Button onClick={() => setIsMaterialModalOpen(true)}><UploadCloud className="w-4 h-4 mr-2"/> Upload Material</Button>
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
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900">{m.title}</h4>
                        <div className="flex items-center gap-2">
                             <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">View</Button>
                             <button onClick={() => handleDeleteMaterial(m.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded">{m.subject}</span>
                        <span>•</span>
                        <span>Uploaded: {m.date}</span>
                    </div>
                  </div>
               </div>
            </Card>
         ))}
         {materials.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
               <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500 font-medium">No materials uploaded yet.</p>
            </div>
         )}
       </div>

       <Modal isOpen={isMaterialModalOpen} onClose={() => setIsMaterialModalOpen(false)} title="Upload Course Material">
         <div className="space-y-4">
           <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Resource Title</label>
               <input placeholder="e.g. Chapter 1 Notes" className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} />
           </div>
           
           <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Subject</label>
               <select className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={newMaterial.subject} onChange={e => setNewMaterial({...newMaterial, subject: e.target.value})}>
                   <option value="">Select Subject...</option>
                   {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name} ({s.code})</option>)}
                   <option value="General">General</option>
               </select>
           </div>
           
           <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Type</label>
               <select className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={newMaterial.type} onChange={e => setNewMaterial({...newMaterial, type: e.target.value as any})}>
                 <option value="PDF">PDF Document</option>
                 <option value="VIDEO">Video Lecture</option>
                 <option value="LINK">External Link</option>
               </select>
           </div>

           <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">File / URL</label>
               <div className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                   <p className="text-xs text-slate-500">Click to upload file or paste URL here</p>
               </div>
           </div>

           <Button className="w-full mt-2" onClick={handleUploadMaterial} disabled={!newMaterial.title || !newMaterial.subject}>Upload</Button>
         </div>
       </Modal>
    </div>
  );

  return (
     <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-900">Exams & Duties</h2>
        <div className="grid gap-4">
           {MOCK_EXAM_DUTIES.map(d => (
             <Card key={d.id} className="flex items-center justify-between">
                <div><h3 className="font-semibold">{d.examName}</h3><div className="flex items-center text-sm text-slate-500 mt-1"><Calendar className="w-3 h-3 mr-1"/> {d.date} • {d.time}</div></div>
                <Badge variant="neutral">{d.role}</Badge>
             </Card>
           ))}
        </div>
     </div>
  );
};
export default TeacherAcademics;
