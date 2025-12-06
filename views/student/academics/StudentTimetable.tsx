
import React, { useState } from 'react';
import { User } from '../../../types';
import { MOCK_TIMETABLE } from '../../../constants';
import { Card, Button, Badge } from '../../../components/UIComponents';
import { Download, Clock, MapPin, User as UserIcon, Printer, Calendar } from 'lucide-react';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

interface Props { user: User; }

const StudentTimetable: React.FC<Props> = ({ user }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadTimetable = () => {
    setIsDownloading(true);
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${user.name} - Weekly Timetable`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Department: Computer Science | Semester: 5`, 14, 28);

    const sortedTimetable = [...MOCK_TIMETABLE].sort((a, b) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      return days.indexOf(a.day) - days.indexOf(b.day) || a.startTime.localeCompare(b.startTime);
    });

    const tableData = sortedTimetable.map(row => [
      row.day, row.startTime + ' - ' + row.endTime, row.subject, row.room, row.teacher
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Day', 'Time', 'Subject', 'Room', 'Faculty']],
      body: tableData,
    });

    doc.save('My_Timetable.pdf');
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
      <div className="space-y-6 animate-in fade-in duration-500">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Weekly Schedule</h2>
                <p className="text-sm text-slate-500">Fall Semester 2024 • Computer Science • Section A</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2"/> Print</Button>
               <Button onClick={handleDownloadTimetable} isLoading={isDownloading}><Download className="w-4 h-4 mr-2"/> Download PDF</Button>
            </div>
         </div>

         {/* Grid View for Desktop */}
         <div className="hidden lg:grid grid-cols-5 gap-4">
             {days.map(day => (
                 <div key={day} className="space-y-3">
                     <div className="text-center font-bold text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-sm uppercase text-sm tracking-wider">
                         {day}
                     </div>
                     <div className="space-y-3">
                         {MOCK_TIMETABLE.filter(t => t.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                             <div key={slot.id} className="bg-white p-3 rounded-xl border-l-4 border-l-indigo-500 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                 <div className="flex items-center text-xs font-bold text-indigo-600 mb-1">
                                     <Clock className="w-3 h-3 mr-1"/> {slot.startTime} - {slot.endTime}
                                 </div>
                                 <h4 className="font-bold text-slate-900 text-sm">{slot.subject}</h4>
                                 <div className="mt-2 text-xs text-slate-500 space-y-1">
                                     <div className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {slot.room}</div>
                                     <div className="flex items-center"><UserIcon className="w-3 h-3 mr-1"/> {slot.teacher}</div>
                                 </div>
                             </div>
                         ))}
                         {MOCK_TIMETABLE.filter(t => t.day === day).length === 0 && (
                             <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                                 No Classes
                             </div>
                         )}
                     </div>
                 </div>
             ))}
         </div>

         {/* List View for Mobile */}
         <div className="lg:hidden space-y-6">
             {days.map(day => {
                 const daySlots = MOCK_TIMETABLE.filter(t => t.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
                 if (daySlots.length === 0) return null;
                 return (
                     <Card key={day} title={day} className="border-t-4 border-t-indigo-500">
                         <div className="space-y-4">
                             {daySlots.map(slot => (
                                 <div key={slot.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                     <div className="w-24 flex-shrink-0 text-center bg-slate-50 rounded-lg p-2 flex flex-col justify-center">
                                         <span className="text-xs font-bold text-slate-500">{slot.startTime}</span>
                                         <span className="text-[10px] text-slate-400">to</span>
                                         <span className="text-xs font-bold text-slate-500">{slot.endTime}</span>
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-slate-900">{slot.subject}</h4>
                                         <p className="text-sm text-slate-600">{slot.teacher}</p>
                                         <Badge variant="neutral" className="mt-1">{slot.room}</Badge>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </Card>
                 )
             })}
         </div>
      </div>
  );
};

export default StudentTimetable;
