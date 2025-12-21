
import React from 'react';
import { Subject } from '../../../types';
import { Card, Badge } from '../../../components/UIComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, ReferenceLine, Legend, ComposedChart, Line } from 'recharts';
import { TrendingUp, Users, Info, BarChart3 } from 'lucide-react';

interface Props { subjects: Subject[]; }

const AttendanceChart: React.FC<Props> = ({ subjects }) => {
  const chartData = subjects.map(s => ({
    ...s,
    percentage: Math.round((s.attendedClasses / s.totalClasses) * 100) || 0,
    peerAverage: 78 
  }));

  const getAttendanceColor = (pct: number) => pct >= 85 ? '#4f46e5' : pct >= 75 ? '#10b981' : '#ef4444';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white p-4 border-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl text-xs min-w-[180px] backdrop-blur-xl border border-white/10">
          <p className="font-black text-indigo-400 uppercase tracking-[0.3em] text-[10px] mb-3">{label}</p>
          <div className="space-y-3">
             <div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Current Presence</p>
                <p className="text-3xl font-black text-white tracking-tighter">{data.percentage}%</p>
             </div>
             <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <div>
                   <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Sector avg</p>
                   <p className="text-sm font-black text-slate-300">{data.peerAverage}%</p>
                </div>
                <Badge variant={data.percentage >= data.peerAverage ? 'success' : 'error'} className="text-[9px] font-black px-3 py-1 border-none shadow-lg">
                   {data.percentage >= data.peerAverage ? 'ADVANCED' : 'RECOVERY'}
                </Badge>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Subject Engagement Logic" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <BarChart3 className="w-64 h-64" />
      </div>
      
      <div className="flex flex-wrap items-center gap-6 mb-8 mt-1">
          <div className="bg-indigo-600 px-4 py-1.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Stability: +4.2%</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest tracking-[0.2em]">Cohort Size: 140 Students</span>
          </div>
      </div>

      <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{top: 10, right: 10, left: -25, bottom: 0}}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="code" tick={{fontSize: 11, fill: '#64748b', fontWeight: 900}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 800}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc', opacity: 0.6}} />
              <ReferenceLine y={75} stroke="#ef4444" strokeWidth={3} strokeDasharray="8 8" label={{ value: 'MANDATORY', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }} />
              <Bar dataKey="percentage" radius={[12, 12, 0, 0]} barSize={36} animationDuration={1500} animationEasing="ease-out">
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getAttendanceColor(entry.percentage)} />)}
              </Bar>
              <Line type="monotone" dataKey="peerAverage" stroke="#cbd5e1" strokeDasharray="10 10" dot={false} strokeWidth={2} />
          </ComposedChart>
          </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mt-6 pt-6 border-t-2 border-slate-50">
         <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-md"></div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Excellence</span>
         </div>
         <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md"></div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Compliant</span>
         </div>
         <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-md"></div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Critical Risk</span>
         </div>
         <div className="flex items-center gap-2.5">
            <div className="w-6 h-0.5 bg-slate-300 rounded-full"></div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Cohort Pulse</span>
         </div>
      </div>
    </Card>
  );
};

export default AttendanceChart;
