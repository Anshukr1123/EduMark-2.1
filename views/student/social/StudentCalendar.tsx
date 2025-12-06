
import React, { useState } from 'react';
import { CollegeEvent, AttendanceRecord } from '../../../types';
import { Card, Badge, Button } from '../../../components/UIComponents';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

interface Props { 
  events: CollegeEvent[]; 
  history: AttendanceRecord[]; 
  onRegister: (id: string) => void;
}

const StudentCalendar: React.FC<Props> = ({ events, history, onRegister }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateDetail, setSelectedDateDetail] = useState<Date | null>(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);

  const handleRegister = (id: string) => {
    if (window.confirm("Do you want to register for this event?")) {
        onRegister(id);
    }
  };

  return (
      <div className="space-y-6 animate-in fade-in duration-500">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Academic Schedule & Events</h2>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-200">
               <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
               <span className="font-bold text-slate-800 w-36 text-center">{monthNames[month]} {year}</span>
               <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronRight className="w-5 h-5"/></button>
            </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
               <div className="grid grid-cols-7 mb-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
               </div>
               <div className="grid grid-cols-7 gap-2">
                  {padding.map(i => <div key={`pad-${i}`} className="h-24 bg-slate-50/50 rounded-xl"></div>)}
                  {days.map(day => {
                     const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                     const dayEvents = events.filter(e => e.date === dateStr);
                     const attendance = history.find(h => h.date.split('T')[0] === dateStr);
                     const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                     const isSelected = selectedDateDetail?.toDateString() === new Date(year, month, day).toDateString();
                     return (
                        <div key={day} className={`h-24 border rounded-xl p-2 relative cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${isSelected ? 'ring-2 ring-indigo-500 border-transparent bg-indigo-50/50' : isToday ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100'}`} onClick={() => setSelectedDateDetail(new Date(year, month, day))}>
                           <span className={`text-sm font-bold ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</span>
                           <div className="flex flex-col gap-1 overflow-hidden">{attendance && (<div className={`h-1.5 w-full rounded-full ${attendance.status === 'PRESENT' ? 'bg-green-500' : 'bg-red-500'}`}></div>)}{dayEvents.length > 0 && (<div className="text-[10px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded truncate font-medium">{dayEvents.length} Event{dayEvents.length > 1 ? 's' : ''}</div>)}</div>
                        </div>
                     );
                  })}
               </div>
            </Card>
            <div className="space-y-6">
               <Card title={selectedDateDetail ? selectedDateDetail.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'}) : "Select a Date"} className="h-full border-l-4 border-l-indigo-500">
                  <div className="space-y-4 min-h-[200px]">
                     {selectedDateDetail ? (
                        <>
                           {events.filter(e => e.date === selectedDateDetail.toISOString().split('T')[0]).map(e => (
                              <div key={e.id} className="p-4 bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                 <div className="flex justify-between items-start mb-2">
                                    <Badge variant="neutral" className="bg-purple-100 text-purple-700 border-none">{e.category}</Badge>
                                    {e.registrationStatus === 'REGISTERED' && <Badge variant="success">Registered</Badge>}
                                 </div>
                                 <h4 className="font-bold text-slate-900 text-sm mb-1">{e.title}</h4>
                                 <p className="text-xs text-slate-500 line-clamp-2 mb-3">{e.description}</p>
                                 <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                                    <div className="flex items-center"><Clock className="w-3 h-3 mr-1 text-purple-500"/> {e.time}</div>
                                    <div className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-purple-500"/> {e.location}</div>
                                 </div>
                                 
                                 <Button 
                                    size="sm" 
                                    className={`w-full ${e.registrationStatus === 'REGISTERED' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600'}`}
                                    disabled={e.registrationStatus !== 'OPEN' && e.registrationStatus !== 'REGISTERED'}
                                    variant={e.registrationStatus === 'REGISTERED' ? 'primary' : 'primary'}
                                    onClick={() => e.registrationStatus === 'OPEN' ? handleRegister(e.id) : null}
                                 >
                                    {e.registrationStatus === 'REGISTERED' ? <><CheckCircle className="w-3 h-3 mr-2"/> Registered</> : e.registrationStatus === 'CLOSED' ? 'Closed' : 'Register Now'}
                                 </Button>
                              </div>
                           ))}
                           
                           {/* Attendance Summary for Date */}
                           {history.find(h => h.date.split('T')[0] === selectedDateDetail.toISOString().split('T')[0]) ? (
                              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                                  <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-bold text-slate-700">Attendance Log</p>
                                      <Badge variant={history.find(h => h.date.split('T')[0] === selectedDateDetail.toISOString().split('T')[0])?.status === 'PRESENT' ? 'success' : 'error'}>{history.find(h => h.date.split('T')[0] === selectedDateDetail.toISOString().split('T')[0])?.status}</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                      Subject: <span className="font-medium text-slate-900">{history.find(h => h.date.split('T')[0] === selectedDateDetail.toISOString().split('T')[0])?.subjectName || 'General'}</span>
                                  </p>
                              </div>
                           ) : ([1,2,3,4,5].includes(selectedDateDetail.getDay()) && !events.some(e => e.date === selectedDateDetail.toISOString().split('T')[0]) && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                                    <p className="text-sm text-slate-500 font-medium">Regular Class Schedule</p>
                                    <p className="text-xs text-slate-400 mt-1">No special events or logs.</p>
                                </div>
                           ))}
                           
                           {events.filter(e => e.date === selectedDateDetail.toISOString().split('T')[0]).length === 0 && !history.find(h => h.date.split('T')[0] === selectedDateDetail.toISOString().split('T')[0]) && ![1,2,3,4,5].includes(selectedDateDetail.getDay()) && (
                                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                    <CalendarIcon className="w-8 h-8 mb-2 opacity-50"/>
                                    <p className="text-sm">No events scheduled.</p>
                                </div>
                           )}
                        </>
                     ) : (<p className="text-sm text-slate-500">Select a date from the calendar to view agenda.</p>)}
                  </div>
               </Card>
            </div>
         </div>
      </div>
  );
};
export default StudentCalendar;
