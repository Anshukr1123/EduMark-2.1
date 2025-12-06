
import React, { useState } from 'react';
import { SupportTicket } from '../../../types';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { Plus, HelpCircle, ChevronRight } from 'lucide-react';

interface Props { tickets: SupportTicket[]; }

const StudentSupport: React.FC<Props> = ({ tickets }) => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [localTickets, setLocalTickets] = useState<SupportTicket[]>(tickets);

  return (
     <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-slate-900">Helpdesk & Support</h2><p className="text-sm text-slate-500">Raise tickets for technical, academic, or facility issues.</p></div><Button onClick={() => setIsTicketModalOpen(true)} className="shadow-lg shadow-indigo-100"><Plus className="w-4 h-4 mr-2"/> New Ticket</Button></div>
        <div className="grid gap-6 md:grid-cols-2">
           <Card title="My Tickets">
              <div className="space-y-4 mt-2">
                 {localTickets.map(ticket => (
                    <div key={ticket.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                       <div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-slate-900">{ticket.subject}</span><Badge variant={ticket.status === 'RESOLVED' ? 'success' : ticket.status === 'OPEN' ? 'error' : 'warning'}>{ticket.status}</Badge></div><p className="text-xs text-slate-500 font-medium">Category: {ticket.category} • Created: {ticket.date}</p></div>
                       <Button size="sm" variant="secondary" className="h-8 text-xs">View</Button>
                    </div>
                 ))}
                 {localTickets.length === 0 && <p className="text-sm text-slate-500 text-center py-6">No active tickets found.</p>}
              </div>
           </Card>
           <div className="space-y-6">
              <Card title="Frequently Asked Questions">
                 <div className="space-y-2">{['How to reset password?', 'WiFi connectivity issues', 'Hostel leave application process'].map((faq, i) => (<div key={i} className="p-3 bg-slate-50 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 cursor-pointer flex justify-between items-center transition-colors">{faq} <ChevronRight className="w-4 h-4 text-slate-400"/></div>))}</div>
              </Card>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                 <div className="flex items-start gap-4"><div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm"><HelpCircle className="w-6 h-6"/></div><div><h4 className="font-bold text-lg">Need Immediate Help?</h4><p className="text-sm text-indigo-100 mt-2 leading-relaxed">Contact the Student Affairs office via email.</p><div className="mt-3 inline-block font-mono bg-black/20 px-3 py-1 rounded text-sm">help@edumark.edu</div></div></div>
              </div>
           </div>
        </div>
        <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Raise Support Ticket">
         <div className="space-y-4">
             <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Issue Category</label><select className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"><option>Academic</option><option>Technical (WiFi/Portal)</option><option>Facility (Hostel/Library)</option><option>Administrative</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Subject</label><input type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Brief summary of issue"/></div>
            <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Description</label><textarea rows={4} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Detailed description..."></textarea></div>
            <Button className="w-full" onClick={() => { setLocalTickets([...localTickets, { id: Date.now().toString(), subject: "New Ticket", category: 'TECHNICAL', status: 'OPEN', date: new Date().toISOString().split('T')[0], lastUpdate: 'Just now' }]); setIsTicketModalOpen(false); }}>Submit Ticket</Button>
         </div>
      </Modal>
     </div>
  );
};
export default StudentSupport;
