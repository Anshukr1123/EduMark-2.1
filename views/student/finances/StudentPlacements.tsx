
import React from 'react';
import { PlacementJob } from '../../../types';
import { Card, Button, Badge } from '../../../components/UIComponents';
import { Search, Briefcase, MapPin } from 'lucide-react';

interface Props { jobs: PlacementJob[]; }

const StudentPlacements: React.FC<Props> = ({ jobs }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-indigo-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Career Launchpad</h2>
          <p className="text-indigo-100 mb-6">Explore internships and full-time opportunities.</p>
          <div className="max-w-md mx-auto relative"><Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><input type="text" placeholder="Search by role or company..." className="w-full py-3 pl-10 pr-4 rounded-full text-slate-900 focus:outline-none" /></div>
       </div>
       <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
             <h3 className="font-bold text-lg text-slate-900">Open Opportunities</h3>
             {jobs.map(job => (
                <Card key={job.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                   <div className="mb-4 sm:mb-0"><h4 className="font-bold text-lg text-slate-900">{job.role}</h4><div className="flex items-center gap-2 text-sm text-slate-600 mt-1"><Briefcase className="w-4 h-4" /> {job.company}<span className="text-slate-300">|</span><MapPin className="w-4 h-4" /> {job.location}</div><div className="mt-2 flex gap-2"><Badge variant="neutral">{job.salary}</Badge><span className="text-xs text-slate-400 flex items-center">Apply by: {job.deadline}</span></div></div>
                   <Button disabled={job.status === 'CLOSED'}>{job.status === 'CLOSED' ? 'Closed' : 'Apply Now'}</Button>
                </Card>
             ))}
          </div>
          <div className="space-y-6">
             <Card title="My Profile Stats">
                <div className="space-y-4"><div className="flex justify-between text-sm"><span>Profile Strength</span><span className="font-bold text-green-600">85%</span></div><div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[85%]"></div></div><Button variant="outline" className="w-full">Update Resume</Button></div>
             </Card>
             <Card title="My Applications">
                <div className="space-y-3"><div className="flex justify-between items-center text-sm border-b pb-2"><span>Amazon SDE-1</span><Badge variant="warning">Interview</Badge></div><div className="flex justify-between items-center text-sm"><span>Google Intern</span><Badge variant="success">Applied</Badge></div></div>
             </Card>
          </div>
       </div>
    </div>
);
export default StudentPlacements;
