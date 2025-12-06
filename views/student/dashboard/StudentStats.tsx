
import React from 'react';
import { Card } from '../../../components/UIComponents';
import { CreditCard, Award } from 'lucide-react';
import { Assignment, FeeRecord } from '../../../types';

interface Props {
  averageAttendance: number;
  assignments: Assignment[];
  fees: FeeRecord[];
  onNavigate?: (id: string) => void;
}

const StudentStats: React.FC<Props> = ({ averageAttendance, assignments, fees, onNavigate }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 border-none relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="p-1 relative z-10">
        <span className="text-indigo-100 text-xs font-bold uppercase tracking-wide">Overall Attendance</span>
        <div className="mt-2 flex items-baseline"><span className="text-4xl font-black">{averageAttendance}%</span></div>
        <div className="mt-4"><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${averageAttendance >= 75 ? 'bg-white/20 text-white' : 'bg-red-500/20 text-white'}`}>{averageAttendance >= 75 ? 'Excellent ✨' : 'Low Warning ⚠️'}</span></div>
      </div>
    </Card>
    <Card title="Assignments" className="relative group">
        <div className="flex justify-between items-center mt-2">
            <span className="text-3xl font-bold">{assignments.filter(a => a.status === 'PENDING').length}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Pending</span>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">2 due this week</p>
        
        {onNavigate && (
            <button 
                onClick={() => onNavigate('assignments')}
                className="absolute top-6 right-6 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
            >
                View All
            </button>
        )}
    </Card>
    <Card title="Fees Pending">
        <div className="flex justify-between items-center mt-2">
            <span className="text-3xl font-bold text-slate-900">₹{fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0)}</span>
            <CreditCard className="text-slate-300 h-8 w-8"/>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">Next Due: Oct 30</p>
    </Card>
    <Card title="Overall Percentage">
        <div className="flex justify-between items-center mt-2">
            <span className="text-3xl font-bold text-slate-900">88.5%</span>
            <Award className="text-yellow-400 h-8 w-8"/>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">Last Sem: 8.5 CGPA</p>
    </Card>
  </div>
);

export default StudentStats;
