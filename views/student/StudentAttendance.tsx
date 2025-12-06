
import React, { useState } from 'react';
import { Subject, AttendanceRecord } from '../../types';
import { MOCK_COLLEGE_INFO } from '../../constants';
import { Card, Badge, Button, Modal } from '../../components/UIComponents';
import { ScanLine, CheckCircle2, XCircle, School, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle, Calculator, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, ReferenceLine, LabelList } from 'recharts';

interface StudentAttendanceProps {
  history: AttendanceRecord[];
  subjects: Subject[];
  lastUpdate?: string | null;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ history, subjects, lastUpdate }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'LATE'>('ALL');
  
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

  // Determine Overall Status Color
  const getStatusColor = (pct: number) => {
      if (pct >= 75) return '#4ade80'; // Green-400
      if (pct >= 60) return '#facc15'; // Yellow-400
      return '#f87171'; // Red-400
  };

  const gaugeData = [
    { name: 'Attended', value: averageAttendance, color: getStatusColor(averageAttendance) },
    { name: 'Missed', value: 100 - averageAttendance, color: '#334155' } // Slate-700 for empty track on dark bg
  ];

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       {/* Header & Actions */}
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">Attendance Analytics</h2>
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
            <p className="text-slate-500 flex items-center gap-2">
                Track your presence and academic consistency.
                {lastUpdate && <span className="text-xs text-slate-400 font-mono">Last update: {lastUpdate}</span>}
            </p>
          </div>
          <Button onClick={() => setIsScannerOpen(true)} className="shadow-lg shadow-indigo-500/20 w-full md:w-auto hover:scale-105 transition-transform">
             <ScanLine className="w-4 h-4 mr-2"/> Scan Class QR
          </Button>
       </div>

       {/* Stats Grid */}
       <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Summary Cards */}
          <Card className="bg-white border-slate-200 hover:border-green-200 hover:shadow-md transition-all">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Present</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-3xl font-black text-slate-900">{attendedClasses}</p>
                    <span className="text-xs text-slate-400 font-medium">classes</span>
                 </div>
               </div>
               <div className="p-3 bg-green-50 rounded-xl text-green-600 shadow-sm"><CheckCircle2 className="h-6 w-6"/></div>
             </div>
          </Card>
          <Card className="bg-white border-slate-200 hover:border-red-200 hover:shadow-md transition-all">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Absent</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-3xl font-black text-slate-900">{absentClasses}</p>
                    <span className="text-xs text-slate-400 font-medium">classes</span>
                 </div>
               </div>
               <div className="p-3 bg-red-50 rounded-xl text-red-500 shadow-sm"><XCircle className="h-6 w-6"/></div>
             </div>
          </Card>

          {/* Dynamic Gauge Card */}
          <Card className="md:col-span-1 lg:col-span-2 relative overflow-hidden bg-slate-900 text-white border-none shadow-xl transform transition-all hover:scale-[1.01] flex flex-col justify-between">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
             
             <div className="flex flex-col md:flex-row items-center justify-between h-full relative z-10 px-4 py-2">
               <div className="flex-1 mb-4 md:mb-0">
                 <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Overall Attendance Rate</p>
                 <div className="flex items-baseline gap-2">
                    <span className={`text-6xl font-black tracking-tight ${averageAttendance >= 75 ? 'text-green-400' : averageAttendance >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{averageAttendance}%</span>
                    <span className="text-lg font-medium opacity-80 text-slate-300">Current</span>
                 </div>
                 
                 <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium backdrop-blur-sm">
                    {averageAttendance >= 75 ? (
                        <span className="flex items-center text-green-300"><CheckCircle2 className="w-3 h-3 mr-1.5"/> You are in the safe zone</span>
                    ) : (
                        <span className="flex items-center text-red-300"><AlertTriangle className="w-3 h-3 mr-1.5"/> Attention Needed</span>
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
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target 75%</span>
                   </div>
               </div>
             </div>
          </Card>
       </div>

       {/* Calculator & Visuals */}
       <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
             {/* Subject Attendance Horizontal Bar Graph */}
             <Card title="Subject-wise Breakdown">
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
                             contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                             formatter={(value: number, name: string, props: any) => [
                                <div key="val" className="flex flex-col">
                                    <span className="font-bold text-lg text-slate-800">{value}%</span>
                                    <span className="text-xs text-slate-500 font-medium">{props.payload.attended}/{props.payload.total} Classes</span>
                                    <span className="text-xs text-slate-400">{props.payload.name}</span>
                                </div>, 
                                ''
                             ]}
                          />
                          <ReferenceLine x={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '75%', position: 'top', fill: '#ef4444', fontSize: 10, fontWeight: 'bold', dy: -5 }} />
                          <Bar 
                            dataKey="pct" 
                            radius={[0, 6, 6, 0] as any} 
                            background={{ fill: '#f8fafc', radius: [0, 6, 6, 0] as any }}
                            animationDuration={1200}
                          >
                            {
                                subjects.map((entry, index) => {
                                    const pct = entry.totalClasses > 0 ? Math.round((entry.attendedClasses / entry.totalClasses) * 100) : 0;
                                    return <Cell key={`cell-${index}`} fill={pct >= 75 ? "url(#gradGreen)" : pct >= 60 ? "url(#gradYellow)" : "url(#gradRed)"} />;
                                })
                            }
                            <LabelList dataKey="pct" position="right" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#64748b' }} formatter={(val: number) => `${val}%`}/>
                          </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </Card>
          </div>

          <div className="space-y-6">
             {/* Attendance Calculator */}
             <Card title="Projection Calculator" className="bg-indigo-50/50 border-indigo-100">
                 <div className="space-y-4">
                     <p className="text-xs text-slate-500">Calculate how attending or missing future classes affects your percentage.</p>
                     
                     <div className="flex gap-2 bg-white p-1 rounded-lg border border-indigo-100">
                         <button 
                            onClick={() => setCalcAction('ATTEND')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${calcAction === 'ATTEND' ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-slate-50'}`}
                         >
                             If I Attend
                         </button>
                         <button 
                            onClick={() => setCalcAction('MISS')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${calcAction === 'MISS' ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-50'}`}
                         >
                             If I Miss
                         </button>
                     </div>

                     <div className="flex items-center gap-4">
                         <button onClick={() => setCalcClasses(Math.max(1, calcClasses - 1))} className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-indigo-600"><ChevronLeft className="w-4 h-4"/></button>
                         <div className="flex-1 text-center">
                             <span className="text-2xl font-black text-slate-800">{calcClasses}</span>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">Classes</p>
                         </div>
                         <button onClick={() => setCalcClasses(calcClasses + 1)} className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-indigo-600"><ChevronRight className="w-4 h-4"/></button>
                     </div>

                     <div className="bg-white p-4 rounded-xl border border-indigo-100 text-center">
                         <p className="text-xs text-slate-500 mb-1">New Percentage</p>
                         <div className="flex items-center justify-center gap-2">
                             <span className={`text-3xl font-black ${projectedPercentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                                 {projectedPercentage}%
                             </span>
                             {projectionDiff !== 0 && (
                                 <Badge variant={projectionDiff > 0 ? 'success' : 'error'} className="text-[10px]">
                                     {projectionDiff > 0 ? '+' : ''}{projectionDiff}%
                                 </Badge>
                             )}
                         </div>
                     </div>
                 </div>
             </Card>

             {/* Attendance Heatmap / Calendar View */}
             <Card>
                <div className="flex items-center justify-between mb-6">
                   <div>
                       <h3 className="text-lg font-bold text-slate-900">Calendar</h3>
                       <p className="text-xs text-slate-500">Monthly view</p>
                   </div>
                   <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white rounded-md transition-colors"><ChevronLeft className="w-3 h-3 text-slate-600"/></button>
                      <span className="text-xs font-bold text-slate-700 w-20 text-center">{monthNames[month]}</span>
                      <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white rounded-md transition-colors"><ChevronRight className="w-3 h-3 text-slate-600"/></button>
                   </div>
                </div>

                {/* Calendar Grid */}
                <div className="w-full">
                   <div className="grid grid-cols-7 mb-2">
                       {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                           <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>
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
                                  <div className={`w-full h-full rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                      data 
                                      ? `${data.colorClass} text-white shadow-sm` 
                                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                  }`}>
                                      {day}
                                  </div>
                                  
                                  {/* Minimal Tooltip for Calendar */}
                                  {hoveredDay === day && data && (
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-24 bg-slate-900 text-white text-[10px] rounded px-2 py-1 shadow-lg z-20 pointer-events-none text-center">
                                          {data.status} ({data.percentage.toFixed(0)}%)
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
       <Card className="overflow-hidden border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-2">
              <div>
                  <h3 className="text-lg font-bold text-slate-900">Attendance History</h3>
                  <p className="text-sm text-slate-500">Detailed logs of your class attendance.</p>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                  <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                      {(['ALL', 'PRESENT', 'ABSENT', 'LATE'] as const).map(status => (
                          <button
                              key={status}
                              onClick={() => setFilterStatus(status)}
                              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === status ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Time Slot</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4 text-right">Remarks</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold border ${
                                          record.status === 'PRESENT' ? 'bg-green-50 text-green-700 border-green-100' : 
                                          record.status === 'LATE' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                                          'bg-red-50 text-red-700 border-red-100'
                                      }`}>
                                          <span className="uppercase">{new Date(record.date).toLocaleString('en-US', {month: 'short'})}</span>
                                          <span className="text-sm">{new Date(record.date).getDate()}</span>
                                      </div>
                                      <div>
                                          <p className="font-bold text-slate-900">{new Date(record.date).toLocaleDateString()}</p>
                                          <p className="text-xs text-slate-500">{new Date(record.date).toLocaleDateString('en-US', {weekday: 'long'})}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <p className="font-semibold text-slate-800">{record.subjectName || 'General Session'}</p>
                                  <p className="text-xs text-slate-500">Lecture Hall A</p>
                              </td>
                              <td className="px-6 py-4 text-slate-600 text-xs">
                                  <div className="flex items-center gap-1.5 bg-slate-100 w-fit px-2 py-1 rounded">
                                      <Clock className="w-3 h-3"/> 09:00 AM - 10:30 AM
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <Badge variant={record.status === 'PRESENT' ? 'success' : record.status === 'LATE' ? 'warning' : 'error'} className="px-3 py-1">
                                      {record.status}
                                  </Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  {record.status === 'ABSENT' ? (
                                      <span className="text-xs text-red-500 font-medium flex items-center justify-end gap-1"><AlertTriangle className="w-3 h-3"/> Unexcused</span>
                                  ) : (
                                      <span className="text-xs text-slate-400">-</span>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {filteredHistory.length === 0 && (
                          <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                  No records found for the selected filter.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => {}}>Load More Records</Button>
          </div>
       </Card>

       <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} title="Scan Class QR Code">
         <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-64 h-64 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800 shadow-2xl">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               <ScanLine className="w-full h-full text-green-400 absolute animate-pulse opacity-60 p-12" />
               <p className="text-white z-10 font-mono text-xs bg-black/50 px-2 py-1 rounded">Scanning Camera...</p>
            </div>
            <p className="text-sm text-slate-500 text-center max-w-xs">Align the QR code within the frame to mark your attendance automatically.</p>
            <Button onClick={() => { setIsScannerOpen(false); alert("Attendance Marked Successfully!"); }} className="w-full">Simulate Success</Button>
         </div>
      </Modal>
    </div>
  );
};

export default StudentAttendance;
