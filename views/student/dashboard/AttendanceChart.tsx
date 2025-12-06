

import React from 'react';
import { Subject } from '../../../types';
import { Card } from '../../../components/UIComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, ReferenceLine, Legend } from 'recharts';

interface Props { subjects: Subject[]; }

const AttendanceChart: React.FC<Props> = ({ subjects }) => {
  const chartData = subjects.map(s => ({
    ...s,
    percentage: Math.round((s.attendedClasses / s.totalClasses) * 100) || 0
  }));

  const getAttendanceColor = (pct: number) => pct >= 85 ? '#4f46e5' : pct >= 75 ? '#22c55e' : '#ef4444';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg text-sm">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <div className="space-y-1">
             <p className="text-indigo-600 font-medium">{`Percentage: ${payload[0].value}%`}</p>
             <p className="text-slate-500 text-xs">{`Attended: ${payload[0].payload.attendedClasses} / ${payload[0].payload.totalClasses}`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Subject-wise Attendance">
      <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="code" tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '75% Required', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1000}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getAttendanceColor(entry.percentage)} />)}
              </Bar>
          </BarChart>
          </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 gap-6 text-xs text-slate-500 font-medium">
         <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span> &gt;85% (Excellent)</div>
         <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> 75-85% (Good)</div>
         <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> &lt;75% (Critical)</div>
      </div>
    </Card>
  );
};

export default AttendanceChart;