
import React, { useState } from 'react';
import { User, Notice } from '../../types';
import { MOCK_NOTICES, MOCK_USERS } from '../../constants';
import { Card, Button, Modal } from '../../components/UIComponents';
import { Megaphone, Download, Save, User as UserIcon, Plus } from 'lucide-react';

// Added missing onShowToast to Props interface
interface Props { 
  user: User; 
  activeTab: string; 
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// Added onShowToast to component parameters
const TeacherCommunication: React.FC<Props> = ({ user, activeTab, onShowToast }) => {
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  const handlePostNotice = () => {
    setNotices([{ id: Math.random().toString(), title: newNotice.title, content: newNotice.content, date: new Date().toISOString().split('T')[0], type: 'ACADEMIC', sender: user.name }, ...notices]);
    setIsNoticeModalOpen(false);
    if (onShowToast) onShowToast("Announcement Posted", "Notice has been published to all students.", "success");
  };

  if (activeTab === 'profile') return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
       <Card className="max-w-2xl"><div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center"><UserIcon className="w-10 h-10 text-slate-400"/></div><div><h3 className="text-xl font-bold">{user.name}</h3><p className="text-slate-500">Faculty ID: {user.id.toUpperCase()}</p></div></div><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500">EMAIL</label><input value={user.email} disabled className="w-full border p-2 rounded bg-slate-50 mt-1"/></div><div><label className="text-xs font-bold text-slate-500">PHONE</label><input defaultValue="+1 (555) 123-4567" className="w-full border p-2 rounded mt-1"/></div></div><Button onClick={() => onShowToast && onShowToast("Profile Updated", "Your changes have been saved.", "success")}><Save className="w-4 h-4 mr-2"/> Save Changes</Button></div></Card>
    </div>
  );
  
  if (activeTab === 'students') return (
     <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-900">Students</h2><Button variant="outline" onClick={() => alert('Exporting CSV...')}><Download className="w-4 h-4 mr-2"/> Export</Button></div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left"><thead className="bg-slate-50"><tr><th className="p-4">Name</th><th className="p-4">ID</th><th className="p-4">Email</th><th className="p-4">Department</th></tr></thead><tbody className="divide-y">{MOCK_USERS.filter(u => u.role === 'STUDENT').map(s => <tr key={s.id}><td className="p-4 font-medium">{s.name}</td><td className="p-4">{s.id.toUpperCase()}</td><td className="p-4">{s.email}</td><td className="p-4">{s.departmentId || 'CS'}</td></tr>)}</tbody></table>
          </div>
        </Card>
     </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-900">Announcements</h2><Button onClick={() => setIsNoticeModalOpen(true)}><Plus className="w-4 h-4 mr-2"/> Post Notice</Button></div>
       <div className="space-y-4">{notices.map(n => <Card key={n.id} className="border-l-4 border-l-indigo-500"><div className="flex justify-between"><h3 className="font-bold text-lg">{n.title}</h3><span className="text-xs text-slate-500">{n.date}</span></div><p className="text-sm text-slate-600 mt-2">{n.content}</p><div className="mt-3 text-xs font-semibold text-slate-400">By: {n.sender}</div></Card>)}</div>
       
       <Modal isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)} title="Post Announcement">
         <div className="space-y-4">
           <input placeholder="Title" className="w-full border p-2 rounded" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
           <textarea placeholder="Content" rows={4} className="w-full border p-2 rounded" value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} />
           <Button className="w-full" onClick={handlePostNotice}>Post</Button>
         </div>
       </Modal>
    </div>
  );
};
export default TeacherCommunication;
