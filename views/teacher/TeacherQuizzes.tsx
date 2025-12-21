
import React, { useState } from 'react';
import { Card, Button, Modal, Badge } from '../../components/UIComponents';
import { Plus, Trash2, CheckSquare, BookOpen, Layers, ClipboardList, Target, Clock } from 'lucide-react';

const TeacherQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState([
    { id: 'q1', title: 'Data Structures Quiz 1', subject: 'Data Structures', questions: 10, status: 'PUBLISHED' },
    { id: 'q2', title: 'Calculus Mid-Term', subject: 'Calculus', questions: 20, status: 'DRAFT' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', subject: '', questions: '' });

  const handleCreate = () => {
    if (!newQuiz.title || !newQuiz.subject) return;

    const quiz = {
      id: Math.random().toString(36).substr(2, 9),
      title: newQuiz.title,
      subject: newQuiz.subject,
      questions: parseInt(newQuiz.questions) || 0,
      status: 'DRAFT'
    };

    setQuizzes([quiz, ...quizzes]);
    setIsModalOpen(false);
    setNewQuiz({ title: '', subject: '', questions: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Internal Assessment Hub</h2>
          <p className="text-slate-500 text-xs mt-1.5 font-bold uppercase tracking-[0.2em]">Manage digital quizzes and terminal evaluations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-xl shadow-indigo-100 font-black uppercase tracking-[0.15em] text-[10px] h-11 px-6 hover:scale-105 active:scale-95 transition-all">
          <Plus className="w-4 h-4 mr-2"/> Initialize New Quiz
        </Button>
      </div>

      <div className="grid gap-4">
        {quizzes.map(q => (
          <Card key={q.id} className="flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-indigo-300 transition-all border-slate-200">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl transition-colors ${q.status === 'PUBLISHED' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{q.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold uppercase">{q.subject}</span>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3"/> {q.questions} Questions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <Badge variant={q.status === 'PUBLISHED' ? 'success' : 'warning'} className="font-black uppercase text-[9px] tracking-widest px-3 py-1 border-none shadow-sm">
                {q.status}
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-bold border-slate-200">Edit</Button>
                <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Assessment Nodes Found</p>
          <Button variant="outline" className="mt-6 border-slate-300" onClick={() => setIsModalOpen(true)}>Create Your First Quiz</Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Strategic Assessment Planner">
        <div className="space-y-5">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mb-2">
            <p className="text-[11px] text-indigo-700 font-bold leading-relaxed flex items-start gap-3">
              <Layers className="w-4 h-4 shrink-0" />
              Initial configuration for the new digital evaluation node. You can add specific questions after initialization.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Nomenclature</label>
            <input 
              placeholder="e.g. Neural Networks Mid-Term" 
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300" 
              value={newQuiz.title}
              onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Focus</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 w-4 h-4 text-slate-300" />
                <input 
                  placeholder="e.g. AI & ML" 
                  className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300" 
                  value={newQuiz.subject}
                  onChange={e => setNewQuiz({...newQuiz, subject: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Question Volume</label>
              <div className="relative">
                <Target className="absolute left-3 top-3.5 w-4 h-4 text-slate-300" />
                <input 
                  type="number"
                  placeholder="e.g. 25" 
                  className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300" 
                  value={newQuiz.questions}
                  onChange={e => setNewQuiz({...newQuiz, questions: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="secondary" className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsModalOpen(false)}>
              Abort
            </Button>
            <Button 
              className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100" 
              onClick={handleCreate} 
              disabled={!newQuiz.title || !newQuiz.subject}
            >
              Initialize Node
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherQuizzes;
