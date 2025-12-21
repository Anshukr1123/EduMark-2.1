
import React from 'react';
import { Subject } from '../../../types';
import { Card, Badge } from '../../../components/UIComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, ReferenceLine, Legend, ComposedChart, Line } from 'recharts';
import { TrendingUp, Users, Info } from 'lucide-react';

interface Props { subjects: Subject[]; }

const AttendanceChart: React.FC<Props> = ({ subjects }) => {
  // Mock Peer average for comparison
  const chartData = subjects.map(s => ({
    ...s,
    percentage: Math.round((s.attendedClasses / s.totalClasses) * 100) || 0,
    peerAverage: 78 // Default mock average for all subjects
  }));

  const getAttendanceColor = (pct: number) => pct >= 85 ? '#4f46e5' : pct >= 75 ? '#22c55e' : '#ef4444';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 border-none shadow-2xl rounded-xl text-xs min-w-[140px]">
          <p className="font-black text-indigo-400 uppercase tracking-widest text-[7.5px] mb-1.5">{label}</p>
          <div className="space-y-1.5">
             <div>
                <p className="text-slate-400 text-[7.5px] font-bold uppercase tracking-tighter">Presence</p>
                <p className="text-lg font-black">{data.percentage}%</p>
             </div>
             <div className="flex justify-between items-center pt-1.5 border-t border-white/10">
                <div>
                   <p className="text-[6.5px] text-slate-500 font-bold uppercase">Inst. avg</p>
                   <p className="text-[9px] font-bold text-slate-300">{data.peerAverage}%</p>
                </div>
                <Badge variant={data.percentage >= data.peerAverage ? 'success' : 'error'} className="text-[6.5px] font-black px-1 py-0.5">
                   {data.percentage >= data.peerAverage ? 'LEAD' : 'LAG'}
                </Badge>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Engagement Analytics">
      <div className="flex items-center gap-3 mb-3 mt-0.5">
          <div className="bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-indigo-600" />
              <span className="text-[7.5px] font-black text-indigo-700 uppercase tracking-widest">Velocity: +4.2%</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-3 h-3" />
              <span className="text-[7.5px] font-bold uppercase tracking-widest">Cohort: 140</span>
          </div>
      </div>

      <div className="h-56 w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{top: 5, right: 5, left: -30, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="code" tick={{fontSize: 8.5, fill: '#94a3b8', fontWeight: 900}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{fontSize: 8.5, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc', opacity: 0.8}} />
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Cap', position: 'insideTopRight', fill: '#ef4444', fontSize: 7, fontWeight: 900 }} />
              <Bar dataKey="percentage" radius={[5, 5, 5, 5]} barSize={24} animationDuration={1200}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getAttendanceColor(entry.percentage)} />)}
              </Bar>
              <Line type="monotone" dataKey="peerAverage" stroke="#cbd5e1" strokeDasharray="4 4" dot={false} strokeWidth={1} />
          </ComposedChart>
          </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-3 pt-3 border-t border-slate-50">
         <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
            <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest">High</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest">Verified</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest">Critical</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-0.5 bg-slate-300"></div>
            <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest">Average</span>
         </div>
      </div>
    </Card>
  );
};

export default AttendanceChart;
