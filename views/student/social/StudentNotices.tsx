
import React from 'react';
import { Notice } from '../../../types';
import { Card, Badge } from '../../../components/UIComponents';
import { Bell, ChevronRight } from 'lucide-react';

interface Props { notices: Notice[]; }

const StudentNotices: React.FC<Props> = ({ notices }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-900">Notice Board</h2>
        <div className="grid gap-4">
           {notices.map(notice => (
              <Card key={notice.id} className="border-l-4 border-l-indigo-500 hover:shadow-md transition-all">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-2"><Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-none">{notice.type}</Badge><span className="text-xs text-slate-400 font-medium">• {notice.date}</span></div>
                    <div className="bg-slate-100 p-2 rounded-full"><Bell className="w-4 h-4 text-slate-500"/></div>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">{notice.title}</h3>
                 <p className="text-slate-600 text-sm leading-relaxed">{notice.content}</p>
                 <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center"><span className="text-xs text-slate-500 font-bold uppercase tracking-wide">From: {notice.sender}</span><button className="text-indigo-600 text-xs font-bold hover:underline flex items-center">Read Full Notice <ChevronRight className="w-3 h-3 ml-1"/></button></div>
              </Card>
           ))}
        </div>
     </div>
);
export default StudentNotices;
