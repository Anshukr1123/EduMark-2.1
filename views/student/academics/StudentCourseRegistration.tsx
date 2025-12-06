
import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { Search, BookOpen, User, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  schedule: string;
  seats: number;
  enrolled: number;
  description: string;
  department: string;
}

const AVAILABLE_COURSES: Course[] = [
  { id: 'c1', code: 'CS301', name: 'Artificial Intelligence', credits: 4, instructor: 'Dr. Andrew Ng', schedule: 'Mon, Wed 10:00 AM', seats: 60, enrolled: 45, description: 'Introduction to AI, machine learning, and neural networks.', department: 'CS' },
  { id: 'c2', code: 'CS305', name: 'Database Systems', credits: 3, instructor: 'Prof. Widom', schedule: 'Tue, Thu 02:00 PM', seats: 50, enrolled: 48, description: 'Relational databases, SQL, and normalization.', department: 'CS' },
  { id: 'c3', code: 'MAT202', name: 'Linear Algebra', credits: 4, instructor: 'Dr. Strang', schedule: 'Mon, Wed 08:00 AM', seats: 40, enrolled: 10, description: 'Vector spaces, matrices, and linear transformations.', department: 'Math' },
  { id: 'c4', code: 'ENG102', name: 'Creative Writing', credits: 2, instructor: 'Ms. Rowling', schedule: 'Fri 10:00 AM', seats: 30, enrolled: 25, description: 'Workshop-based approach to fiction and poetry.', department: 'Arts' },
  { id: 'c5', code: 'CS310', name: 'Computer Networks', credits: 3, instructor: 'Dr. Wetherall', schedule: 'Tue, Thu 11:00 AM', seats: 60, enrolled: 55, description: 'Layered architecture, TCP/IP, and routing.', department: 'CS' },
  { id: 'c6', code: 'PHY201', name: 'Modern Physics', credits: 4, instructor: 'Dr. Feynman', schedule: 'Mon, Wed 02:00 PM', seats: 40, enrolled: 38, description: 'Quantum mechanics and relativity.', department: 'Physics' },
];

const StudentCourseRegistration: React.FC = () => {
  const [registeredCourses, setRegisteredCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCredits = registeredCourses.reduce((acc, courseId) => {
    const course = AVAILABLE_COURSES.find(c => c.id === courseId);
    return acc + (course ? course.credits : 0);
  }, 0);

  const MAX_CREDITS = 24;

  const handleRegister = (courseId: string) => {
    const course = AVAILABLE_COURSES.find(c => c.id === courseId);
    if (course && totalCredits + course.credits > MAX_CREDITS) {
        alert("Credit limit exceeded!");
        return;
    }
    setRegisteredCourses([...registeredCourses, courseId]);
    setIsModalOpen(false);
  };

  const handleDrop = (courseId: string) => {
    setRegisteredCourses(registeredCourses.filter(id => id !== courseId));
  };

  const filteredCourses = AVAILABLE_COURSES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Course Registration</h2>
                <p className="text-slate-500 text-sm">Select courses for Next Semester (Spring 2024)</p>
            </div>
             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-4">
                <div>
                    <p className="text-xs text-indigo-500 font-bold uppercase">Selected Credits</p>
                    <p className="text-lg font-bold text-indigo-700">{totalCredits} / {MAX_CREDITS}</p>
                </div>
                <div className="h-8 w-px bg-indigo-200"></div>
                <div>
                    <p className="text-xs text-indigo-500 font-bold uppercase">Courses</p>
                    <p className="text-lg font-bold text-indigo-700">{registeredCourses.length}</p>
                </div>
            </div>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
                type="text"
                placeholder="Search by course name or code..."
                className="pl-9 pr-4 py-3 w-full border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map(course => {
                const isRegistered = registeredCourses.includes(course.id);
                const isFull = course.enrolled >= course.seats;

                return (
                    <Card key={course.id} className={`flex flex-col h-full border hover:border-indigo-300 transition-all ${isRegistered ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                            <Badge variant="neutral" className="bg-slate-100 text-slate-700">{course.code}</Badge>
                            <Badge variant={course.department === 'CS' ? 'success' : 'warning'}>{course.department}</Badge>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{course.name}</h3>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{course.description}</p>

                        <div className="space-y-2 mb-6 flex-1">
                             <div className="flex items-center text-sm text-slate-600">
                                <User className="w-4 h-4 mr-2 text-indigo-500"/> {course.instructor}
                             </div>
                             <div className="flex items-center text-sm text-slate-600">
                                <Clock className="w-4 h-4 mr-2 text-indigo-500"/> {course.schedule}
                             </div>
                             <div className="flex items-center text-sm text-slate-600">
                                <BookOpen className="w-4 h-4 mr-2 text-indigo-500"/> {course.credits} Credits
                             </div>
                             <div className="flex items-center text-sm text-slate-600">
                                <Info className="w-4 h-4 mr-2 text-indigo-500"/> {course.seats - course.enrolled} seats left
                             </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                             {isRegistered ? (
                                 <Button variant="danger" className="w-full" onClick={() => handleDrop(course.id)}>Drop Course</Button>
                             ) : (
                                 <Button
                                    className="w-full"
                                    disabled={isFull}
                                    onClick={() => { setSelectedCourse(course); setIsModalOpen(true); }}
                                 >
                                    {isFull ? 'Full Class' : 'Register'}
                                 </Button>
                             )}
                        </div>
                    </Card>
                );
            })}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Registration">
             <div className="space-y-4">
                {selectedCourse && (
                    <>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-lg">{selectedCourse.name} ({selectedCourse.code})</h4>
                            <p className="text-slate-500 text-sm mt-1">{selectedCourse.instructor} • {selectedCourse.schedule}</p>
                            <div className="mt-3 flex items-center gap-2">
                                <Badge variant="success">{selectedCourse.credits} Credits</Badge>
                                <span className="text-xs text-slate-400">Standard Grading</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">
                            Are you sure you want to register for this course? This will add <strong>{selectedCourse.credits} credits</strong> to your semester load.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button className="flex-1" onClick={() => selectedCourse && handleRegister(selectedCourse.id)}>Confirm Registration</Button>
                        </div>
                    </>
                )}
             </div>
        </Modal>
    </div>
  );
};

export default StudentCourseRegistration;
