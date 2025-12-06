
import React, { useState } from 'react';
import { Message } from '../../../types';
import { Button, Modal } from '../../../components/UIComponents';
import { Plus, MessageSquare, Send } from 'lucide-react';

interface Props { messages: Message[]; }

const StudentMessages: React.FC<Props> = ({ messages }) => {
  const [activeMessageTab, setActiveMessageTab] = useState<'INBOX' | 'SENT'>('INBOX');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const displayMessages = messages.filter(m => m.type === activeMessageTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)]">
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
               <div className="p-4 border-b border-slate-100"><Button className="w-full shadow-md shadow-indigo-100" onClick={() => setIsComposeModalOpen(true)}><Plus className="w-4 h-4 mr-2"/> Compose</Button></div>
               <div className="flex border-b border-slate-100">
                  <button className={`flex-1 py-3 text-sm font-bold ${activeMessageTab === 'INBOX' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveMessageTab('INBOX')}>Inbox</button>
                  <button className={`flex-1 py-3 text-sm font-bold ${activeMessageTab === 'SENT' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveMessageTab('SENT')}>Sent</button>
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {displayMessages.map(msg => (
                     <div key={msg.id} className={`p-3 rounded-lg cursor-pointer transition-all border ${!msg.isRead && activeMessageTab === 'INBOX' ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'}`}>
                        <div className="flex justify-between items-start mb-1"><h4 className={`font-bold text-sm truncate pr-2 ${!msg.isRead ? 'text-indigo-900' : 'text-slate-700'}`}>{activeMessageTab === 'INBOX' ? msg.sender : msg.recipient}</h4><span className="text-[10px] text-slate-400 whitespace-nowrap">{msg.date}</span></div>
                        <p className={`text-xs truncate ${!msg.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{msg.subject}</p><p className="text-xs text-slate-500 truncate mt-1">{msg.body}</p>
                     </div>
                  ))}
               </div>
            </div>
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 shadow-sm"><div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner"><MessageSquare className="w-10 h-10 text-slate-300"/></div><h3 className="text-lg font-bold text-slate-700">Select a Conversation</h3><p className="text-sm">Choose a message from the list to view details.</p></div>
         </div>
         <Modal isOpen={isComposeModalOpen} onClose={() => setIsComposeModalOpen(false)} title="Compose Message">
            <div className="space-y-4">
               <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Recipient</label><select className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"><option>Prof. Robert Smith</option><option>Dr. Emily Carter</option></select></div>
               <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Subject</label><input type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Query regarding assignment"/></div>
               <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Message</label><textarea rows={5} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Type your message here..."></textarea></div>
               <Button className="w-full" onClick={() => { setIsComposeModalOpen(false); alert("Message Sent!"); }}><Send className="w-4 h-4 mr-2"/> Send Message</Button>
            </div>
         </Modal>
    </div>
  );
};
export default StudentMessages;
