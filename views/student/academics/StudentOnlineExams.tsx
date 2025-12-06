
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { Clock, CheckCircle2, AlertCircle, Play, Laptop, Timer } from 'lucide-react';

interface OnlineExam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  status: 'READY' | 'COMPLETED' | 'MISSED';
  date: string;
  score?: number;
}

const MOCK_ONLINE_EXAMS: OnlineExam[] = [
  { id: 'e1', title: 'Data Structures Quiz 1', subject: 'Data Structures', duration: 30, totalQuestions: 20, status: 'READY', date: '2023-10-28' },
  { id: 'e2', title: 'Calculus Mid-Sem Objective', subject: 'Calculus', duration: 60, totalQuestions: 40, status: 'COMPLETED', date: '2023-09-15', score: 35 },
  { id: 'e3', title: 'Physics Surprise Test', subject: 'Quantum Physics', duration: 15, totalQuestions: 10, status: 'MISSED', date: '2023-10-01' },
];

const StudentOnlineExams: React.FC = () => {
  const [exams, setExams] = useState<OnlineExam[]>(MOCK_ONLINE_EXAMS);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<OnlineExam | null>(null);
  const [timer, setTimer] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  useEffect(() => {
    let interval: any;
    if (isExamModalOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isExamModalOpen) {
      // Auto submit
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [isExamModalOpen, timer]);

  const handleStartExam = (exam: OnlineExam) => {
    setCurrentExam(exam);
    setTimer(exam.duration * 60);
    setCurrentQuestion(1);
    setIsExamModalOpen(true);
  };

  const handleSubmitExam = () => {
    setIsExamModalOpen(false);
    if (currentExam) {
      setExams(prev => prev.map(e => e.id === currentExam.id ? { ...e, status: 'COMPLETED', score: Math.floor(Math.random() * e.totalQuestions) } : e));
      alert(`Exam Submitted! Check results tab for detailed breakdown.`);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Online Exams</h2>
           <p className="text-sm text-slate-500">Take scheduled quizzes and internal assessments.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {exams.map(exam => (
          <Card key={exam.id} className={`flex flex-col md:flex-row justify-between items-center border-l-4 ${exam.status === 'READY' ? 'border-l-indigo-500' : exam.status === 'COMPLETED' ? 'border-l-green-500' : 'border-l-red-500'}`}>
             <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className={`p-3 rounded-full ${exam.status === 'READY' ? 'bg-indigo-100 text-indigo-600' : exam.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   {exam.status === 'READY' ? <Laptop className="w-6 h-6"/> : exam.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6"/> : <AlertCircle className="w-6 h-6"/>}
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-900">{exam.title}</h3>
                   <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>{exam.subject}</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {exam.duration} mins</span>
                      <span>{exam.totalQuestions} Questions</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4">
                {exam.status === 'COMPLETED' && <div className="text-right mr-4"><p className="text-xs text-slate-400 uppercase font-bold">Score</p><p className="text-xl font-black text-green-600">{exam.score} <span className="text-sm text-slate-400 font-medium">/ {exam.totalQuestions}</span></p></div>}
                
                {exam.status === 'READY' ? (
                   <Button onClick={() => handleStartExam(exam)} className="shadow-lg shadow-indigo-200"><Play className="w-4 h-4 mr-2"/> Start Exam</Button>
                ) : (
                   <Badge variant={exam.status === 'COMPLETED' ? 'success' : 'error'}>{exam.status}</Badge>
                )}
             </div>
          </Card>
        ))}
      </div>

      {/* Exam Simulation Modal */}
      <Modal isOpen={isExamModalOpen} onClose={() => { if(confirm("Quit exam? Progress will be lost.")) setIsExamModalOpen(false); }} title={currentExam?.title || 'Online Exam'}>
         <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl shadow-lg">
               <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs uppercase font-bold">Time Left</span>
                  <span className={`text-xl font-mono font-bold flex items-center ${timer < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                     <Timer className="w-5 h-5 mr-2"/> {formatTime(timer)}
                  </span>
               </div>
               <div className="text-sm font-medium opacity-80">Question {currentQuestion} / {currentExam?.totalQuestions}</div>
            </div>

            <div className="py-4">
               <h3 className="text-lg font-bold text-slate-900 mb-4">Q{currentQuestion}. What is the time complexity of searching in a balanced Binary Search Tree?</h3>
               <div className="space-y-3">
                  {['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'].map((opt, i) => (
                     <label key={i} className="flex items-center p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all">
                        <input type="radio" name="answer" className="w-4 h-4 text-indigo-600 accent-indigo-600 mr-3" />
                        <span className="text-slate-700 font-medium">{opt}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
               <Button variant="secondary" disabled={currentQuestion === 1} onClick={() => setCurrentQuestion(prev => prev - 1)}>Previous</Button>
               {currentQuestion < (currentExam?.totalQuestions || 0) ? (
                  <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>Next Question</Button>
               ) : (
                  <Button onClick={handleSubmitExam} variant="primary" className="bg-green-600 hover:bg-green-700">Submit Exam</Button>
               )}
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default StudentOnlineExams;
