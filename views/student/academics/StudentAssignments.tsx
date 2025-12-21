import React, { useState, useMemo } from 'react';
import { Assignment } from '../../../types';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { 
  UploadCloud, Clock, Plus, Calendar, FileText, CheckCircle, 
  AlertCircle, File, Download, Paperclip, CheckCircle2, 
  Filter, ArrowUpDown, ChevronDown, BookOpen, Timer, 
  TrendingUp, Star, Info, Award, ShieldCheck, Zap, Layers, ChevronRight, Search, X, Megaphone, UserCheck, SearchX
} from 'lucide-react';
import { storage, databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, BUCKET_ID, ID } from '../../../appwriteClient';

interface Props {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

type FilterStatus = 'ALL' | Assignment['status'];
type FilterComplexity = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
type SortKey = 'DUE_DATE_ASC' | 'DUE_DATE_DESC' | 'SUBJECT' | 'MARKS_DESC' | 'COMPLEXITY' | 'STATUS_ASC' | 'STATUS_DESC';

const StudentAssignments: React.FC<Props> = ({ assignments, setAssignments }) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Teacher Simulation State
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherNewAssignment, setTeacherNewAssignment] = useState({
    title: '',
    subject: '',
    dueDate: '',
    maxMarks: 100,
    description: '',
    complexity: 'MEDIUM' as const
  });

  // State for Creating Personal Assignments
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ 
    title: '', 
    subject: '', 
    dueDate: '', 
    description: '', 
    maxMarks: 100, 
    complexity: 'MEDIUM' as const 
  });

  // Filtering, Sorting & Search State
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [filterComplexity, setFilterComplexity] = useState<FilterComplexity>('ALL');
  const [sortBy, setSortBy] = useState<SortKey>('DUE_DATE_ASC');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateAssignment = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const assignment: Assignment = {
      id: newId,
      title: newAssignment.title,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      description: newAssignment.description,
      status: 'PENDING',
      maxMarks: newAssignment.maxMarks,
      complexity: newAssignment.complexity
    };
    setAssignments([assignment, ...assignments]);
    setIsCreateModalOpen(false);
    setNewAssignment({ title: '', subject: '', dueDate: '', description: '', maxMarks: 100, complexity: 'MEDIUM' });
  };

  const handleTeacherBroadcast = () => {
    if (!teacherNewAssignment.title || !teacherNewAssignment.dueDate) return;
    
    const newId = 'OFF-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const assignment: Assignment = {
      id: newId,
      title: teacherNewAssignment.title,
      subject: teacherNewAssignment.subject,
      dueDate: teacherNewAssignment.dueDate,
      description: teacherNewAssignment.description,
      status: 'PENDING',
      maxMarks: teacherNewAssignment.maxMarks,
      complexity: teacherNewAssignment.complexity
    };

    setAssignments([assignment, ...assignments]);
    setIsTeacherModalOpen(false);
    setTeacherNewAssignment({ title: '', subject: '', dueDate: '', maxMarks: 100, description: '', complexity: 'MEDIUM' });
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionFile) return;
    setIsSubmitting(true);
    
    const today = new Date().toISOString().split('T')[0];
    let fileUrl = submissionFile.name;

    if (isAppwriteConfigured) {
        try {
            const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), submissionFile);
            const urlData = storage.getFileView(BUCKET_ID, uploadedFile.$id);
            fileUrl = urlData.href;

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.ASSIGNMENTS,
                selectedAssignment.id,
                { status: 'SUBMITTED', submitted_date: today, file_url: fileUrl }
            );
        } catch (error: any) {
            console.error("Submission error:", error);
            fileUrl = "(Local Demo) " + submissionFile.name;
        }
    } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        fileUrl = "(Local Demo) " + submissionFile.name;
    }

    setAssignments(prev => prev.map(a => a.id === selectedAssignment.id ? { 
        ...a, 
        status: 'SUBMITTED',
        submittedDate: today,
        fileUrl: fileUrl
    } : a));

    setIsSubmitting(false);
    setIsSubmitModalOpen(false);
    setSubmissionFile(null);
  };

  const handleDownloadArtifact = (url?: string) => {
    if (!url) return;
    if (url.startsWith('http')) {
        window.open(url, '_blank');
    } else {
        alert(`Simulating artifact download: ${url.replace('(Local Demo) ', '')}`);
    }
  };

  const getStatusVariant = (status: Assignment['status']) => {
    switch (status) {
      case 'GRADED': return 'success';
      case 'SUBMITTED': return 'neutral';
      case 'OVERDUE': return 'error';
      default: return 'warning';
    }
  };

  const getComplexityVariant = (complexity?: Assignment['complexity']) => {
    switch (complexity) {
        case 'HIGH': return 'error';
        case 'MEDIUM': return 'warning';
        case 'LOW': return 'success';
        default: return 'neutral';
    }
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const target = new Date(dueDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Expired', color: 'text-red-600', bg: 'bg-red-50' };
    if (diffDays === 0) return { label: 'Today', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (diffDays === 1) return { label: 'Tomorrow', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: `${diffDays} Days`, color: 'text-slate-600', bg: 'bg-slate-50' };
  };

  const processedAssignments = useMemo(() => {
    let result = assignments;
    if (filterStatus !== 'ALL') {
      result = result.filter(a => a.status === filterStatus);
    }
    if (filterComplexity !== 'ALL') {
      result = result.filter(a => a.complexity === filterComplexity);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.subject.toLowerCase().includes(q)
      );
    }
    const complexityRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const statusRank: Record<Assignment['status'], number> = { PENDING: 0, OVERDUE: 1, SUBMITTED: 2, GRADED: 3 };

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'DUE_DATE_ASC': return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'DUE_DATE_DESC': return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'SUBJECT': return a.subject.localeCompare(b.subject);
        case 'MARKS_DESC': return (b.maxMarks || 0) - (a.maxMarks || 0);
        case 'COMPLEXITY': return (complexityRank[b.complexity || 'MEDIUM']) - (complexityRank[a.complexity || 'MEDIUM']);
        case 'STATUS_ASC': return statusRank[a.status] - statusRank[b.status];
        case 'STATUS_DESC': return statusRank[b.status] - statusRank[a.status];
        default: return 0;
      }
    });
    return result;
  }, [assignments, filterStatus, filterComplexity, sortBy, searchQuery]);

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(assignments.map(a => a.subject))).slice(0, 4);
  }, [assignments]);

  const statusOptions: { label: string; value: FilterStatus }[] = [
    { label: 'View All', value: 'ALL' },
    { label: 'Awaiting', value: 'PENDING' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Graded', value: 'GRADED' },
  ];

  const complexityOptions: { label: string; value: FilterComplexity }[] = [
    { label: 'All Complexity', value: 'ALL' },
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('ALL');
    setFilterComplexity('ALL');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Assignment Portal</h2>
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="text-indigo-600 flex items-center"><Zap className="w-2.5 h-2.5 mr-1"/> {assignments.filter(a => a.status === 'PENDING').length} Action Required</span>
                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                <button 
                  onClick={() => setIsTeacherMode(!isTeacherMode)}
                  className={`flex items-center gap-1 transition-colors ${isTeacherMode ? 'text-purple-600' : 'hover:text-indigo-500'}`}
                >
                  <UserCheck className="w-2.5 h-2.5" /> 
                  {isTeacherMode ? 'TEACHER ACCESS ACTIVE' : 'SWITCH TO TEACHER VIEW'}
                </button>
             </div>
          </div>
          <div className="flex gap-2">
            {isTeacherMode && (
                <Button onClick={() => setIsTeacherModalOpen(true)} className="rounded-xl bg-slate-900 text-white shadow-xl font-black uppercase tracking-[0.2em] text-[9px] h-10 px-6 hover:scale-105 active:scale-95 transition-all">
                    <Megaphone className="w-3.5 h-3.5 mr-1.5 text-indigo-400"/> Broadcast Module
                </Button>
            )}
            <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-xl shadow-xl shadow-indigo-100 font-black uppercase tracking-[0.2em] text-[9px] h-10 px-6 hover:scale-105 active:scale-95 transition-all">
                <Plus className="w-3.5 h-3.5 mr-1.5"/> Manual Task
            </Button>
          </div>
       </div>

       <div className="bg-white p-3 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="space-y-3">
             <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                 <input 
                   type="text"
                   placeholder="Search by assignment title or academic subject..."
                   className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl outline-none text-[11px] font-bold transition-all shadow-inner placeholder:text-slate-300"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 {searchQuery && (
                     <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                         <X className="w-3.5 h-3.5" />
                     </button>
                 )}
             </div>
             
             {/* Quick subject filters */}
             <div className="flex flex-wrap items-center gap-2 px-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mr-1">Quick Search:</span>
                {uniqueSubjects.map(sub => (
                   <button 
                     key={sub}
                     onClick={() => setSearchQuery(sub)}
                     className="text-[8px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg uppercase tracking-tighter transition-colors border border-indigo-100/50"
                   >
                     {sub}
                   </button>
                ))}
             </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 no-scrollbar">
               <div className="flex items-center gap-1.5 text-slate-400 mr-2 shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Status</span>
               </div>
               {statusOptions.map((opt) => (
                  <button
                     key={opt.value}
                     onClick={() => setFilterStatus(opt.value)}
                     className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter whitespace-nowrap transition-all border ${
                        filterStatus === opt.value ? 'bg-indigo-600 text-white shadow-lg border-indigo-600' : 'bg-white text-slate-500 hover:border-indigo-200 border-slate-100'
                     }`}
                  >
                     {opt.label}
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 no-scrollbar">
               <div className="flex items-center gap-1.5 text-slate-400 mr-2 shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Complexity</span>
               </div>
               {complexityOptions.map((opt) => (
                  <button
                     key={opt.value}
                     onClick={() => setFilterComplexity(opt.value)}
                     className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter whitespace-nowrap transition-all border ${
                        filterComplexity === opt.value ? 'bg-indigo-600 text-white shadow-lg border-indigo-600' : 'bg-white text-slate-500 hover:border-indigo-200 border-slate-100'
                     }`}
                  >
                     {opt.label}
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-50">
               <div className="relative flex-1 xl:flex-none">
                  <select 
                     value={sortBy} 
                     onChange={(e) => setSortBy(e.target.value as SortKey)}
                     className="w-full xl:w-64 bg-slate-50 border border-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer pr-10"
                  >
                     <option value="DUE_DATE_ASC">Deadline: Soonest First</option>
                     <option value="DUE_DATE_DESC">Deadline: Long-term</option>
                     <option value="STATUS_ASC">Lifecycle: Awaiting First</option>
                     <option value="STATUS_DESC">Lifecycle: Completed First</option>
                     <option value="SUBJECT">Alphabetical: Subject</option>
                     <option value="MARKS_DESC">Weightage: High to Low</option>
                     <option value="COMPLEXITY">Cognitive Load: High to Low</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <ChevronDown className="w-3.5 h-3.5" />
                  </div>
               </div>
            </div>
          </div>
       </div>

       <div className="grid gap-6">
          {processedAssignments.map((assign, idx) => {
             const timeInfo = getTimeRemaining(assign.dueDate);
             const isUrgent = (timeInfo.label.includes('Days') && parseInt(timeInfo.label) <= 3) || timeInfo.label === 'Today' || timeInfo.label === 'Tomorrow';
             const isOfficial = assign.id.startsWith('OFF-');

             return (
             <Card key={assign.id} className="group hover:border-indigo-400 transition-all shadow-sm hover:shadow-xl rounded-[32px] p-1 relative overflow-hidden animate-in slide-in-from-top-4" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex flex-col lg:flex-row">
                    <div className={`hidden lg:block w-2 rounded-full m-3 ${assign.status === 'GRADED' ? 'bg-emerald-500' : assign.status === 'OVERDUE' ? 'bg-red-500' : assign.status === 'SUBMITTED' ? 'bg-indigo-500' : 'bg-amber-400'}`}></div>
                    
                    <div className="flex-1 p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                             <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-none font-black text-[8px] uppercase px-2 py-1 tracking-[0.2em]">{assign.subject}</Badge>
                                    <Badge variant={getStatusVariant(assign.status)} className="font-black text-[8px] uppercase px-2 py-1 tracking-[0.2em] border-none shadow-sm">{assign.status}</Badge>
                                    {isUrgent && assign.status === 'PENDING' && (
                                        <Badge className="bg-red-600 text-white border-none font-black text-[8px] uppercase px-2 py-1 tracking-[0.2em] animate-pulse">URGENT</Badge>
                                    )}
                                    {isOfficial && (
                                        <Badge className="bg-slate-900 text-indigo-400 border-none font-black text-[8px] uppercase px-2 py-1 tracking-[0.2em] flex items-center gap-1">
                                            <ShieldCheck className="w-2 h-2" /> OFFICIAL
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tighter leading-tight uppercase">
                                    {assign.title}
                                </h3>
                                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> REF: {assign.id.toUpperCase()}</span>
                                    <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-indigo-400" /> Complexity: {assign.complexity || 'MEDIUM'}</span>
                                </div>
                             </div>
                             
                             <div className="flex flex-col items-end shrink-0">
                                <div className={`p-3 rounded-2xl ${timeInfo.bg} border border-white shadow-inner flex flex-col items-center justify-center min-w-[100px] group-hover:scale-105 transition-transform duration-500`}>
                                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${timeInfo.color} mb-0.5`}>{timeInfo.label}</span>
                                    <span className="text-slate-900 font-black text-xs">{assign.dueDate}</span>
                                </div>
                             </div>
                        </div>

                        {assign.description && (
                            <div className="text-xs text-slate-600 bg-slate-50/70 p-4 rounded-[20px] border border-slate-100 leading-relaxed font-medium relative group-hover:bg-white transition-colors duration-500">
                                {assign.description}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Priority Weight</span>
                                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {assign.maxMarks || '100'} PTS</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Cognitive Tier</span>
                                <Badge variant={getComplexityVariant(assign.complexity)} className="font-black text-[8px] uppercase px-2 shadow-sm border-none">{assign.complexity || 'MEDIUM'}</Badge>
                            </div>
                            {assign.submittedDate && (
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Dispatch Date</span>
                                    <span className="text-xs font-black text-indigo-600 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> {assign.submittedDate}</span>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">GPA Impact</span>
                                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-indigo-500" /> High Potential</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 gap-4">
                             <div className="flex items-center gap-4">
                                 <button className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                     <Info className="w-3 h-3 mr-1.5"/> Technical Manual
                                 </button>
                             </div>
                             <div className="w-full sm:w-auto">
                                {assign.status === 'PENDING' || assign.status === 'OVERDUE' ? (
                                    <Button onClick={() => { setSelectedAssignment(assign); setIsSubmitModalOpen(true); }} className={`w-full sm:w-auto h-10 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 ${assign.status === 'OVERDUE' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300'}`}>
                                        <UploadCloud className="w-4 h-4 mr-2"/> DISPATCH SUBMISSION
                                    </Button>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400">
                                            <CheckCircle className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                {assign.status === 'GRADED' ? 'EVALUATION COMPLETE' : 'In Verification Queue'}
                                            </span>
                                        </div>
                                        {assign.fileUrl && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-9 px-4 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-black text-[9px] uppercase tracking-widest shadow-sm"
                                                onClick={() => handleDownloadArtifact(assign.fileUrl)}
                                            >
                                                <Download className="w-3.5 h-3.5 mr-1.5" /> Download Artifact
                                            </Button>
                                        )}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
             </Card>
             );
          })}
          
          {processedAssignments.length === 0 && (
             <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100 animate-in fade-in duration-500">
                <div className="p-8 bg-slate-50 rounded-full mb-6">
                   <SearchX className="w-16 h-16 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Assignments Found</h3>
                <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest max-w-[300px] text-center leading-relaxed">
                   The current search and filter parameters did not match any institutional records.
                </p>
                <Button 
                   variant="outline" 
                   onClick={resetFilters} 
                   className="mt-10 font-black uppercase tracking-[0.2em] text-[9px] px-10 h-11 rounded-2xl border-slate-200"
                >
                   Clear All Filters
                </Button>
             </div>
          )}
       </div>

       {/* Teacher Modal: Create Official Assignment */}
       <Modal isOpen={isTeacherModalOpen} onClose={() => setIsTeacherModalOpen(false)} title="Faculty Module Dispatcher">
          <div className="space-y-4">
             <div className="bg-slate-900 p-6 rounded-[24px] relative overflow-hidden mb-2">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Megaphone className="w-20 h-20 rotate-12" /></div>
                <div className="relative z-10">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Official Protocol</p>
                    <h4 className="text-white font-black text-lg uppercase tracking-tighter">Broadcast New Assignment</h4>
                </div>
             </div>

             <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Assignment Title</label>
                 <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm placeholder:text-slate-300" 
                    placeholder="e.g. Distributed Ledger Systems - Phase 1"
                    value={teacherNewAssignment.title}
                    onChange={(e) => setTeacherNewAssignment({...teacherNewAssignment, title: e.target.value})}
                 />
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Academic Subject</label>
                     <input 
                        type="text" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm" 
                        placeholder="Computer Science"
                        value={teacherNewAssignment.subject}
                        onChange={(e) => setTeacherNewAssignment({...teacherNewAssignment, subject: e.target.value})}
                     />
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Submission Deadline</label>
                     <input 
                        type="date" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm" 
                        value={teacherNewAssignment.dueDate}
                        onChange={(e) => setTeacherNewAssignment({...teacherNewAssignment, dueDate: e.target.value})}
                     />
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Max Marks</label>
                     <input 
                        type="number" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm" 
                        value={teacherNewAssignment.maxMarks}
                        onChange={(e) => setTeacherNewAssignment({...teacherNewAssignment, maxMarks: parseInt(e.target.value) || 0})}
                     />
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Complexity</label>
                     <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm"
                        value={teacherNewAssignment.complexity}
                        onChange={(e) => setTeacherNewAssignment({...teacherNewAssignment, complexity: e.target.value as any})}
                     >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                     </select>
                 </div>
             </div>

             <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Detailed Description</label>
                 <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-medium text-slate-900 transition-all text-sm placeholder:text-slate-300 h-32 resize-none" 
                    placeholder="Provide full instructions and grading criteria..."
                    value={teacherNewAssignment.description}
                    onChange={(e) => setTeacherNewAssignment({...teacherNewAssignment, description: e.target.value})}
                 />
             </div>

             <Button className="w-full h-14 rounded-[20px] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-100 mt-2 hover:bg-indigo-700 transition-all" onClick={handleTeacherBroadcast} disabled={!teacherNewAssignment.title || !teacherNewAssignment.dueDate}>
                 INITIALIZE BROADCAST
             </Button>
          </div>
       </Modal>

       {/* Submit Modal */}
       <Modal isOpen={isSubmitModalOpen} onClose={() => !isSubmitting && setIsSubmitModalOpen(false)} title={`Secure Dispatch Center`}>
         <form onSubmit={handleAssignmentSubmit} className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-[24px] relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-32 h-32 rotate-12" /></div>
               <div className="relative z-10">
                   <h4 className="font-black text-xl tracking-tighter uppercase mb-1.5 text-white">{selectedAssignment?.title}</h4>
                   <div className="flex flex-wrap items-center gap-3 text-[9px] font-black uppercase tracking-widest">
                        <span className="text-indigo-400 bg-white/5 px-2 py-1 rounded">{selectedAssignment?.subject}</span>
                        <span className="flex items-center text-red-400">
                            <Timer className="w-3.5 h-3.5 mr-1.5"/> Deadline: {selectedAssignment?.dueDate}
                        </span>
                   </div>
               </div>
            </div>
            
            <div className="space-y-3">
               <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50/30 hover:border-indigo-500 cursor-pointer transition-all relative group shadow-inner">
                  <div className="p-4 bg-white rounded-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl border border-slate-100">
                     <UploadCloud className="h-8 w-8 text-indigo-600 group-hover:text-white" />
                  </div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Select Artifacts for Upload</p>
                  <p className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-[0.2em]">PDF, ZIP up to 100MB</p>
                  <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setSubmissionFile(e.target.files ? e.target.files[0] : null)} />
               </div>
               
               {submissionFile && (
                  <div className="bg-indigo-600 text-white p-4 rounded-2xl flex items-center justify-between animate-in zoom-in-95 duration-300 shadow-2xl shadow-indigo-200">
                     <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20"><File className="w-5 h-5"/></div>
                        <span className="font-black text-xs truncate max-w-[180px]">{submissionFile.name}</span>
                     </div>
                     <Badge variant="success" className="bg-white text-indigo-700 border-none font-black text-[8px]">{(submissionFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  </div>
               )}
            </div>

            <Button type="submit" className="w-full h-14 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:scale-[1.01] active:scale-95 transition-all bg-indigo-600 text-white" isLoading={isSubmitting} disabled={!submissionFile || isSubmitting}>
                {isSubmitting ? 'DISPATCHING...' : 'FINALIZE SUBMISSION'}
            </Button>
         </form>
       </Modal>

       {/* Personal Create Modal */}
       <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Strategic Task Planner">
          <div className="space-y-4">
             <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Task Nomenclature</label>
                 <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm placeholder:text-slate-300" 
                     placeholder="e.g. Distributed Systems Lab"
                     value={newAssignment.title}
                     onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                 />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Max Marks</label>
                     <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm" 
                         placeholder="100"
                         value={newAssignment.maxMarks}
                         onChange={(e) => setNewAssignment({...newAssignment, maxMarks: parseInt(e.target.value) || 0})}
                     />
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Deadline</label>
                     <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm" 
                         value={newAssignment.dueDate}
                         onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                     />
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Module Focus</label>
                     <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm placeholder:text-slate-300" 
                         placeholder="e.g. Computer Science"
                         value={newAssignment.subject}
                         onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                     />
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Complexity</label>
                     <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900 transition-all text-sm"
                        value={newAssignment.complexity}
                        onChange={(e) => setNewAssignment({...newAssignment, complexity: e.target.value as any})}
                     >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                     </select>
                 </div>
             </div>

             <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1.5">Task Instructions</label>
                 <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[18px] focus:bg-white focus:border-indigo-500 outline-none font-medium text-slate-900 transition-all text-sm placeholder:text-slate-300 resize-none h-32" 
                     placeholder="Enter detailed description and submission requirements..."
                     value={newAssignment.description}
                     onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                 />
             </div>

             <Button className="w-full h-14 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 mt-2" onClick={handleCreateAssignment} disabled={!newAssignment.title || !newAssignment.dueDate}>
                 ADD TO ROADMAP
             </Button>
          </div>
       </Modal>
    </div>
  );
};

export default StudentAssignments;