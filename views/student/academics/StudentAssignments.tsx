
import React, { useState, useMemo } from 'react';
import { Assignment } from '../../../types';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { 
  UploadCloud, Calendar, FileText, CheckCircle2, 
  Download, Filter, Search, SearchX, ChevronDown, ChevronUp, MessageSquare, Info, Plus, BookOpen, Layers
} from 'lucide-react';
import { storage, databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, BUCKET_ID, ID } from '../../../appwriteClient';
import { MOCK_SUBJECTS } from '../../../constants';

interface Props {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

type FilterStatus = 'ALL' | Assignment['status'];

const StudentAssignments: React.FC<Props> = ({ assignments, setAssignments }) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Create Assignment State
  const [newAssignmentData, setNewAssignmentData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    maxMarks: 100,
    description: '',
    complexity: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  });

  // Search & Filter State
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAssignmentData,
      status: 'PENDING'
    };
    setAssignments(prev => [newEntry, ...prev]);
    setIsCreateModalOpen(false);
    setNewAssignmentData({
      title: '',
      subject: '',
      dueDate: '',
      maxMarks: 100,
      description: '',
      complexity: 'MEDIUM'
    });
  };

  const handleDownloadArtifact = (url?: string) => {
    if (!url) return;
    if (url.startsWith('http')) {
        window.open(url, '_blank');
    } else {
        alert(`Simulating artifact download: ${url.replace('(Local Demo) ', '')}`);
    }
  };

  const processedAssignments = useMemo(() => {
    let result = assignments;
    if (filterStatus !== 'ALL') {
      result = result.filter(a => a.status === filterStatus);
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [assignments, filterStatus, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Assignment Portal</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{assignments.filter(a => a.status === 'PENDING').length} Active Deliverables</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-slate-200 font-black uppercase text-[10px] h-10 px-6">Archive</Button>
            <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-xl shadow-xl shadow-indigo-100 font-black uppercase text-[10px] h-10 px-6 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> New Task
            </Button>
          </div>
       </div>

       <div className="bg-white p-4 rounded-[32px] border-2 border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by assignment title..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl outline-none text-sm font-bold transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
               <div className="flex items-center gap-1.5 text-slate-400 mr-2 shrink-0">
                  <Filter className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
               </div>
               {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map((s) => (
                  <button
                     key={s}
                     onClick={() => setFilterStatus(s)}
                     className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-tighter whitespace-nowrap transition-all border-2 ${
                        filterStatus === s ? 'bg-indigo-600 text-white shadow-lg border-indigo-600' : 'bg-white text-slate-500 hover:border-indigo-200 border-slate-100'
                     }`}
                  >
                     {s}
                  </button>
               ))}
          </div>
       </div>

       <div className="grid gap-8">
          {processedAssignments.map((assign, idx) => {
             const isExpanded = expandedId === assign.id;
             return (
             <Card key={assign.id} className={`group border-2 transition-all shadow-sm hover:shadow-2xl rounded-[40px] p-0 overflow-hidden animate-in slide-in-from-top-4 ${isExpanded ? 'border-indigo-500 ring-4 ring-indigo-500/5' : 'border-slate-50 hover:border-indigo-300'}`} style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="p-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1 space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-none font-black text-[9px] uppercase px-3 py-1.5 tracking-[0.2em]">{assign.subject}</Badge>
                                <Badge className={`font-black text-[9px] uppercase px-3 py-1.5 tracking-[0.2em] border-none shadow-sm ${assign.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : assign.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-500 text-white'}`}>{assign.status}</Badge>
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tighter leading-tight uppercase">{assign.title}</h3>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed line-clamp-1">{assign.description || 'No description provided.'}</p>
                            
                            <div className="flex flex-wrap gap-8 pt-2">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Deadline</span>
                                    <span className="text-sm font-black text-slate-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> {assign.dueDate}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Max Weight</span>
                                    <span className="text-sm font-black text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> {assign.maxMarks} PTS</span>
                                </div>
                                {assign.submittedDate && (
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Received On</span>
                                        <span className="text-sm font-black text-indigo-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {assign.submittedDate}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 lg:w-72">
                            {assign.status === 'PENDING' || assign.status === 'OVERDUE' ? (
                                <Button onClick={() => { setSelectedAssignment(assign); setIsSubmitModalOpen(true); }} className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-all">
                                    <UploadCloud className="w-5 h-5 mr-3"/> Submit Artifact
                                </Button>
                            ) : assign.status === 'SUBMITTED' ? (
                                <div className="space-y-3">
                                    <Button 
                                        onClick={() => { setSelectedAssignment(assign); setIsSubmitModalOpen(true); }} 
                                        className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-indigo-500 hover:bg-indigo-600 shadow-lg transition-all"
                                    >
                                        <UploadCloud className="w-4 h-4 mr-2"/> Upload Submission
                                    </Button>
                                    {assign.fileUrl && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-12 rounded-2xl border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest shadow-sm"
                                            onClick={() => handleDownloadArtifact(assign.fileUrl)}
                                        >
                                            <Download className="w-4 h-4 mr-2" /> Download My File
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-500">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Grading Finalized</span>
                                    </div>
                                    {assign.fileUrl && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-12 rounded-2xl border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest shadow-sm"
                                            onClick={() => handleDownloadArtifact(assign.fileUrl)}
                                        >
                                            <Download className="w-4 h-4 mr-2" /> Download Final Copy
                                        </Button>
                                    )}
                                </div>
                            )}
                            <button 
                              onClick={() => toggleExpand(assign.id)}
                              className="flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              {isExpanded ? <><ChevronUp className="w-4 h-4" /> Collapse Details</> : <><ChevronDown className="w-4 h-4" /> View Details</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t-2 border-slate-100 p-8 animate-in slide-in-from-top-4 duration-500">
                      <div className="grid lg:grid-cols-2 gap-8">
                          <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                                  <Info className="w-4 h-4" /> Full Description
                              </h4>
                              <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
                                  <p className="text-sm text-slate-700 font-bold leading-relaxed whitespace-pre-line">
                                      {assign.description || 'No additional instructions provided by the instructor.'}
                                  </p>
                              </div>
                          </div>
                          <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                                  <MessageSquare className="w-4 h-4" /> Instructor Feedback
                              </h4>
                              <div className={`p-6 rounded-3xl border-2 shadow-sm ${assign.feedback ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100 border-dashed'}`}>
                                  {assign.feedback ? (
                                      <div className="space-y-3">
                                          <p className="text-sm text-indigo-900 font-black italic leading-relaxed">
                                              "{assign.feedback}"
                                          </p>
                                          <div className="flex items-center gap-2 pt-2 border-t border-indigo-100">
                                              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white uppercase">RS</div>
                                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Prof. Robert Smith</span>
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                                          <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                                          <p className="text-[10px] font-black uppercase tracking-widest">No feedback published yet</p>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
                )}
             </Card>
          )})}
          
          {processedAssignments.length === 0 && (
             <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[60px] border-4 border-dashed border-slate-100 animate-in fade-in">
                <SearchX className="w-20 h-20 text-slate-200 mb-6" />
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No deliverables found</h3>
                <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Adjust your filters to see more results</p>
                <Button variant="outline" onClick={() => {setSearchQuery(''); setFilterStatus('ALL');}} className="mt-10 font-black uppercase tracking-widest text-[10px] h-12 px-12 rounded-2xl border-slate-200 shadow-sm">Clear Filters</Button>
             </div>
          )}
       </div>

       {/* Create Assignment Modal (Instructor Mode) */}
       <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Initialize New Deliverable">
         <form onSubmit={handleCreateAssignment} className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h4 className="font-black text-2xl tracking-tighter uppercase mb-2 relative z-10">Task Designer</h4>
                <div className="flex items-center gap-2 relative z-10">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Faculty Administrative Protocol</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignment Nomenclature</label>
                  <input 
                    required
                    placeholder="e.g. Neural Networks Lab" 
                    className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    value={newAssignmentData.title}
                    onChange={e => setNewAssignmentData({...newAssignmentData, title: e.target.value})}
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Node</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      required
                      className="w-full pl-11 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold appearance-none bg-white"
                      value={newAssignmentData.subject}
                      onChange={e => setNewAssignmentData({...newAssignmentData, subject: e.target.value})}
                    >
                      <option value="">Select Domain...</option>
                      {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="date" 
                      className="w-full pl-11 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                      value={newAssignmentData.dueDate}
                      onChange={e => setNewAssignmentData({...newAssignmentData, dueDate: e.target.value})}
                    />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Score Weight</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="number"
                      placeholder="100" 
                      className="w-full pl-4 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                      value={newAssignmentData.maxMarks}
                      onChange={e => setNewAssignmentData({...newAssignmentData, maxMarks: parseInt(e.target.value) || 0})}
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Complexity Vector</label>
               <div className="flex gap-3">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewAssignmentData({...newAssignmentData, complexity: level})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${newAssignmentData.complexity === level ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {level}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Technical Brief</label>
               <textarea 
                  required
                  rows={4} 
                  placeholder="Provide comprehensive instructions for the deliverables..." 
                  className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                  value={newAssignmentData.description}
                  onChange={e => setNewAssignmentData({...newAssignmentData, description: e.target.value})}
               />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)} className="flex-1 h-16 rounded-[28px] text-sm font-black uppercase tracking-[0.2em]">
                  Abort
              </Button>
              <Button type="submit" className="flex-1 h-16 rounded-[28px] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700">
                  Deploy Task
              </Button>
            </div>
         </form>
       </Modal>

       {/* Submit Modal (Student Mode) */}
       <Modal isOpen={isSubmitModalOpen} onClose={() => !isSubmitting && setIsSubmitModalOpen(false)} title="Secure Artifact Upload">
         <form onSubmit={handleAssignmentSubmit} className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h4 className="font-black text-2xl tracking-tighter uppercase mb-2 relative z-10">{selectedAssignment?.title}</h4>
                <div className="flex items-center gap-2 relative z-10">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Encrypted Direct Link Protocol</p>
                </div>
            </div>
            
            <div className="space-y-4">
               <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-16 flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50 hover:border-indigo-500 cursor-pointer transition-all relative group shadow-inner">
                  <div className="p-6 bg-slate-50 rounded-3xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl border-2 border-slate-100 group-hover:border-indigo-500">
                     <UploadCloud className="h-10 w-10 text-indigo-600 group-hover:text-white" />
                  </div>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Choose Artifact</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-[0.2em]">PDF, ZIP, or DOCX • MAX 50MB</p>
                  <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setSubmissionFile(e.target.files ? e.target.files[0] : null)} />
               </div>
               
               {submissionFile && (
                  <div className="bg-indigo-600 p-5 rounded-3xl flex items-center justify-between border-2 border-indigo-500 animate-in zoom-in-95 shadow-xl shadow-indigo-100">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-xl"><FileText className="w-6 h-6 text-white"/></div>
                        <span className="font-black text-sm text-white truncate max-w-[200px] uppercase tracking-tight">{submissionFile.name}</span>
                     </div>
                     <Badge className="bg-white text-indigo-700 border-none font-black text-[10px] px-3 py-1">{(submissionFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  </div>
               )}
            </div>

            <Button type="submit" className="w-full h-16 rounded-[28px] text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]" isLoading={isSubmitting} disabled={!submissionFile || isSubmitting}>
                {isSubmitting ? 'DISPATCHING...' : 'FINALIZE DISPATCH'}
            </Button>
         </form>
       </Modal>
    </div>
  );
};

export default StudentAssignments;
