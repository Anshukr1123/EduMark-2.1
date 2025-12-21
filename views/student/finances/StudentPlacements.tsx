
import React from 'react';
import { PlacementJob } from '../../../types';
import { Card, Button, Badge } from '../../../components/UIComponents';
import { Search, Briefcase, MapPin, Building2, TrendingUp, DollarSign, Users, Sparkles, Star } from 'lucide-react';

interface Props { jobs: PlacementJob[]; }

const StudentPlacements: React.FC<Props> = ({ jobs }) => {
    const recruiters = ["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Adobe", "Meta", "Netflix"];

    return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white relative overflow-hidden shadow-xl animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Career Launchpad</h2>
            <p className="text-indigo-100 mb-6 font-medium">Explore premium internships and full-time engineering roles.</p>
            <div className="max-w-xl mx-auto relative group">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input type="text" placeholder="Search by role, company, or tech stack..." className="w-full py-3.5 pl-12 pr-4 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-2xl" />
            </div>
          </div>
       </div>

       {/* Detailed Recruitment Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-500 delay-100 fill-mode-backwards">
            <Card className="bg-white p-4 flex flex-col items-center text-center">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg mb-2"><TrendingUp className="w-5 h-5"/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Package</p>
                <p className="text-xl font-black text-slate-900">₹12.5 LPA</p>
            </Card>
            <Card className="bg-white p-4 flex flex-col items-center text-center">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mb-2"><Users className="w-5 h-5"/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Placed Ratio</p>
                <p className="text-xl font-black text-slate-900">94.2%</p>
            </Card>
            <Card className="bg-white p-4 flex flex-col items-center text-center">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mb-2"><DollarSign className="w-5 h-5"/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highest CTC</p>
                <p className="text-xl font-black text-slate-900">₹45.0 LPA</p>
            </Card>
            <Card className="bg-white p-4 flex flex-col items-center text-center">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg mb-2"><Sparkles className="w-5 h-5"/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Companies</p>
                <p className="text-xl font-black text-slate-900">120+</p>
            </Card>
       </div>

       <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 animate-in slide-in-from-top-4 duration-500 delay-150 fill-mode-backwards">
             <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center">
                    <span className="w-6 h-1 bg-indigo-600 rounded-full mr-3"></span>
                    Live Opportunities
                </h3>
                <Badge variant="neutral" className="bg-slate-100 text-slate-600 border-none font-black text-[9px] uppercase">{jobs.length} Active</Badge>
             </div>
             {jobs.map(job => (
                <Card key={job.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 group hover:border-indigo-300 transition-all border-slate-200">
                   <div className="mb-4 sm:mb-0">
                       <h4 className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{job.role}</h4>
                       <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                           <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded text-slate-700"><Building2 className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> {job.company}</span>
                           <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.location}</span>
                       </div>
                       <div className="mt-3 flex flex-wrap gap-2">
                           <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3">{job.salary}</Badge>
                           <span className="text-[10px] text-slate-400 flex items-center font-bold uppercase tracking-tighter">Deadline: {job.deadline}</span>
                       </div>
                   </div>
                   <Button disabled={job.status === 'CLOSED'} className="w-full sm:w-auto shadow-lg shadow-indigo-100 h-10 px-8 font-black uppercase tracking-widest text-xs">
                       {job.status === 'CLOSED' ? 'Closed' : 'Quick Apply'}
                   </Button>
                </Card>
             ))}
          </div>

          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 delay-200 fill-mode-backwards">
             <Card title="Top Recruiting Partners">
                <div className="grid grid-cols-2 gap-3 mt-2">
                    {recruiters.map(r => (
                        <div key={r} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default group">
                            <span className="text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-colors">{r}</span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline text-center">View 2024 Placement Report</button>
             </Card>

             <Card title="Candidate Readiness" className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-white/5"><Star className="w-24 h-24 rotate-12" /></div>
                <div className="relative z-10 space-y-4">
                    <div className="flex justify-between text-xs font-black text-indigo-300 uppercase tracking-widest">
                        <span>Profile Strength</span>
                        <span>85%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full w-[85%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Complete your technical portfolio and projects to reach 95% and unlock premium roles.</p>
                    <Button variant="outline" className="w-full h-9 text-[10px] font-black uppercase tracking-widest border-white/20 text-white hover:bg-white/10">Improve Profile</Button>
                </div>
             </Card>
          </div>
       </div>
    </div>
);};
export default StudentPlacements;
