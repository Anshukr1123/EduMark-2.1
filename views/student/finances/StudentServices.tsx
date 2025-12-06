
import React, { useState } from 'react';
import { ServiceRequest } from '../../../types';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { Home, Bus, GraduationCap } from 'lucide-react';

interface Props { serviceRequests: ServiceRequest[]; }

const StudentServices: React.FC<Props> = ({ serviceRequests }) => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState<'HOSTEL' | 'TRANSPORT' | 'SCHOLARSHIP'>('HOSTEL');
  const [localRequests, setLocalRequests] = useState<ServiceRequest[]>(serviceRequests);

  const handleServiceRequest = () => {
      setLocalRequests([{ id: Math.random().toString(), type: serviceType, status: 'PENDING', date: new Date().toISOString().split('T')[0], details: 'Application submitted via portal' }, ...localRequests]);
      setIsServiceModalOpen(false);
      alert("Application Submitted Successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => { setServiceType('HOSTEL'); setIsServiceModalOpen(true); }}><div className="text-center p-4"><div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><Home className="w-6 h-6"/></div><h3 className="font-bold text-slate-900">Hostel</h3><p className="text-xs text-slate-500 mt-2">Room allocation</p></div></Card>
          <Card className="hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => { setServiceType('TRANSPORT'); setIsServiceModalOpen(true); }}><div className="text-center p-4"><div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Bus className="w-6 h-6"/></div><h3 className="font-bold text-slate-900">Transport</h3><p className="text-xs text-slate-500 mt-2">Bus pass & routes</p></div></Card>
          <Card className="hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => { setServiceType('SCHOLARSHIP'); setIsServiceModalOpen(true); }}><div className="text-center p-4"><div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"><GraduationCap className="w-6 h-6"/></div><h3 className="font-bold text-slate-900">Scholarships</h3><p className="text-xs text-slate-500 mt-2">Financial Aid</p></div></Card>
       </div>
       <Card title="My Request History">
          <div className="space-y-4 mt-2">
             {localRequests.map(req => (<div key={req.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"><div><p className="font-medium text-slate-900">{req.type} Application</p><p className="text-xs text-slate-500">{req.date} • {req.details}</p></div><Badge variant={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'error' : 'warning'}>{req.status}</Badge></div>))}
             {localRequests.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No active requests.</p>}
          </div>
       </Card>
       <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} title={`Apply for ${serviceType.toLowerCase()}`}>
          <div className="space-y-4"><div className="bg-slate-50 p-4 rounded-lg"><p className="text-sm text-slate-600">You are submitting a request for <strong>{serviceType}</strong> services. Please provide relevant details.</p></div><textarea placeholder="Enter details..." rows={4} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea><div className="pt-2"><Button className="w-full" onClick={handleServiceRequest}>Submit Application</Button></div></div>
       </Modal>
    </div>
  );
};
export default StudentServices;
