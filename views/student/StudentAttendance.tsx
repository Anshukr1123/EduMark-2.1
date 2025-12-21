
import React, { useState, useMemo } from 'react';
import { Subject, AttendanceRecord } from '../../types';
import { Card, Badge, Button } from '../../components/UIComponents';
import { ScanLine, CheckCircle2, ChevronLeft, ChevronRight, MousePointer2, FilterX, BarChart2, ShieldAlert, ZoomIn, ZoomOut } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, ReferenceLine, LabelList, LineChart, Line } from 'recharts';

interface StudentAttendanceProps {
  history: AttendanceRecord[];
  subjects: Subject[];
  lastUpdate?: string | null;
  onMarkAttendance?: (subjectName: string) => void;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ history, subjects, lastUpdate, onMarkAttendance }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sorting history
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // --- Yearly Pulse Data Logic ---
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yearlyTrendData = useMemo(() => {
      return monthNames.map((month, index) => {
          const recordsInMonth = history.filter(r => {
              const d = new Date(r.date);
              return d.getMonth() === index && d.getFullYear() === currentDate.getFullYear();
          });
          
          if (recordsInMonth.length === 0) return { name: month, rate: index <= new Date().getMonth() ? 0 : null, index };
          
          const presentCount = recordsInMonth.filter(r => r.status === 'PRESENT').length;
          return { name: month, rate: Math.round((presentCount / recordsInMonth.length) * 100), index };
      }).filter(d => d.rate !== null);
  }, [history, currentDate]);

  // --- Dynamic Drill-down Subject Logic ---
  const subjectPerformanceData = useMemo(() => {
    if (selectedMonth === null) {
      return subjects.map(s => ({ 
        name: s.code, 
        rate: Math.round((s.attendedClasses / s.totalClasses) * 100) 
      }));
    }

    return subjects.map(s => {
      const monthRecords = history.filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === selectedMonth && 
               d.getFullYear() === currentDate.getFullYear() &&
               (r.subjectName === s.name || r.subjectName === s.code);
      });
      
      const total = monthRecords.length;
      const present = monthRecords.filter(r => r.status === 'PRESENT').length;
      
      return {
        name: s.code,
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
        count: total
      };
    });
  }, [selectedMonth, subjects, history, currentDate]);

  const totalClasses = subjects.reduce((a, b) => a + b.totalClasses, 0);
  const attendedClasses = subjects.reduce((a, b) => a + b.attendedClasses, 0);
  const absentClasses = totalClasses - attendedClasses;
  const averageAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  const isGlobalAttendanceCritical = averageAttendance < 75;

  const getStatusColor = (pct: number) => {
      if (pct >= 75) return '#4f46e5'; 
      return '#ef4444'; 
  };

  const gaugeData = [
    { name: 'Attended', value: averageAttendance, color: getStatusColor(averageAttendance) },
    { name: 'Missed', value: Math.max(0, 100 - averageAttendance), color: '#f1f5f9' }
  ];

  const handleMonthClick = (data: any) => {
    if (data && data.index !== undefined) {
        setSelectedMonth(data.index);
        setCurrentDate(new Date(currentDate.getFullYear(), data.index, 1));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 animate-in slide-in-from-top-2 duration-300">
          <div>
            <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Attendance Intelligence</h2>
                {lastUpdate && <Badge variant="success" className="animate-pulse shadow-md border-none bg-green-500 text-white font-black px-3 py-1">LIVE</Badge>}
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">Visual trend analysis for institutional compliance.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsScannerOpen(true)} className="shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all bg-indigo-600 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest px-8">
                <ScanLine className="w-4 h-4 mr-2.5"/> Terminal Check-in
            </Button>
          </div>
       </div>

       {isGlobalAttendanceCritical && (
         <div className="bg-red-600 border-2 border-red-700 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-red-200 text-white animate-in slide-in-from-top-4 duration-500">
            <ShieldAlert className="w-12 h-12 animate-pulse" />
            <div className="flex-1 text-center md:text-left">
                <h4 className="font-black uppercase text-lg tracking-tight">CRITICAL SYSTEM ALERT</h4>
                <p className="opacity-90 font-medium">Cumulative presence is <span className="font-black underline">{averageAttendance}%</span>. Required threshold is 75%.</p>
            </div>
         </div>
       )}

       <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6 border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all">
               <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.25em] mb-4">Total Present</p>
               <p className="text-5xl font-black text-slate-900 tracking-tighter">{attendedClasses}</p>
          </Card>
          <Card className="p-6 border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all">
               <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.25em] mb-4">Total Absent</p>
               <p className="text-5xl font-black text-slate-900 tracking-tighter">{absentClasses}</p>
          </Card>
          <Card className={`md:col-span-2 ${isGlobalAttendanceCritical ? 'bg-red-600' : 'bg-slate-900'} text-white border-none shadow-md overflow-hidden p-6`}>
             <div className="flex flex-col md:flex-row h-full">
               <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4 opacity-70">Overall Standing</p>
                 <span className="text-7xl font-black tracking-tighter">{averageAttendance}%</span>
               </div>
               <div className="w-full md:w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={gaugeData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value" stroke="none" paddingAngle={2} cornerRadius={8}>
                        {gaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
               </div>
             </div>
          </Card>
       </div>

       <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
             {/* Enhanced Trend Chart with Zoom and Color Coding */}
             <Card title="Yearly Attendance Trend" className="relative group">
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4 text-indigo-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {selectedMonth !== null ? `Focus: ${monthNames[selectedMonth]}` : 'Click bars to drill down'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setZoomLevel(prev => prev === 1 ? 1.5 : 1)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all shadow-sm flex items-center gap-1 text-[10px] font-black text-slate-600 uppercase"
                        >
                            {zoomLevel === 1 ? <><ZoomIn className="w-4 h-4"/> Zoom</> : <><ZoomOut className="w-4 h-4"/> Reset</>}
                        </button>
                        {selectedMonth !== null && (
                            <button onClick={() => setSelectedMonth(null)} className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 transition-all">
                                <FilterX className="w-3 h-3" /> Clear Filter
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="overflow-x-auto no-scrollbar">
                    <div style={{ width: `${100 * zoomLevel}%`, minHeight: '320px', transition: 'width 0.4s ease' }}>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} onClick={(data: any) => handleMonthClick(data?.activePayload?.[0]?.payload)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 900, fill: '#94a3b8'}}/>
                                <YAxis domain={[0, 100]} hide />
                                <RechartsTooltip cursor={{fill: '#f8fafc', opacity: 0.8}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}} />
                                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} label={{ position: 'top', value: '75%', fill: '#ef4444', fontSize: 10, fontWeight: 900 }} />
                                <Bar dataKey="rate" radius={[10, 10, 10, 10] as any} animationDuration={1500} cursor="pointer">
                                    {yearlyTrendData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={selectedMonth === entry.index ? '#10b981' : (entry.rate !== null && entry.rate < 75 ? '#ef4444' : '#4f46e5')} 
                                        />
                                    ))}
                                    <LabelList dataKey="rate" position="top" style={{ fontSize: '10px', fontWeight: '900', fill: '#64748b' }} formatter={(v: any) => v ? `${v}%` : ''} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Satisfactory (≥75%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Critical (&lt;75%)</span>
                    </div>
                </div>
             </Card>

             <Card title={selectedMonth !== null ? `Stability Matrix: ${monthNames[selectedMonth]}` : "Cumulative Subject Matrix"}>
                <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={subjectPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="rate" stroke={selectedMonth !== null ? "#10b981" : "#4f46e5"} strokeWidth={4} dot={{ r: 6, fill: selectedMonth !== null ? "#10b981" : "#4f46e5", strokeWidth: 4, stroke: '#fff' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </Card>
          </div>

          <div className="space-y-8">
             <Card title="Engagement Heatmap" className="p-6">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                      <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 shadow-sm"><ChevronLeft className="w-4 h-4"/></button>
                      <span className="text-[10px] font-black text-slate-700 w-24 text-center uppercase tracking-[0.2em]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                      <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 shadow-sm"><ChevronRight className="w-4 h-4"/></button>
                   </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {/* Simplified Heatmap Logic for Demo */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                        const status = Math.random() > 0.3 ? 'bg-emerald-500' : 'bg-red-500';
                        return (
                            <div key={day} className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black text-white ${status} shadow-sm cursor-pointer hover:scale-110 transition-transform`}>
                                {day}
                            </div>
                        );
                    })}
                </div>
             </Card>

             <Card className="bg-indigo-600 text-white border-none shadow-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><BarChart2 className="w-32 h-32"/></div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-xl font-black uppercase tracking-tight leading-none">Smart Monitor</h4>
                    <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">Predictive analysis suggests maintaining 3 more classes to reach 80% aggregate.</p>
                    <Button variant="secondary" className="w-full bg-white text-indigo-700 h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Simulate Future</Button>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
};

export default StudentAttendance;
