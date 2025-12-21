import React from 'react';
import { MOCK_COLLEGE_INFO } from '../../constants';
import { GraduationCap, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '../../components/UIComponents';

export const Footer: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 flex flex-col justify-center h-full">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="flex items-center gap-4 text-white">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-4xl font-black uppercase tracking-tighter">EduMark</span>
                </div>
                <p className="text-slate-400 text-xl leading-relaxed max-w-md font-medium">
                    The institutional engine for distributed academic brilliance and professional mastery.
                </p>
                <div className="flex gap-4">
                    {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                        <a key={i} href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-2xl group">
                            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                    ))}
                </div>
            </div>
            
            <div className="space-y-8">
                <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs">Navigation</h4>
                <ul className="space-y-4 text-sm font-bold">
                    <li><a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2 group">Admissions <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all"/></a></li>
                    <li><a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2 group">Faculty Node <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all"/></a></li>
                    <li><a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2 group">Exam Portal <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all"/></a></li>
                    <li><a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2 group">Research Hub <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all"/></a></li>
                </ul>
            </div>

            <div className="space-y-8">
                <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs">Connectivity</h4>
                <ul className="space-y-6 text-sm font-medium">
                    <li className="flex items-start gap-4 group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-600/20 transition-colors"><MapPin className="w-4 h-4 text-indigo-400" /></div>
                        <span className="text-slate-400 leading-relaxed text-xs uppercase font-bold tracking-wider">{MOCK_COLLEGE_INFO.address}</span>
                    </li>
                    <li className="flex items-center gap-4 group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-600/20 transition-colors"><Phone className="w-4 h-4 text-indigo-400" /></div>
                        <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">{MOCK_COLLEGE_INFO.contact}</span>
                    </li>
                    <li className="flex items-center gap-4 group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-600/20 transition-colors"><Mail className="w-4 h-4 text-indigo-400" /></div>
                        <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">{MOCK_COLLEGE_INFO.email}</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
            <p>© 2024 EduMark Institutional System Node v4.2.0. Secure Layer Active.</p>
            <div className="flex gap-10">
                <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">Service Terms</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">Neural Cookies</a>
            </div>
        </div>
    </div>
  );
};