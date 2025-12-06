
import React, { useState } from 'react';
import { CollegeEvent } from '../../../types';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { Calendar, Clock, MapPin, Search, Plus, Sparkles } from 'lucide-react';

interface Props { 
  events: CollegeEvent[];
  onRegister: (id: string) => void;
}

const StudentEvents: React.FC<Props> = ({ events, onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '', category: 'CULTURAL' });

  const handleRegisterEvent = (id: string) => {
    onRegister(id);
    alert("Successfully registered for event!");
  };

  const handleHostEvent = () => {
    // Logic to save event (mock)
    setIsHostModalOpen(false);
    alert("Event proposal submitted for approval!");
    setNewEvent({ title: '', description: '', date: '', location: '', category: 'CULTURAL' });
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
              <h2 className="text-2xl font-bold text-slate-900">Events & Activities</h2>
              <p className="text-sm text-slate-500">Discover or host campus events.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button onClick={() => setIsHostModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2"/> Host Event
             </Button>
          </div>
       </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
             <Card key={event.id} className="overflow-hidden p-0 flex flex-col h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md group">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                   <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute top-3 right-3"><Badge variant={event.registrationStatus === 'REGISTERED' ? 'success' : event.registrationStatus === 'CLOSED' ? 'error' : 'neutral'} className="shadow-lg backdrop-blur-md bg-white/90">{event.registrationStatus}</Badge></div>
                   <div className="absolute bottom-3 left-3 text-white"><span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 px-2 py-0.5 rounded shadow-sm">{event.category}</span></div>
                </div>
                <div className="p-5 flex-1 flex flex-col bg-white">
                   <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2">{event.title}</h3>
                      <div className="flex flex-col gap-2">
                          <div className="flex items-center text-xs text-slate-500">
                              <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500"/> 
                              {new Date(event.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})} • {event.time}
                          </div>
                          <div className="flex items-center text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5 mr-2 text-indigo-500"/> {event.location}
                          </div>
                      </div>
                   </div>
                   <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-1 leading-relaxed">{event.description}</p>
                   <Button className="w-full mt-auto font-semibold shadow-lg shadow-indigo-100" variant={event.registrationStatus === 'REGISTERED' ? 'secondary' : 'primary'} disabled={event.registrationStatus !== 'OPEN'} onClick={() => handleRegisterEvent(event.id)}>{event.registrationStatus === 'REGISTERED' ? 'You are going!' : event.registrationStatus === 'CLOSED' ? 'Registration Closed' : 'Register Now'}</Button>
                </div>
             </Card>
          ))}
       </div>

       <Modal isOpen={isHostModalOpen} onClose={() => setIsHostModalOpen(false)} title="Host an Event">
           <div className="space-y-4">
               <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3">
                   <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5" />
                   <p className="text-sm text-indigo-800">Submit your event proposal. All student-led events require approval from the Student Council.</p>
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Event Title</label>
                   <input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Coding Hackathon 2024" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Date</label>
                       <input type="date" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Category</label>
                       <select className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
                           <option value="CULTURAL">Cultural</option>
                           <option value="SPORTS">Sports</option>
                           <option value="WORKSHOP">Workshop</option>
                           <option value="SEMINAR">Seminar</option>
                       </select>
                   </div>
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Location</label>
                   <input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Auditorium" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Description</label>
                   <textarea rows={3} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Describe the event purpose and activities..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
               </div>
               <Button className="w-full mt-2" onClick={handleHostEvent} disabled={!newEvent.title || !newEvent.date}>Submit Proposal</Button>
           </div>
       </Modal>
    </div>
  );
};
export default StudentEvents;
