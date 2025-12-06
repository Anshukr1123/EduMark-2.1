
import React from 'react';
import { MOCK_USERS, MOCK_SERVICE_REQUESTS } from '../../constants';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Plus, Trash2 } from 'lucide-react';

interface Props { activeTab: string; }
const AdminUsers: React.FC<Props> = ({ activeTab }) => {
  if (activeTab === 'users') return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between"><h2 className="text-2xl font-bold">User Management</h2><Button><Plus className="w-4 h-4 mr-2"/> Add User</Button></div>
       <Card><table className="w-full text-left"><thead className="bg-slate-50"><tr><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Email</th></tr></thead><tbody>{MOCK_USERS.map(u => <tr key={u.id}><td className="p-3">{u.name}</td><td className="p-3"><Badge>{u.role}</Badge></td><td className="p-3">{u.email}</td></tr>)}</tbody></table></Card>
    </div>
  );
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <h2 className="text-2xl font-bold">Pending Approvals</h2>
       <div className="space-y-4">{MOCK_SERVICE_REQUESTS.map(r => <Card key={r.id} className="flex justify-between"><div><span className="font-bold">{r.type}</span><p>{r.details}</p></div><Badge>{r.status}</Badge></Card>)}</div>
    </div>
  );
};
export default AdminUsers;
