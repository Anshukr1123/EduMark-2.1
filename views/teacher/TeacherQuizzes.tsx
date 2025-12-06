
import React, { useState } from 'react';
import { Card, Button, Modal, Badge } from '../../components/UIComponents';
import { Plus, Trash2, CheckSquare } from 'lucide-react';

const TeacherQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState([
    { id: 'q1', title: 'Data Structures Quiz 1', subject: 'Data Structures', questions: 10, status: 'PUBLISHED' },
    { id: 'q2', title: 'Calculus Mid-Term', subject: 'Calculus', questions: 20, status: 'DRAFT' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', subject: '' });

  const handleCreate = () => {
    setQuizzes([...quizzes, { id: Math.random().toString(), title: newQuiz.title, subject: newQuiz.subject, questions: 0, status: 'DRAFT' }]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Internal Exams & Quizzes</h2>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2"/> Create Quiz</Button>
      </div>
      <div className="grid gap-4">
        {quizzes.map(q => (
          <Card key={q.id} className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{q.title}</h3>
              <p className="text-sm text-slate-500">{q.subject} • {q.questions} Questions</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={q.status === 'PUBLISHED' ? 'success' : 'warning'}>{q.status}</Badge>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Quiz">
        <div className="space-y-4">
          <input placeholder="Quiz Title" className="w-full border p-2 rounded" onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} />
          <input placeholder="Subject" className="w-full border p-2 rounded" onChange={e => setNewQuiz({...newQuiz, subject: e.target.value})} />
          <Button className="w-full" onClick={handleCreate}>Create Draft</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherQuizzes;
