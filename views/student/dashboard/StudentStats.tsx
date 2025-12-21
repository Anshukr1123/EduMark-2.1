
import React from 'react';
import { Card, Badge, Button } from '../../../components/UIComponents';
import { CreditCard, Award, Zap, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Attendance Stats */}
      <Card className={`bg-gradient-to-br from-indigo-700 to-indigo-900 text-white shadow-2xl border-none relative overflow-hidden group h-full flex flex-col justify-between p-2`}>
        <div className="absolute top-[-30%] right-[-30%] w-32 h-32 bg-white/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="p-6 relative z-10 space-y-4">
          <div className="flex justify-between items-start">
             <span className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.3em]">Pulse Integrity</span>
             <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black tracking-tighter tabular-nums">{averageAttendance}%</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${averageAttendance >= 75 ? 'text-emerald-300' : 'text-red-300'}`}>
                {averageAttendance >= 75 ? 'Optimal' : 'Urgent'}
            </span>
          </div>
          <div className="pt-2">
             <span className={`inline-flex items-center rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-widest ${averageAttendance >= 75 ? 'bg-white/10 text-white backdrop-blur-md' : 'bg-red-500 text-white shadow-lg shadow-red-500/40'}`}>
                 <TrendingUp className="w-3 h-3 mr-2" /> STREAK: 12 DAYS
             </span>
          </div>
        </div>
      </Card>

      {/* Task Stats */}
      <Card className="relative group hover:border-indigo-500 border-2 border-transparent transition-all shadow-xl flex flex-col justify-between p-2">
          <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Academic Ops</span>
                <Badge className="bg-amber-100 text-amber-700 text-[10px] font-black border-none px-3 py-1 shadow-sm leading-none tracking-widest">QUEUE</Badge>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">{pendingCount}</span>
                  <CheckCircle2 className="text-indigo-600 h-10 w-10 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              </div>
              <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Submission Pipeline</p>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                      <div className="h-full bg-indigo-600 w-[65%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
                  </div>
              </div>
          </div>
          {onNavigate && (
              <button 
                  onClick={() => onNavigate('assignments')}
                  className="mt-1 px-6 pb-6 text-[10px] font-black text-indigo-600 hover:text-indigo-900 uppercase tracking-[0.3em] flex items-center gap-2 transition-all hover:translate-x-1"
              >
                  GATEWAY ROUTING <ArrowRight className="w-4 h-4" />
              </button>
          )}
      </Card>

      {/* Finance Stats */}
      <Card className="relative group hover:border-amber-500 border-2 border-transparent transition-all shadow-xl flex flex-col justify-between p-2">
          <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Ledger</span>
                <Badge className="bg-red-50 text-red-600 text-[10px] font-black border-none px-3 py-1 shadow-sm leading-none tracking-widest">DUE</Badge>
              </div>
              <div className="flex justify-between items-center">
                  <span className={`text-4xl font-black tracking-tighter tabular-nums ${overdueFees > 0 ? 'text-red-600' : 'text-slate-900'}`}>₹{fees.filter(f => f.status !== 'PAID').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                  <CreditCard className="text-amber-500 h-10 w-10 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Audit Cycle: Oct 30</p>
          </div>
          {onNavigate && (
              <button 
                  onClick={() => onNavigate('fees')}
                  className="mt-1 px-6 pb-6 text-[10px] font-black text-amber-600 hover:text-amber-900 uppercase tracking-[0.3em] flex items-center gap-2 transition-all hover:translate-x-1"
              >
                  SETTLEMENT NODE <ArrowRight className="w-4 h-4" />
              </button>
          )}
      </Card>

      {/* Result Stats */}
      <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group flex flex-col justify-between p-2">
          <div className="absolute top-[-40%] right-[-40%] w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>
          <div className="p-6 space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Merit Hierarchy</span>
                <Award className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">8.85</span>
                  <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] self-end mb-2">GPA</span>
              </div>
              <div className="pt-2 flex items-center gap-3">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-black shadow-lg">1</div>
                    ))}
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOP 10% PERCENTILE</span>
              </div>
          </div>
      </Card>
    </div>
  );
};

export default StudentStats;
