
import React, { useState, useEffect } from 'react';
import { Subject, AttendanceRecord } from '../../types';
import { Card, Badge, Button, Modal } from '../../components/UIComponents';
import { ScanLine, CheckCircle2, XCircle, School, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle, Calculator, RefreshCw, Smartphone, Search, Zap, Loader2, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, ReferenceLine, LabelList } from 'recharts';

interface StudentAttendanceProps {
  history: AttendanceRecord[];
  subjects: Subject[];
  lastUpdate?: string | null;
  onMarkAttendance?: (subjectName: string) => void;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ history, subjects, lastUpdate, onMarkAttendance }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'LATE'>('ALL');
  
  // Scanner State
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [detectedSubject, setDetectedSubject] = useState<string | null>(null);

  // Calculator State
  const [calcClasses, setCalcClasses] = useState<number>(5);
  const [calcAction, setCalcAction] = useState<'ATTEND' | 'MISS'>('ATTEND');

  // Calendar Heatmap State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Sort history by date descending
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const filteredHistory = filterStatus === 'ALL' 
    ? sortedHistory 
    : sortedHistory.filter(h => h.status === filterStatus);

  // --- Calculations ---
  const totalClasses = subjects.reduce((a, b) => a + b.totalClasses, 0);
  const attendedClasses = subjects.reduce((a, b) => a + b.attendedClasses, 0);
  const absentClasses = totalClasses - attendedClasses;
  const averageAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  // Projection Calculation
  const newTotal = totalClasses + calcClasses;
  const newAttended = calcAction === 'ATTEND' ? attendedClasses + calcClasses : attendedClasses;
  const projectedPercentage = newTotal > 0 ? Math.round((newAttended / newTotal) * 100) : 0;
  const projectionDiff = projectedPercentage - averageAttendance;

  const getStatusColor = (pct: number) => {
      if (pct >= 75) return '#4ade80';
      if (pct >= 60) return '#facc15';
      return '#f87171';
  };

  const gaugeData = [
    { name: 'Attended', value: averageAttendance, color: getStatusColor(averageAttendance) },
    { name: 'Missed', value: 100 - averageAttendance, color: '#334155' }
  ];

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDayAttendance = (day: number) => {
    const recordsForDay = history.filter(r => {
        const d = new Date(r.date);
        return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });

    if (recordsForDay.length === 0) return null;

    const presentCount = recordsForDay.filter(r => r.status === 'PRESENT').length;
    const percentage = (presentCount / recordsForDay.length) * 100;
    
    let status = 'PARTIAL';
    let colorClass = 'bg-yellow-400';
    
    if (percentage === 100) {
        status = 'FULL';
        colorClass = 'bg-emerald-500';
    } else if (percentage === 0) {
        status = 'ABSENT';
        colorClass = 'bg-red-500';
    }

    return { records: recordsForDay, percentage, status, colorClass };
  };

  const changeMonth = (offset: number) => {
      setCurrentDate(new Date(year, month + offset, 1));
  };

  const handleSimulateScan = (subjectName: string) => {
      setIsProcessing(true);
      setDetectedSubject(subjectName);
      
      // Simulation delay for "processing"
      setTimeout(() => {
          setIsProcessing(false);
          setScanSuccess(true);
          
          // Final delay to show success animation before closing
          setTimeout(() => {
              if (onMarkAttendance) {
                  onMarkAttendance(subjectName);
              }
              setIsScannerOpen(false);
              setScanSuccess(false);
              setDetectedSubject(null);
          }, 1500);
      }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       {/* Header & Actions */}
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 animate-in slide-in-from-top-2 duration-300">
          <div>
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Attendance Analytics</h2>
                {lastUpdate && (
                    <Badge variant="success" className="animate-pulse shadow-sm">
                        <span className="flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Live Updates
                        </span>
                    </Badge>
                )}
            </div>
            <p className="text-slate-500 text-sm mt-1">
                Track presence and view academic consistency across all departments.
            </p>
          </div>
          <Button onClick={() => setIsScannerOpen(true)} className="shadow-xl shadow-indigo-600/20 w-full md:w-auto hover:scale-105 active:scale-95 transition-all bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold">
             <ScanLine className="w-5 h-5 mr-2.5"/> Check-in Session
          </Button>
       </div>

       {/* Stats Grid */}
       <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 animate-in slide-in-from-top-4 duration-500 delay-75 fill-mode-backwards">
          <Card className="bg-white border-slate-200 hover:border-green-200 hover:shadow-lg transition-all group overflow-hidden">
             <div className="flex items-center justify-between relative z-10">
               <div>
                 <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">Attended</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-4xl font-black text-slate-900">{attendedClasses}</p>
                    <span className="text-xs text-slate-400 font-bold uppercase">Lectures</span>
                 </div>
               </div>
               <div className="p-4 bg-green-50 rounded-2xl text-green-600 shadow-inner group-hover:rotate-12 transition-transform duration-500"><CheckCircle2 className="h-7 w-7"/></div>
             </div>
             <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          </Card>
          <Card className="bg-white border-slate-200 hover:border-red-200 hover:shadow-lg transition-all group overflow-hidden">
             <div className="flex items-center justify-between relative z-10">
               <div>
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Absent</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-4xl font-black text-slate-900">{absentClasses}</p>
                    <span className="text-xs text-slate-400 font-bold uppercase">Lectures</span>
                 </div>
               </div>
               <div className="p-4 bg-red-50 rounded-2xl text-red-500 shadow-inner group-hover:-rotate-12 transition-transform duration-500"><XCircle className="h-7 w-7"/></div>
             </div>
             <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-red-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          </Card>

          <Card className="md:col-span-1 lg:col-span-2 relative overflow-hidden bg-slate-900 text-white border-none shadow-2xl transform transition-all hover:scale-[1.01] flex flex-col justify-between">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
             
             <div className="flex flex-col md:flex-row items-center justify-between h-full relative z-10 px-4 py-2">
               <div className="flex-1 mb-4 md:mb-0">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Overall Completion</p>
                 <div className="flex items-baseline gap-3">
                    <span className={`text-7xl font-black tracking-tighter ${averageAttendance >= 75 ? 'text-green-400' : averageAttendance >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{averageAttendance}%</span>
                    <span className="text-lg font-bold opacity-40 text-slate-400 uppercase tracking-widest">Rate</span>
                 </div>
                 
                 <div className="mt-5 inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-bold backdrop-blur-md">
                    {averageAttendance >= 75 ? (
                        <span className="flex items-center text-green-300"><CheckCircle2 className="w-3.5 h-3.5 mr-2"/> STATUS: SAFE ZONE</span>
                    ) : (
                        <span className="flex items-center text-red-300"><AlertTriangle className="w-3.5 h-3.5 mr-2"/> STATUS: ACTION REQUIRED</span>
                    )}
                 </div>
               </div>
               
               <div className="h-40 w-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="70%" 
                        startAngle={180}
                        endAngle={0}
                        innerRadius={65}
                        outerRadius={85}
                        dataKey="value"
                        stroke="none"
                        paddingAngle={5}
                        cornerRadius={10}
                      >
                        {gaugeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                   <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Goal 75%</span>
                   </div>
               </div>
             </div>
          </Card>
       </div>

       {/* Calculator & Visuals */}
       <div className="grid gap-6 lg:grid-cols-3 animate-in slide-in-from-top-4 duration-500 delay-150 fill-mode-backwards">
          <div className="lg:col-span-2 space-y-6">
             <Card title="Module Analysis">
                <div className="h-80 w-full mt-2">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical"
                        data={subjects.map(s => ({ 
                            code: s.code, 
                            name: s.name, 
                            pct: s.totalClasses > 0 ? Math.round((s.attendedClasses / s.totalClasses) * 100) : 0,
                            attended: s.attendedClasses,
                            total: s.totalClasses
                        }))}
                        margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
                        barSize={24}
                      >
                          <defs>
                            <linearGradient id="gradGreen" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4ade80" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.8}/>
                            </linearGradient>
                            <linearGradient id="gradYellow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#facc15" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#eab308" stopOpacity={0.8}/>
                            </linearGradient>
                            <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                          <XAxis type="number" domain={[0, 100]} hide />
                          <YAxis 
                            dataKey="code" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 11, fontWeight: 700, fill: '#64748b'}} 
                            width={50}
                          />
                          <RechartsTooltip 
                             cursor={{fill: '#f8fafc', opacity: 0.8}}
                             contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px'}}
                             formatter={(value: number, name: string, props: any) => [
                                <div key="val" className="flex flex-col">
                                    <span className="font-black text-2xl text-slate-900 tracking-tighter">{value}%</span>
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{props.payload.attended} / {props.payload.total} Classes</span>
                                    <span className="text-[10px] text-indigo-600 font-bold mt-2 uppercase">{props.payload.name}</span>
                                </div>, 
                                ''
                             ]}
                          />
                          <ReferenceLine x={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '75%', position: 'top', fill: '#ef4444', fontSize: 10, fontWeight: '900', dy: -5 }} />
                          <Bar 
                            dataKey="pct" 
                            radius={[0, 8, 8, 0] as any} 
                            background={{ fill: '#f8fafc', radius: [0, 8, 8, 0] as any }}
                            animationDuration={1500}
                          >
                            {
                                subjects.map((entry, index) => {
                                    const pct = entry.totalClasses > 0 ? Math.round((entry.attendedClasses / entry.totalClasses) * 100) : 0;
                                    return <Cell key={`cell-${index}`} fill={pct >= 75 ? "url(#gradGreen)" : pct >= 60 ? "url(#gradYellow)" : "url(#gradRed)"} />;
                                })
                            }
                            <LabelList dataKey="pct" position="right" style={{ fontSize: '11px', fontWeight: '900', fill: '#94a3b8' }} formatter={(val: number) => `${val}%`}/>
                          </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </Card>
          </div>

          <div className="space-y-6">
             <Card title="What-If Simulator" className="bg-indigo-50/30 border-indigo-100 shadow-sm">
                 <div className="space-y-5">
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Predict your future attendance rate by simulating scheduled sessions.</p>
                     
                     <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-indigo-100 shadow-inner">
                         <button 
                            onClick={() => setCalcAction('ATTEND')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calcAction === 'ATTEND' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
                         >
                             If I Attend
                         </button>
                         <button 
                            onClick={() => setCalcAction('MISS')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calcAction === 'MISS' ? 'bg-red-500 text-white shadow-md' : 'text-slate-400 hover:text-red-600 hover:bg-red-50/50'}`}
                         >
                             If I Miss
                         </button>
                     </div>

                     <div className="flex items-center gap-6 py-2">
                         <button onClick={() => setCalcClasses(Math.max(1, calcClasses - 1))} className="p-3 bg-white rounded-2xl shadow-sm text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all active:scale-90 border border-slate-100"><ChevronLeft className="w-5 h-5"/></button>
                         <div className="flex-1 text-center">
                             <span className="text-4xl font-black text-slate-800 tabular-nums">{calcClasses}</span>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Sessions</p>
                         </div>
                         <button onClick={() => setCalcClasses(calcClasses + 1)} className="p-3 bg-white rounded-2xl shadow-sm text-slate-600 hover:text-indigo-600 hover:shadow-md transition-all active:scale-90 border border-slate-100"><ChevronRight className="w-5 h-5"/></button>
                     </div>

                     <div className="bg-white p-5 rounded-2xl border border-indigo-100 text-center shadow-sm relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Simulated Result</p>
                         <div className="flex items-center justify-center gap-3">
                             <span className={`text-4xl font-black tabular-nums ${projectedPercentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                                 {projectedPercentage}%
                             </span>
                             {projectionDiff !== 0 && (
                                 <Badge variant={projectionDiff > 0 ? 'success' : 'error'} className="text-[10px] font-black border-none px-2 py-1">
                                     {projectionDiff > 0 ? '+' : ''}{projectionDiff}%
                                 </Badge>
                             )}
                         </div>
                     </div>
                 </div>
             </Card>

             <Card className="group">
                <div className="flex items-center justify-between mb-6">
                   <div>
                       <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Campus Log</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Session Heatmap</p>
                   </div>
                   <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-600"><ChevronLeft className="w-4 h-4"/></button>
                      <span className="text-[10px] font-black text-slate-700 w-24 text-center uppercase tracking-widest">{monthNames[month]}</span>
                      <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-600"><ChevronRight className="w-4 h-4"/></button>
                   </div>
                </div>

                <div className="w-full">
                   <div className="grid grid-cols-7 mb-3">
                       {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                           <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase">{d}</div>
                       ))}
                   </div>
                   <div className="grid grid-cols-7 gap-1.5">
                       {paddingArray.map(i => <div key={`pad-${i}`} className="aspect-square"></div>)}
                       {daysArray.map(day => {
                           const data = getDayAttendance(day);
                           return (
                               <div 
                                  key={day} 
                                  className="aspect-square relative group"
                                  onMouseEnter={() => setHoveredDay(day)}
                                  onMouseLeave={() => setHoveredDay(null)}
                               >
                                  <div className={`w-full h-full rounded-lg flex items-center justify-center text-[10px] font-black transition-all duration-500 cursor-default ${
                                      data 
                                      ? `${data.colorClass} text-white shadow-md shadow-slate-200` 
                                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                                  }`}>
                                      {day}
                                  </div>
                                  
                                  {hoveredDay === day && data && (
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-900 text-white text-[10px] rounded-xl px-3 py-2 shadow-2xl z-20 pointer-events-none text-center animate-in fade-in slide-in-from-bottom-1 duration-200">
                                          <p className="font-black uppercase tracking-widest border-b border-white/10 pb-1 mb-1">{data.status} DAY</p>
                                          <p className="opacity-70">{data.percentage.toFixed(0)}% attendance rate</p>
                                      </div>
                                  )}
                               </div>
                           );
                       })}
                   </div>
                </div>
             </Card>
          </div>
       </div>

       {/* Detailed Attendance List */}
       <Card className="overflow-hidden border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-500 delay-200 fill-mode-backwards">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-50">
              <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Activity History</h3>
                  <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Audit Log</p>
                      {filterStatus !== 'ALL' && <span className="h-1 w-1 rounded-full bg-slate-300"></span>}
                      {filterStatus !== 'ALL' && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Showing {filteredHistory.length} {filterStatus.toLowerCase()} entries</span>
                            <button onClick={() => setFilterStatus('ALL')} className="text-slate-400 hover:text-red-500 transition-colors"><X className="w-3 h-3"/></button>
                          </div>
                      )}
                  </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shadow-inner">
                  {(['ALL', 'PRESENT', 'ABSENT', 'LATE'] as const).map(status => (
                      <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-white shadow-md text-indigo-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                          {status}
                      </button>
                  ))}
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                      <tr>
                          <th className="px-6 py-5">Timestamp</th>
                          <th className="px-6 py-5">Academic Module</th>
                          <th className="px-6 py-5">Venue & Slot</th>
                          <th className="px-6 py-5 text-center">Status</th>
                          <th className="px-6 py-5 text-right">Verification</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                      {filteredHistory.map((record) => (
                          <tr key={record.id} className="hover:bg-indigo-50/30 transition-all group">
                              <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-[10px] font-black border-2 shadow-sm transition-transform group-hover:scale-110 duration-500 ${
                                          record.status === 'PRESENT' ? 'bg-green-50 text-green-700 border-green-100 shadow-green-100' : 
                                          record.status === 'LATE' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 shadow-yellow-100' : 
                                          'bg-red-50 text-red-700 border-red-100 shadow-red-100'
                                      }`}>
                                          <span className="uppercase opacity-60 tracking-widest">{new Date(record.date).toLocaleString('en-US', {month: 'short'})}</span>
                                          <span className="text-base leading-none">{new Date(record.date).getDate()}</span>
                                      </div>
                                      <div>
                                          <p className="font-black text-slate-900 tracking-tight">{new Date(record.date).toLocaleDateString()}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(record.date).toLocaleDateString('en-US', {weekday: 'long'})}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-5">
                                  <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{record.subjectName || 'General Assembly'}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5"><School className="w-3 h-3 text-indigo-300"/> Science Block 04</p>
                              </td>
                              <td className="px-6 py-5">
                                  <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-2 bg-slate-100/80 w-fit px-2.5 py-1 rounded-lg border border-slate-200 group-hover:bg-white transition-colors">
                                          <Clock className="w-3 h-3 text-indigo-500"/>
                                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">09:00 - 10:30</span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Room 304 • Prof. Davis</p>
                                  </div>
                              </td>
                              <td className="px-6 py-5 text-center">
                                  <Badge variant={record.status === 'PRESENT' ? 'success' : record.status === 'LATE' ? 'warning' : 'error'} className="px-4 py-1.5 font-black uppercase tracking-widest rounded-full shadow-sm text-[9px] border-none">
                                      {record.status}
                                  </Badge>
                              </td>
                              <td className="px-6 py-5 text-right">
                                  {record.status === 'ABSENT' ? (
                                      <div className="flex flex-col items-end gap-1">
                                          <span className="text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> Unverified</span>
                                          <button className="text-[9px] text-indigo-500 hover:text-indigo-700 font-black uppercase tracking-widest hover:underline">Apply Pardon</button>
                                      </div>
                                  ) : (
                                      <div className="flex items-center justify-end gap-2 text-green-600">
                                          <CheckCircle2 className="w-4 h-4"/>
                                          <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {filteredHistory.length === 0 && (
                          <tr>
                              <td colSpan={5} className="px-6 py-20 text-center">
                                  <div className="max-w-xs mx-auto">
                                      <Search className="w-12 h-12 mx-auto mb-4 text-slate-100" />
                                      <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Log entry not found</p>
                                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">There are no records matching your current selection criteria in the campus audit logs.</p>
                                      <Button variant="outline" size="sm" className="mt-6 font-black uppercase tracking-widest text-[10px]" onClick={() => setFilterStatus('ALL')}>Reset View</Button>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
       </Card>

       {/* Enhanced Virtual QR Scanner Modal */}
       <Modal isOpen={isScannerOpen} onClose={() => { setIsScannerOpen(false); setScanSuccess(false); setIsProcessing(false); }} title="Session Check-in">
         <div className="space-y-6 py-2 animate-in fade-in slide-in-from-top-4 duration-300">
            {!scanSuccess ? (
                <>
                <div className="relative w-full aspect-square bg-slate-950 rounded-[40px] overflow-hidden border-8 border-slate-900 shadow-2xl group ring-1 ring-white/5">
                    {/* Mock Camera View */}
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000')] bg-cover bg-center grayscale blur-[1px] group-hover:scale-105 transition-transform duration-1000"></div>
                    <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-[0.5px]"></div>
                    
                    {/* Scanner Lines & Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="w-full h-full border-2 border-white/10 rounded-3xl relative">
                            {/* Scanning Laser */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_20px_rgba(74,222,128,1)] animate-[scan_2s_infinite] z-20"></div>
                            
                            {/* Corner Accents */}
                            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-xl shadow-[-2px_-2px_10px_rgba(0,0,0,0.5)]"></div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-xl shadow-[2px_-2px_10px_rgba(0,0,0,0.5)]"></div>
                            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-xl shadow-[-2px_2px_10px_rgba(0,0,0,0.5)]"></div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-xl shadow-[2px_2px_10px_rgba(0,0,0,0.5)]"></div>

                            {/* Processing Indicator */}
                            {isProcessing && (
                                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30 animate-in fade-in zoom-in duration-300">
                                    <div className="relative mb-6">
                                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                                        <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
                                    </div>
                                    <p className="text-white font-black tracking-[0.3em] text-sm uppercase">Decoding</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Active Target: {detectedSubject}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 z-10 flex items-center gap-3 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                        <span className="text-[10px] text-white font-black uppercase tracking-[0.2em] whitespace-nowrap">Check-in Terminal Live</span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-10">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl">
                             <div className="flex items-center gap-4">
                                 <div className="p-2 bg-indigo-500/20 rounded-xl"><Smartphone className="w-5 h-5 text-indigo-300" /></div>
                                 <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest leading-relaxed">
                                     Center the academic session code within the frame for automatic biometric verification.
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Search className="w-4 h-4"/>
                            <span className="text-[10px] font-black uppercase tracking-widest">Modules Detected Nearby</span>
                        </div>
                        <Badge variant="neutral" className="bg-slate-100 text-slate-500 border-none px-2 py-0.5 text-[9px] font-black uppercase">Low Latency</Badge>
                    </div>
                    
                    <div className="grid gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                        {subjects.map((sub, i) => (
                            <button 
                                key={sub.id} 
                                disabled={isProcessing}
                                onClick={() => handleSimulateScan(sub.name)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-600/5 border border-slate-200 hover:border-indigo-200 rounded-3xl transition-all duration-300 group relative overflow-hidden"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-slate-900 group-hover:text-indigo-900 transition-colors uppercase tracking-tight">{sub.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{sub.code} • SESSION ACTIVE</p>
                                    </div>
                                </div>
                                <div className="p-2.5 bg-white rounded-xl border border-slate-200 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 relative z-10 shadow-sm">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in duration-500">
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-8 border-white ring-4 ring-green-100">
                            <CheckCircle2 className="w-16 h-16 text-white animate-in slide-in-from-bottom-2 duration-500" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Session Verified</h3>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Biometric check-in successful</p>
                    <div className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 animate-in slide-in-from-top-2 duration-700 delay-200 fill-mode-backwards">
                        {detectedSubject}
                    </div>
                    <div className="mt-12 flex flex-col items-center gap-2">
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Redirecting Terminal</p>
                    </div>
                </div>
            )}
         </div>

         <style>{`
            @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #e2e8f0;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #cbd5e1;
            }
         `}</style>
      </Modal>
    </div>
  );
};

export default StudentAttendance;
