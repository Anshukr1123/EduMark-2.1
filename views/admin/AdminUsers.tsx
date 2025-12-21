import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_SERVICE_REQUESTS } from '../../constants';
import { User } from '../../types';
import { Card, Button, Badge, Modal } from '../../components/UIComponents';
import { 
  Plus, Trash2, Search, UserX, Filter, ChevronRight, Mail, Hash, 
  History, Clock, ShieldCheck, Terminal, Smartphone, Globe, Cpu, AlertCircle, X
} from 'lucide-react';

interface Props { 
  activeTab: string; 
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

const AdminUsers: React.FC<Props> = ({ activeTab, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const mockActivityLogs = [
      { id: 'ev-1', action: 'Auth: Login Success', timestamp: '2024-10-27 09:12:45', source: 'Web Terminal', ip: '172.16.0.42', status: 'SUCCESS' },
      { id: 'ev-2', action: 'Artifact: Assignment Dispatch', timestamp: '2024-10-27 10:30:12', source: 'Mobile API', ip: '10.0.8.21', status: 'SUCCESS' },
      { id: 'ev-3', action: 'Identity: Profile Mutation', timestamp: '2024-10-26 14:22:05', source: 'Web Terminal', ip: '172.16.0.42', status: 'WARNING' },
      { id: 'ev-4', action: 'Secure: 2FA Synchronization', timestamp: '2024-10-26 08:00:00', source: 'System Auto', ip: 'Localhost', status: 'SUCCESS' },
      { id: 'ev-5', action: 'Auth: Logout Terminal', timestamp: '2024-10-25 18:45:30', source: 'Web Terminal', ip: '172.16.0.42', status: 'SUCCESS' },
  ];

  const handleViewLogs = (user: User) => {
    setSelectedUser(user);
    setIsLogModalOpen(true);
  };

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
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleViewLogs(u)}
                                        className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="View Activity Logs"
                                    >
                                        <History className="w-4 h-4"/>
                                    </button>
                                    <button className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 className="w-3.5 h-3.5"/>
                                    </button>
                                </div>
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

       {/* Activity Log Modal */}
       <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Neural Activity Audit">
           {selectedUser && (
               <div className="space-y-6">
                   <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                       <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl relative z-10">
                           <img src={selectedUser.avatar} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="relative z-10">
                           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Audit Subject</p>
                           <h4 className="text-xl font-black uppercase tracking-tighter leading-none">{selectedUser.name}</h4>
                           <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-2">
                               <ShieldCheck className="w-3 h-3" /> UID: {selectedUser.id.toUpperCase()}
                           </p>
                       </div>
                   </div>

                   <div className="space-y-4">
                       <div className="flex items-center justify-between px-2">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Sequential Event Stack
                            </h5>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest">REAL-TIME SYNC</Badge>
                       </div>

                       <div className="bg-slate-50 border border-slate-100 rounded-[32px] overflow-hidden">
                           <div className="max-h-[350px] overflow-y-auto no-scrollbar divide-y divide-slate-200/50">
                               {mockActivityLogs.map((log) => (
                                   <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-white transition-colors group">
                                       <div className={`p-2 rounded-xl mt-1 ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                           <Cpu className="w-4 h-4" />
                                       </div>
                                       <div className="flex-1 min-w-0">
                                           <div className="flex justify-between items-start mb-1">
                                               <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{log.action}</p>
                                               <span className="text-[9px] font-black text-slate-400 whitespace-nowrap">{log.timestamp.split(' ')[1]}</span>
                                           </div>
                                           <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                               <span className="flex items-center gap-1"><Smartphone className="w-2.5 h-2.5" /> {log.source}</span>
                                               <span className="text-slate-200">|</span>
                                               <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> {log.ip}</span>
                                           </div>
                                       </div>
                                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                           <AlertCircle className="w-4 h-4 text-slate-300" />
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>

                   <div className="pt-2 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                       <p>Secure Hash: SHA-256 Verified</p>
                       <button onClick={() => setIsLogModalOpen(false)} className="text-indigo-600 hover:underline">Download Audit Report</button>
                   </div>

                   <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-slate-900 hover:bg-slate-800" onClick={() => setIsLogModalOpen(false)}>
                       Close Audit Interface
                   </Button>
               </div>
           )}
       </Modal>
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