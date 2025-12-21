
import React from 'react';
// Added Badge to the imports from UIComponents
import { Card, Badge } from '../../../components/UIComponents';
import { CreditCard, Award, Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Assignment, FeeRecord } from '../../../types';

interface Props {
  averageAttendance: number;
  assignments: Assignment[];
  fees: FeeRecord[];
  onNavigate?: (id: string) => void;
}

const StudentStats: React.FC<Props> = ({ averageAttendance, assignments, fees, onNavigate }) => {
  const pendingCount = assignments.filter(a => a.status === 'PENDING').length;
  const overdueFees = fees.filter(f => f.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-4">
      {/* Attendance Stats */}
      <Card className={`bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md border-none relative overflow-hidden group h-full flex flex-col justify-between p-1.5`}>
        <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-white/10 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
        <div className="p-3.5 relative z-10 space-y-2">
          <div className="flex justify-between items-start">
             <span className="text-indigo-100 text-[7px] font-black uppercase tracking-[0.2em]">Pulse Rating</span>
             <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black tracking-tighter tabular-nums">{averageAttendance}%</span>
            <span className={`text-[7px] font-black uppercase tracking-widest ${averageAttendance >= 75 ? 'text-green-300' : 'text-red-300'}`}>
                {averageAttendance >= 75 ? 'Optimal' : 'Action'}
            </span>
          </div>
          <div className="pt-1">
             <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[7px] font-black uppercase tracking-widest ${averageAttendance >= 75 ? 'bg-white/15 text-white' : 'bg-red-500/30 text-white border border-red-400/30'}`}>
                 <TrendingUp className="w-2.5 h-2.5 mr-1" /> STREAK: 12D
             </span>
          </div>
        </div>
      </Card>

      {/* Task Stats */}
      <Card className="relative group hover:border-indigo-300 transition-all flex flex-col justify-between p-1.5">
          <div className="p-3.5 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-[7px] font-black uppercase tracking-[0.2em]">Academic Ops</span>
                <Badge variant="warning" className="text-[6px] font-black border-none px-1.5 py-0 shadow-sm leading-none">QUEUE</Badge>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{pendingCount}</span>
                  <CheckCircle2 className="text-indigo-500 h-6 w-6 opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <div className="space-y-0.5">
                  <p className="text-[7.5px] text-slate-400 font-bold uppercase tracking-widest">2 Due Cycles Remaining</p>
                  <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div className="h-full bg-indigo-500 w-[40%] rounded-full"></div>
                  </div>
              </div>
          </div>
          {onNavigate && (
              <button 
                  onClick={() => onNavigate('assignments')}
                  className="mt-1 px-3.5 pb-2 text-[7px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-[0.2em] flex items-center gap-1 transition-all"
              >
                  ROUTING <ArrowRight className="w-2.5 h-2.5" />
              </button>
          )}
      </Card>

      {/* Finance Stats */}
      <Card className="relative group hover:border-amber-300 transition-all flex flex-col justify-between p-1.5">
          <div className="p-3.5 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-[7px] font-black uppercase tracking-[0.2em]">Financial Ledger</span>
                <Badge variant="error" className="text-[6px] font-black border-none px-1.5 py-0 shadow-sm leading-none">DUES</Badge>
              </div>
              <div className="flex justify-between items-center">
                  <span className={`text-3xl font-black tracking-tighter tabular-nums ${overdueFees > 0 ? 'text-red-600' : 'text-slate-900'}`}>₹{fees.filter(f => f.status !== 'PAID').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                  <CreditCard className="text-slate-300 h-6 w-6 opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <p className="text-[7.5px] text-slate-400 font-bold uppercase tracking-widest">Cycle Cut-off: Oct 30</p>
          </div>
          {onNavigate && (
              <button 
                  onClick={() => onNavigate('fees')}
                  className="mt-1 px-3.5 pb-2 text-[7px] font-black text-amber-600 hover:text-amber-800 uppercase tracking-[0.2em] flex items-center gap-1 transition-all"
              >
                  SETTLEMENT <ArrowRight className="w-2.5 h-2.5" />
              </button>
          )}
      </Card>

      {/* Result Stats */}
      <Card className="bg-slate-900 text-white border-none shadow-md relative overflow-hidden group flex flex-col justify-between p-1.5">
          <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
          <div className="p-3.5 space-y-2 relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-[7px] font-black uppercase tracking-[0.2em]">Intelligence Tier</span>
                <Award className="w-3 h-3 text-yellow-500" />
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-4xl font-black text-white tracking-tighter tabular-nums">8.85</span>
                  <span className="text-[7.5px] font-black text-indigo-400 uppercase tracking-widest self-end mb-1">GPA</span>
              </div>
              <div className="pt-1 flex items-center gap-1.5">
                 <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full border border-slate-700 bg-indigo-500 flex items-center justify-center text-[6px] font-bold">1</div>
                    <div className="w-4 h-4 rounded-full border border-slate-700 bg-indigo-600 flex items-center justify-center text-[6px] font-bold">2</div>
                 </div>
                 <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">TOP 10%</span>
              </div>
          </div>
      </Card>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default StudentStats;
