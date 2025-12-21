
import React, { useState, useMemo } from 'react';
import { Subject, AttendanceRecord } from '../../types';
import { Card, Badge, Button } from '../../components/UIComponents';
import { ScanLine, CheckCircle2, XCircle, ChevronLeft, ChevronRight, AlertTriangle, MousePointer2, FilterX, TrendingUp, BarChart2, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, ReferenceLine, LabelList, LineChart, Line } from 'recharts';

interface StudentAttendanceProps {
  history: AttendanceRecord[];
  subjects: Subject[];
  lastUpdate?: string | null;
  onMarkAttendance?: (subjectName: string) => void;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ history, subjects, lastUpdate, onMarkAttendance }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'LATE'>('ALL');
  
  // Drill-down State
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

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
    // If no month selected, show overall stats from the subjects summary
    if (selectedMonth === null) {
      return subjects.map(s => ({ 
        name: s.code, 
        rate: Math.round((s.attendedClasses / s.totalClasses) * 100) 
      }));
    }

    // Filter subject performance by selected month records
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

  // --- Calculations ---
  const totalClasses = subjects.reduce((a, b) => a + b.totalClasses, 0);
  const attendedClasses = subjects.reduce((a, b) => a + b.attendedClasses, 0);
  const absentClasses = totalClasses - attendedClasses;
  const averageAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  const criticalSubjects = subjects.filter(s => (s.attendedClasses / s.totalClasses) < 0.75);
  const isGlobalAttendanceCritical = averageAttendance < 75;

  const getStatusColor = (pct: number) => {
      if (pct >= 75) return '#22c55e';
      if (pct >= 60) return '#facc15';
      return '#ef4444';
  };

  const gaugeData = [
    { name: 'Attended', value: averageAttendance, color: getStatusColor(averageAttendance) },
    { name: 'Missed', value: Math.max(0, 100 - averageAttendance), color: '#f1f5f9' }
  ];

  // Calendar Heatmap Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDayAttendance = (day: number) => {
    const recordsForDay = history.filter(r => {
        const d = new Date(r.date);
        return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });

    if (recordsForDay.length === 0) return null;

    const presentCount = recordsForDay.filter(r => r.status === 'PRESENT').length;
    const percentage = (presentCount / recordsForDay.length) * 100;
    
    let colorClass = percentage === 100 ? 'bg-emerald-500' : percentage === 0 ? 'bg-red-500' : 'bg-yellow-400';
    return { records: recordsForDay, percentage, colorClass };
  };

  const handleMonthClick = (data: any) => {
    if (data && data.index !== undefined) {
        setSelectedMonth(data.index);
        // Sync the heatmap with the clicked month
        setCurrentDate(new Date(currentDate.getFullYear(), data.index, 1));
    }
  };

  const resetDrillDown = () => {
      setSelectedMonth(null);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 animate-in slide-in-from-top-2 duration-300">
          <div>
            <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Attendance Intelligence</h2>
                {lastUpdate && <Badge variant="success" className="animate-pulse shadow-md border-none bg-green-500 text-white font-black px-3 py-1">LIVE</Badge>}
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">Analyzing institutional presence and academic consistency for <span className="text-indigo-600 font-bold uppercase">Alice Johnson</span>.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none border-slate-200 font-black uppercase text-[10px] tracking-widest h-12 px-6">Download Report</Button>
            <Button onClick={() => setIsScannerOpen(true)} className="flex-1 md:flex-none shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest px-8">
                <ScanLine className="w-4 h-4 mr-2.5"/> Terminal Check-in
            </Button>
          </div>
       </div>

       {/* Global Attendance Warning */}
       {isGlobalAttendanceCritical && (
         <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="bg-red-600 border-2 border-red-700 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-red-200 text-white">
                <div className="p-4 bg-white/20 rounded-2xl shrink-0"><ShieldAlert className="w-8 h-8 animate-pulse" /></div>
                <div className="flex-1 text-center md:text-left space-y-1">
                    <h4 className="font-black uppercase text-base tracking-tight flex items-center justify-center md:justify-start gap-2">
                      CRITICAL SYSTEM ALERT: AGGREGATE BELOW 75%
                    </h4>
                    <p className="text-red-50 font-medium opacity-90 leading-relaxed">
                      Your cumulative institutional presence of <span className="font-black text-white underline">{averageAttendance}%</span> is currently failing the mandatory compliance threshold.
                    </p>
                </div>
                <div className="shrink-0">
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-black uppercase text-[10px] tracking-widest h-10 px-6">Review Policies</Button>
                </div>
            </div>
         </div>
       )}

       {/* Per-Subject Critical Warnings (Shown only if aggregate is safe, to avoid redundancy, or always if specific subjects are low) */}
       {criticalSubjects.length > 0 && !isGlobalAttendanceCritical && (
         <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="p-4 bg-red-100 text-red-600 rounded-2xl shrink-0"><AlertTriangle className="w-8 h-8 animate-bounce" /></div>
                <div className="flex-1 text-center md:text-left space-y-1">
                    <h4 className="text-red-900 font-black uppercase text-sm tracking-tight">Debarment Vulnerability Detected</h4>
                    <p className="text-red-700 text-sm font-medium opacity-80 leading-relaxed">You are currently below the <span className="font-black underline">75% mandatory threshold</span> in {criticalSubjects.length} core subjects.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    {criticalSubjects.map(s => <Badge key={s.id} variant="error" className="bg-red-600 text-white border-none px-4 py-1.5 font-black uppercase text-[9px] tracking-widest">{s.code}</Badge>)}
                </div>
            </div>
         </div>
       )}

       <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          <Card className="hover:shadow-2xl transition-all group overflow-hidden border-slate-100 p-6 flex flex-col justify-between">
             <div className="relative z-10">
               <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.25em] mb-4">Total Present</p>
               <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{attendedClasses}</p>
                  <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Units</span>
               </div>
             </div>
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle2 className="w-24 h-24" /></div>
          </Card>
          
          <Card className="hover:shadow-2xl transition-all group overflow-hidden border-slate-100 p-6 flex flex-col justify-between">
             <div className="relative z-10">
               <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.25em] mb-4">Total Absent</p>
               <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{absentClasses}</p>
                  <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Units</span>
               </div>
             </div>
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><XCircle className="w-24 h-24" /></div>
          </Card>

          <Card className={`md:col-span-1 lg:col-span-2 ${isGlobalAttendanceCritical ? 'bg-red-600 animate-pulse' : 'bg-slate-900'} text-white border-none shadow-md relative overflow-hidden group transition-all duration-500`}>
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/20 transition-all"></div>
             <div className="relative z-10 flex flex-col md:flex-row h-full p-2">
               <div className="flex-1 p-6">
                 <p className={`text-[10px] font-black ${isGlobalAttendanceCritical ? 'text-red-100' : 'text-indigo-400'} uppercase tracking-[0.25em] mb-4`}>Overall Standing</p>
                 <div className="flex items-baseline gap-4">
                    <span className="text-7xl font-black tracking-tighter text-white">{averageAttendance}%</span>
                    <span className={`text-sm font-black ${isGlobalAttendanceCritical ? 'text-red-200' : 'text-slate-500'} uppercase tracking-[0.3em]`}>Rating</span>
                 </div>
                 <div className="mt-8 flex items-center gap-6">
                     <div className="space-y-1">
                         <p className={`text-[9px] font-black ${isGlobalAttendanceCritical ? 'text-red-100' : 'text-slate-500'} uppercase tracking-widest`}>Status Indicator</p>
                         <p className="font-black text-xl text-white">
                           {isGlobalAttendanceCritical ? 'NON-COMPLIANT' : 'SECURE'}
                         </p>
                     </div>
                 </div>
               </div>
               <div className="w-full md:w-56 h-48 md:h-full relative flex items-center justify-center p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={gaugeData} cx="50%" cy="60%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={85} dataKey="value" stroke="none" paddingAngle={4} cornerRadius={12} animationDuration={1500}>
                        {gaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color === '#ef4444' && isGlobalAttendanceCritical ? '#ffffff' : entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 pointer-events-none">
                         <span className={`text-[10px] font-black ${isGlobalAttendanceCritical ? 'text-red-100' : 'text-slate-600'} uppercase tracking-[0.4em]`}>Target</span>
                         <span className={`text-xs font-black mt-0.5 ${averageAttendance >= 75 ? 'text-green-400' : 'text-white'}`}>75% GOAL</span>
                   </div>
               </div>
             </div>
          </Card>
       </div>

       <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
             {/* Institutional Yearly Pulse with Drill-down */}
             <Card title="Institutional Yearly Pulse" className="group relative">
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4 text-indigo-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {selectedMonth !== null 
                                ? `Inspecting ${monthNames[selectedMonth]}. Stability matrix updated.`
                                : 'Select a month bar to analyze subject trends.'}
                        </p>
                    </div>
                    {selectedMonth !== null && (
                        <button onClick={resetDrillDown} className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 transition-all shadow-sm">
                            <FilterX className="w-3 h-3" /> Reset Pulse
                        </button>
                    )}
                </div>
                <div className="h-80 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} onClick={(data: any) => handleMonthClick(data?.activePayload?.[0]?.payload)}>
                          <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#818cf8" /></linearGradient>
                            <linearGradient id="selectedGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 900, fill: '#94a3b8'}}/>
                          <YAxis domain={[0, 100]} hide />
                          <RechartsTooltip cursor={{fill: '#f8fafc', opacity: 0.8}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}} formatter={(value: number) => [`${value}% Presence`, '']}/>
                          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" />
                          <Bar dataKey="rate" radius={[12, 12, 12, 12] as any} fill="url(#barGrad)" animationDuration={1500} cursor="pointer">
                             {yearlyTrendData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={selectedMonth === entry.index ? 'url(#selectedGrad)' : (entry.rate && entry.rate < 75 ? '#f87171' : 'url(#barGrad)')} stroke={selectedMonth === entry.index ? '#059669' : 'none'} strokeWidth={2}/>
                             ))}
                             <LabelList dataKey="rate" position="top" style={{ fontSize: '10px', fontWeight: '900', fill: '#64748b' }} formatter={(v: any) => v ? `${v}%` : ''} />
                          </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </Card>

             {/* Dynamic Subject Stability Matrix */}
             <Card title={selectedMonth !== null ? `Stability Matrix: ${monthNames[selectedMonth]}` : "Cumulative Stability Matrix"}>
                <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={subjectPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="rate" stroke={selectedMonth !== null ? "#10b981" : "#4f46e5"} strokeWidth={4} dot={{ r: 6, fill: selectedMonth !== null ? "#10b981" : "#4f46e5", strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} animationDuration={2000}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-3">
                        <TrendingUp className={`w-5 h-5 ${selectedMonth !== null ? 'text-emerald-600' : 'text-indigo-600'}`} />
                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">
                            {selectedMonth !== null ? `Monthly Precision Node: ${monthNames[selectedMonth]}` : `Institutional Consistency Factor: 0.92`}
                        </span>
                    </div>
                    {selectedMonth !== null && <button onClick={resetDrillDown} className="text-[9px] font-black text-emerald-700 underline uppercase tracking-widest">Show Cumulative</button>}
                </div>
             </Card>
          </div>

          <div className="space-y-8">
             <Card title="Heatmap Visualizer" className="group border-slate-200 shadow-xl overflow-hidden p-6">
                <div className="flex items-center justify-between mb-8">
                   <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Terminal Logs</h3>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Daily Engagement</p>
                   </div>
                   <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                      <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 shadow-sm"><ChevronLeft className="w-4 h-4"/></button>
                      <span className="text-[10px] font-black text-slate-700 w-28 text-center uppercase tracking-[0.2em]">{monthNames[month]} {year}</span>
                      <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 shadow-sm"><ChevronRight className="w-4 h-4"/></button>
                   </div>
                </div>
                <div className="w-full">
                   <div className="grid grid-cols-7 gap-2">
                       {paddingArray.map(i => <div key={`pad-${i}`} className="aspect-square opacity-20"></div>)}
                       {daysArray.map(day => {
                           const data = getDayAttendance(day);
                           const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                           return (
                               <div key={day} className="aspect-square relative" onMouseEnter={() => setHoveredDay(day)} onMouseLeave={() => setHoveredDay(null)}>
                                  <div className={`w-full h-full rounded-xl flex items-center justify-center text-[11px] font-black transition-all duration-500 cursor-pointer ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2' : ''} ${data ? `${data.colorClass} text-white shadow-xl` : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-transparent hover:border-slate-200'}`}>
                                      {day}
                                  </div>
                                  {hoveredDay === day && data && (
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-40 bg-slate-900 text-white text-[10px] rounded-2xl px-4 py-3 shadow-2xl z-50 pointer-events-none text-center animate-in fade-in zoom-in-95 border border-white/10 backdrop-blur-md">
                                          <p className="font-black uppercase tracking-[0.2em] border-b border-white/10 pb-2 mb-2 text-indigo-400">LOG SESSION</p>
                                          <p className="font-bold opacity-90">Engagement: {data.percentage.toFixed(0)}% presence</p>
                                      </div>
                                  )}
                               </div>
                           );
                       })}
                   </div>
                </div>
             </Card>

             <Card className="bg-indigo-600 text-white border-none shadow-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform"><BarChart2 className="w-32 h-32"/></div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-xl font-black uppercase tracking-tight leading-none">Smart Scheduler</h4>
                    <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">Maintain your consistency streak with automated AI alerts.</p>
                    <Button variant="secondary" className="w-full bg-white text-indigo-700 h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Configure Alerts</Button>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
};

export default StudentAttendance;
