
import React from 'react';
import { User } from '../../../types';
import { Badge } from '../../../components/UIComponents';
import { User as UserIcon, Calendar, Folder, Hash, MapPin, Award, BookOpen, ShieldCheck, Star } from 'lucide-react';

interface Props { user: User; }

const StudentHeader: React.FC<Props> = ({ user }) => (
  <div className="bg-white border-2 border-slate-100 rounded-[48px] p-10 shadow-xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
    {/* High-Fidelity Decorative Elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-bl-[200px] opacity-80 pointer-events-none transition-all duration-1000 group-hover:bg-indigo-100/70 group-hover:scale-105"></div>
    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100/40 rounded-full blur-[100px] opacity-60"></div>
    
    <div className="relative shrink-0">
        <div className="h-48 w-48 rounded-[56px] p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-2xl shadow-indigo-200 transition-all duration-700 group-hover:rotate-3 group-hover:scale-105">
            <img src={user.avatar || "https://picsum.photos/300"} alt="Profile" className="h-full w-full rounded-[48px] object-cover border-8 border-white shadow-inner" />
        </div>
        <div className="absolute -bottom-4 -right-4 bg-indigo-600 h-16 w-16 rounded-[24px] border-4 border-white shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-8 h-8 text-white" />
        </div>
    </div>

    <div className="flex-1 text-center md:text-left space-y-6">
        <div className="space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none drop-shadow-sm">{user.name}</h2>
                <div className="flex gap-3">
                    <Badge variant="success" className="font-black uppercase tracking-[0.25em] text-[10px] px-6 py-2 shadow-lg border-none bg-emerald-500 text-white shadow-emerald-200">VERIFIED</Badge>
                    <Badge variant="neutral" className="font-black uppercase tracking-[0.25em] text-[10px] px-6 py-2 shadow-lg border-none bg-indigo-600 text-white shadow-indigo-200">HONS</Badge>
                </div>
            </div>
            <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-3 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Dean's Honor Roll • Academic Cycle 2024
            </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-y-6 gap-x-12 text-xs text-slate-400 font-black uppercase tracking-[0.3em]">
            <div className="flex items-center gap-3.5 transition-colors hover:text-indigo-600 cursor-default group/item">
                <div className="p-2 rounded-xl bg-slate-100 group-hover/item:bg-indigo-50 transition-colors shadow-inner">
                    <Hash className="w-4 h-4 text-indigo-500"/>
                </div>
                <span>UID: {user.id.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-3.5 transition-colors hover:text-indigo-600 cursor-default group/item">
                <div className="p-2 rounded-xl bg-slate-100 group-hover/item:bg-indigo-50 transition-colors shadow-inner">
                    <Folder className="w-4 h-4 text-indigo-500"/>
                </div>
                <span>B.TECH CSE (HONS)</span>
            </div>
            <div className="flex items-center gap-3.5 transition-colors hover:text-indigo-600 cursor-default group/item">
                <div className="p-2 rounded-xl bg-slate-100 group-hover/item:bg-indigo-50 transition-colors shadow-inner">
                    <Award className="w-4 h-4 text-indigo-500"/>
                </div>
                <span>CLASS OF 2025</span>
            </div>
        </div>
        
        {/* Massive Bold Metrics */}
        <div className="flex flex-wrap justify-center md:justify-start gap-12 pt-6">
            <div className="flex flex-col group/metric cursor-default">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mb-2">Current CGPA</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 leading-none group-hover/metric:text-indigo-600 transition-colors tracking-tighter">8.85</span>
                    <span className="text-sm font-black text-slate-300">/ 10.0</span>
                </div>
            </div>
            <div className="w-px h-14 bg-slate-100 hidden sm:block"></div>
            <div className="flex flex-col group/metric cursor-default">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mb-2">Institutional Rank</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 leading-none group-hover/metric:text-indigo-600 transition-colors tracking-tighter">#12</span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TOP 5%</span>
                </div>
            </div>
            <div className="w-px h-14 bg-slate-100 hidden sm:block"></div>
            <div className="flex flex-col group/metric cursor-default">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mb-2">Assigned Mentor</span>
                <span className="text-lg font-black text-slate-800 leading-none mt-2 border-b-4 border-indigo-100 group-hover/metric:border-indigo-600 transition-all cursor-pointer">Prof. Robert Smith</span>
            </div>
        </div>
    </div>

    <div className="shrink-0 flex md:flex-col gap-6">
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-[40px] border-4 border-slate-800 min-w-[180px] transition-all group-hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)]">
             <p className="text-[11px] text-indigo-400 uppercase font-black tracking-[0.4em] mb-3">Academic Phase</p>
             <p className="text-8xl font-black text-white tabular-nums tracking-tighter leading-none">05</p>
             <div className="mt-5 flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> Active
             </div>
        </div>
    </div>
  </div>
);

export default StudentHeader;
