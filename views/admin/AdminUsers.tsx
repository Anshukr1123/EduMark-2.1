
import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_SERVICE_REQUESTS } from '../../constants';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Plus, Trash2, Search, UserX, Filter, ChevronRight, Mail, Hash } from 'lucide-react';

interface Props { 
  activeTab: string; 
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

const AdminUsers: React.FC<Props> = ({ activeTab, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (activeTab === 'users') return (
    <div className="space-y-4 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">User Directory</h2>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Manage Institutional Access Control</p>
           </div>
           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-80 group">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                   <input 
                       type="text" 
                       placeholder="Search name or email..." 
                       className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                   />
               </div>
               <Button onClick={() => onShowToast && onShowToast("Registry Tool", "External user ingestion is coming soon.", "info")} className="h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0">
                   <Plus className="w-3.5 h-3.5 mr-1.5"/> Provision User
               </Button>
           </div>
       </div>

       <Card className="rounded-[24px] overflow-hidden border-slate-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-[0.2em] font-black border-b border-slate-100">
                    <tr>
                        <th className="p-4">Identity / Name</th>
                        <th className="p-4">Authorization</th>
                        <th className="p-4">Communication Node</th>
                        <th className="p-4">Institutional UID</th>
                        <th className="p-4 text-right">Terminals</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                    {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={u.avatar} className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all" alt=""/>
                                    <span className="text-slate-900 font-black uppercase tracking-tight">{u.name}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <Badge className={`font-black border-none text-[8px] uppercase ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : u.role === 'TEACHER' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {u.role}
                                </Badge>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Mail className="w-3 h-3"/> {u.email}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                                    <Hash className="w-3 h-3"/> {u.id.toUpperCase()}
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-3.5 h-3.5"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                        <UserX className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">No entities found</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Refine your search parameters</p>
                    <Button variant="outline" className="mt-6 h-8 text-[9px] font-black uppercase tracking-widest border-slate-100" onClick={() => setSearchQuery('')}>Clear Registry Filter</Button>
                </div>
            )}
          </div>
       </Card>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
       <div>
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Administrative Approvals</h2>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pending Institutional Service Requests</p>
       </div>
       <div className="grid gap-3">
           {MOCK_SERVICE_REQUESTS.map(r => (
               <Card key={r.id} className="flex justify-between items-center p-4 border-slate-100 hover:border-indigo-200 transition-all group">
                   <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                           <Filter className="w-5 h-5"/>
                       </div>
                       <div>
                           <div className="flex items-center gap-2">
                               <span className="font-black text-slate-900 uppercase tracking-tight">{r.type}</span>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{r.date}</span>
                           </div>
                           <p className="text-[11px] text-slate-500 font-medium mt-0.5">{r.details}</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-3">
                       <Badge className="font-black border-none text-[8px] uppercase bg-amber-50 text-amber-700">{r.status}</Badge>
                       <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><ChevronRight className="w-5 h-5"/></button>
                   </div>
               </Card>
           ))}
       </div>
    </div>
  );
};
export default AdminUsers;
