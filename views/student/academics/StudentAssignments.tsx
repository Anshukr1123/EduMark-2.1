
import React, { useState } from 'react';
import { Assignment } from '../../../types';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { UploadCloud, Clock, Plus, Calendar, FileText, CheckCircle, AlertCircle, File, Download, Paperclip, CheckCircle2 } from 'lucide-react';
import { account, storage, databases, isAppwriteConfigured, DATABASE_ID, COLLECTIONS, BUCKET_ID, ID } from '../../../appwriteClient';

interface Props {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

const StudentAssignments: React.FC<Props> = ({ assignments, setAssignments }) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New State for Creating Personal Assignments
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: '', dueDate: '', description: '' });

  // State for Feedback Modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackAssignment, setFeedbackAssignment] = useState<Assignment | null>(null);

  const handleCreateAssignment = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const assignment: Assignment = {
      id: newId,
      title: newAssignment.title,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      description: newAssignment.description,
      status: 'PENDING'
    };
    setAssignments([assignment, ...assignments]);
    setIsCreateModalOpen(false);
    setNewAssignment({ title: '', subject: '', dueDate: '', description: '' });
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionFile) return;
    setIsSubmitting(true);
    
    const today = new Date().toISOString().split('T')[0];
    let fileUrl = submissionFile.name;

    // 1. Upload to Appwrite Storage
    if (isAppwriteConfigured) {
        try {
            // Upload
            const uploadedFile = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                submissionFile
            );

            // Get Public URL
            const urlData = storage.getFileView(BUCKET_ID, uploadedFile.$id);
            fileUrl = urlData.href;

            // 2. Update Assignment Record
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.ASSIGNMENTS,
                selectedAssignment.id,
                {
                    status: 'SUBMITTED',
                    submitted_date: today,
                    file_url: fileUrl
                }
            );

            alert("Assignment submitted successfully!");

        } catch (error: any) {
            console.error("Submission error:", error);
            alert("Error submitting assignment: " + error.message);
            // Fallback for demo UX so it doesn't just hang
            fileUrl = "(Local Demo) " + submissionFile.name;
        }
    } else {
        // Mock delay for offline
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert("Assignment Submitted Locally (Demo Mode)");
    }

    // 3. Update Local State
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

  const getStatusVariant = (status: Assignment['status']) => {
    switch (status) {
      case 'GRADED':
        return 'success';
      case 'SUBMITTED':
        return 'neutral';
      case 'OVERDUE':
        return 'error';
      case 'PENDING':
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
             <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
             <div className="text-sm text-slate-500 mt-1">
                <span className="font-bold text-slate-900">{assignments.filter(a => a.status === 'PENDING').length}</span> Pending Submission
             </div>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm" variant="outline">
             <Plus className="w-4 h-4 mr-2"/> Add Personal Task
          </Button>
       </div>

       <div className="grid gap-6">
          {assignments.map(assign => (
             <Card key={assign.id} className="group hover:border-indigo-200 transition-all shadow-sm hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Status Indicator Bar */}
                    <div className={`hidden md:block w-1.5 self-stretch rounded-full ${assign.status === 'GRADED' ? 'bg-green-500' : assign.status === 'OVERDUE' ? 'bg-red-500' : assign.status === 'SUBMITTED' ? 'bg-indigo-500' : 'bg-yellow-500'}`}></div>
                    
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                    {assign.title}
                                    {assign.status === 'GRADED' && <CheckCircle className="w-4 h-4 text-green-500"/>}
                                    {assign.status === 'OVERDUE' && <AlertCircle className="w-4 h-4 text-red-500"/>}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{assign.subject}</span>
                                    <span>•</span>
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> Due: {assign.dueDate}</span>
                                    {assign.submittedDate && (
                                        <>
                                            <span>•</span>
                                            <span className="text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Submitted: {assign.submittedDate}</span>
                                        </>
                                    )}
                                </div>
                             </div>
                             <Badge variant={getStatusVariant(assign.status)}>{assign.status}</Badge>
                        </div>

                        {assign.description && (
                            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="leading-relaxed">{assign.description}</p>
                            </div>
                        )}

                        {/* Graded Result Section */}
                        {assign.status === 'GRADED' && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-green-700 uppercase tracking-wide flex items-center">
                                            <CheckCircle2 className="w-3 h-3 mr-1.5"/> Graded & Reviewed
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-3xl font-black text-green-700 leading-none tracking-tight">{assign.marks}</span>
                                        {assign.maxMarks && <span className="text-[10px] font-bold text-green-600 uppercase">Max: {assign.maxMarks}</span>}
                                    </div>
                                </div>
                                {assign.feedback && (
                                    <div className="relative mt-2 bg-white/60 p-3 rounded-lg border border-green-100/50">
                                        <p className="text-sm text-slate-700 italic leading-relaxed">"{assign.feedback}"</p>
                                        <div className="absolute -top-2 left-4 w-4 h-4 bg-white rotate-45 border-t border-l border-green-100/50 transform"></div>
                                    </div>
                                )}
                                <div className="mt-3 flex justify-end">
                                     <Button size="sm" variant="outline" className="text-xs h-8 bg-white text-green-700 border-green-200 hover:bg-green-100" onClick={() => { setFeedbackAssignment(assign); setIsFeedbackModalOpen(true); }}>
                                        View Full Details
                                     </Button>
                                </div>
                            </div>
                        )}

                        {/* Actions Footer (Hidden if Graded, as we show the result card instead) */}
                        {assign.status !== 'GRADED' && (
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-4">
                                 <div className="flex gap-4">
                                     <div className="flex items-center text-xs text-indigo-600 font-medium cursor-pointer hover:underline">
                                         <FileText className="w-3 h-3 mr-1"/> View Guidelines
                                     </div>
                                     {assign.status === 'SUBMITTED' && assign.fileUrl && (
                                         <div className="flex items-center text-xs text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded max-w-[200px]">
                                             <Paperclip className="w-3 h-3 mr-1 flex-shrink-0"/> 
                                             <span className="truncate">{assign.fileUrl.split('/').pop()}</span>
                                         </div>
                                     )}
                                 </div>

                                 <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    {assign.status === 'PENDING' && (
                                        <Button onClick={() => { setSelectedAssignment(assign); setIsSubmitModalOpen(true); }} size="sm">
                                            <UploadCloud className="w-4 h-4 mr-2"/> Submit Work
                                        </Button>
                                    )}
                                 </div>
                            </div>
                        )}
                    </div>
                </div>
             </Card>
          ))}
       </div>

       {/* Submit Modal */}
       <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title={`Submit Assignment`}>
         <form onSubmit={handleAssignmentSubmit} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
               <h4 className="font-bold text-slate-900 mb-2">{selectedAssignment?.title}</h4>
               <div className="text-sm text-slate-600 mb-3">{selectedAssignment?.description}</div>
               <div className="flex justify-between items-center text-xs">
                  <p className="text-slate-500"><span className="font-bold">Subject:</span> {selectedAssignment?.subject}</p>
                  <p className="flex items-center font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                     <Clock className="w-3 h-3 mr-1"/> Deadline: {selectedAssignment?.dueDate}
                  </p>
               </div>
            </div>
            
            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Upload Work</label>
               <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors relative group">
                  <div className="p-3 bg-indigo-50 rounded-full mb-3 group-hover:bg-indigo-100 transition-colors">
                     <UploadCloud className="h-6 w-6 text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to browse or drag file</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP up to 10MB</p>
                  <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setSubmissionFile(e.target.files ? e.target.files[0] : null)} />
               </div>
               {submissionFile && (
                  <div className="text-sm bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-2 rounded flex items-center justify-between">
                     <span className="flex items-center"><File className="w-4 h-4 mr-2"/> {submissionFile.name}</span>
                     <span className="text-xs opacity-70">{(submissionFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
               )}
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Comments (Optional)</label>
                <textarea className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" rows={2} placeholder="Add any notes for the instructor..."></textarea>
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={!submissionFile || isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Submit Assignment'}
            </Button>
         </form>
       </Modal>

       {/* Create Personal Task Modal */}
       <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add Personal Task">
          <div className="space-y-4">
             <p className="text-sm text-slate-500">Create a new task to track your personal study goals or offline assignments.</p>
             <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Task Title</label>
                 <input type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                     placeholder="e.g. Complete Project Report"
                     value={newAssignment.title}
                     onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                 />
             </div>
             <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Subject / Category</label>
                 <input type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                     placeholder="e.g. Data Structures"
                     value={newAssignment.subject}
                     onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                 />
             </div>
             <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Description</label>
                 <textarea className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                     placeholder="Details about the task..."
                     rows={3}
                     value={newAssignment.description}
                     onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                 />
             </div>
             <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Due Date</label>
                 <input type="date" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                     value={newAssignment.dueDate}
                     onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                 />
             </div>
             <Button className="w-full mt-2" onClick={handleCreateAssignment} disabled={!newAssignment.title || !newAssignment.dueDate}>
                 Add Task
             </Button>
          </div>
       </Modal>

       {/* Feedback Modal */}
       <Modal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} title="Assignment Feedback">
          {feedbackAssignment && (
              <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h3 className="font-bold text-lg text-slate-900">{feedbackAssignment.title}</h3>
                      <p className="text-sm text-slate-500">{feedbackAssignment.subject}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-200 rounded-xl bg-white text-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
                          <p className="text-3xl font-black text-green-600">{feedbackAssignment.marks}</p>
                          {feedbackAssignment.maxMarks && <p className="text-xs text-slate-400 mt-1">out of {feedbackAssignment.maxMarks}</p>}
                      </div>
                       <div className="p-4 border border-slate-200 rounded-xl bg-white text-center flex flex-col justify-center items-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                          <Badge variant="success">GRADED</Badge>
                      </div>
                  </div>
      
                  <div>
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500"/> Instructor Feedback
                      </h4>
                      <div className="p-5 bg-indigo-50 text-indigo-900 rounded-xl text-sm leading-relaxed border border-indigo-100 relative">
                          <div className="absolute top-[-6px] left-6 w-3 h-3 bg-indigo-50 border-t border-l border-indigo-100 transform rotate-45"></div>
                          {feedbackAssignment.feedback || "No written feedback provided by the instructor."}
                      </div>
                  </div>
      
                  <div className="flex justify-end pt-2">
                      <Button onClick={() => setIsFeedbackModalOpen(false)}>Close</Button>
                  </div>
              </div>
          )}
       </Modal>
    </div>
  );
};

export default StudentAssignments;
