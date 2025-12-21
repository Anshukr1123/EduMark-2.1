
import React from 'react';
import { User } from '../../../types';
import { Badge } from '../../../components/UIComponents';
import { User as UserIcon, Calendar, Folder, Hash, MapPin, Award, BookOpen, ShieldCheck, Star } from 'lucide-react';

interface Props { user: User; }

const StudentHeader: React.FC<Props> = ({ user }) => (
  <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
    {/* Decorative BG */}
    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/40 rounded-bl-[160px] opacity-60 pointer-events-none transition-all duration-700 group-hover:bg-indigo-100/50 group-hover:scale-110"></div>
    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-40"></div>
    
    <div className="relative shrink-0">
        <div className="h-40 w-40 rounded-[48px] p-2 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-2xl shadow-indigo-100 transition-all duration-500 group-hover:rotate-2 group-hover:scale-105">
            <img src={user.avatar || "https://picsum.photos/200"} alt="Profile" className="h-full w-full rounded-[40px] object-cover border-4 border-white shadow-inner" />
        </div>
        <div className="absolute -bottom-3 -right-3 bg-indigo-600 h-12 w-12 rounded-[20px] border-4 border-white shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
        </div>
    </div>

    <div className="flex-1 text-center md:text-left space-y-4">
        <div className="space-y-1">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{user.name}</h2>
                <div className="flex gap-2">
                    <Badge variant="success" className="font-black uppercase tracking-[0.2em] text-[9px] px-4 py-1.5 shadow-md border-none bg-green-500 text-white shadow-green-200">VERIFIED</Badge>
                    <Badge variant="neutral" className="font-black uppercase tracking-[0.2em] text-[9px] px-4 py-1.5 shadow-md border-none bg-indigo-600 text-white shadow-indigo-200">PREMIUM</Badge>
                </div>
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Dean's Honor List • Semester V
            </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-y-4 gap-x-10 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2.5 transition-colors hover:text-indigo-600 cursor-default group/item">
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover/item:bg-indigo-50 transition-colors">
                    <Hash className="w-3.5 h-3.5 text-indigo-500"/>
                </div>
                <span>UID: {user.id.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2.5 transition-colors hover:text-indigo-600 cursor-default group/item">
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover/item:bg-indigo-50 transition-colors">
                    <Folder className="w-3.5 h-3.5 text-indigo-500"/>
                </div>
                <span>B.TECH CSE (HONS)</span>
            </div>
            <div className="flex items-center gap-2.5 transition-colors hover:text-indigo-600 cursor-default group/item">
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover/item:bg-indigo-50 transition-colors">
                    <Award className="w-3.5 h-3.5 text-indigo-500"/>
                </div>
                <span>CLASS OF 2025</span>
            </div>
        </div>
        
        {/* Core Metrics Summary */}
        <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
            <div className="flex flex-col group/metric cursor-default">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Current CGPA</span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900 leading-tight group-hover/metric:text-indigo-600 transition-colors">8.85</span>
                    <span className="text-xs font-bold text-slate-300">/ 10.0</span>
                </div>
            </div>
            <div className="w-px h-10 bg-slate-100 hidden sm:block"></div>
            <div className="flex flex-col group/metric cursor-default">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Rank in Dept</span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900 leading-tight group-hover/metric:text-indigo-600 transition-colors">#12</span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">OUT OF 140</span>
                </div>
            </div>
            <div className="w-px h-10 bg-slate-100 hidden sm:block"></div>
            <div className="flex flex-col group/metric cursor-default">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Assigned Mentor</span>
                <span className="text-sm font-black text-slate-700 leading-tight mt-1.5 border-b-2 border-indigo-100 group-hover/metric:border-indigo-500 transition-all cursor-pointer">Prof. Robert Smith</span>
            </div>
        </div>
    </div>

    <div className="shrink-0 flex md:flex-col gap-4">
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[32px] border border-slate-100 min-w-[140px] transition-all group-hover:bg-white group-hover:shadow-2xl group-hover:border-indigo-100">
             <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] mb-2">Phase</p>
             <p className="text-6xl font-black text-indigo-600 tabular-nums tracking-tighter">05</p>
             <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                 <BookOpen className="w-3 h-3"/> Active
             </div>
        </div>
    </div>
  </div>
);

export default StudentHeader;
