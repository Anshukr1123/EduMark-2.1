
import React from 'react';
import { User } from '../../../types';
import { Badge } from '../../../components/UIComponents';
import { User as UserIcon, Calendar, Folder, Hash } from 'lucide-react';

interface Props { user: User; }

const StudentHeader: React.FC<Props> = ({ user }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 pointer-events-none"></div>
    <div className="relative">
        <div className="h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-600">
            <img src={user.avatar || "https://picsum.photos/200"} alt="Profile" className="h-full w-full rounded-full object-cover border-4 border-white" />
        </div>
        <div className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full border-4 border-white"></div>
    </div>
    <div className="flex-1 text-center md:text-left space-y-1">
        <div className="flex flex-col md:flex-row items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <Badge variant="success">Active Student</Badge>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 mt-2">
            <div className="flex items-center"><UserIcon className="w-4 h-4 mr-1.5 text-indigo-500"/> ID: {user.id.toUpperCase()}</div>
            <div className="flex items-center"><Hash className="w-4 h-4 mr-1.5 text-indigo-500"/> Batch: 2021-25</div>
            <div className="flex items-center"><Folder className="w-4 h-4 mr-1.5 text-indigo-500"/> B.Tech CSE</div>
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-indigo-500"/> Year: 2023-24</div>
        </div>
    </div>
    <div className="hidden lg:block text-right">
         <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Current Semester</p>
         <p className="text-3xl font-black text-indigo-600">V</p>
    </div>
  </div>
);

export default StudentHeader;
