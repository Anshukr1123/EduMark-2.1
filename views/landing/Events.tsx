import React from 'react';
import { MOCK_COLLEGE_EVENTS } from '../../constants';
import { Card, Button } from '../../components/UIComponents';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

export const EventsSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 flex flex-col justify-center h-full">
        <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Institutional Events</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">From tech symposiums to cultural fests, discover the vibrant heartbeat of EduMark.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_COLLEGE_EVENTS.slice(0, 3).map((event) => (
                <Card key={event.id} className="group p-0 border-0 shadow-2xl hover:shadow-indigo-100 transition-all duration-500 overflow-hidden flex flex-col h-full rounded-[40px]">
                    <div className="relative h-56 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-slate-800 shadow-xl border border-white/50">
                            {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </div>
                        <span className="absolute bottom-6 left-6 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            {event.category}
                        </span>
                    </div>
                    <div className="p-8 flex flex-col flex-1 bg-white">
                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{event.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">{event.description}</p>
                        
                        <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500"/> {event.location}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500"/> {event.time}</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
        <div className="text-center mt-12">
            <Button variant="outline" className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-[10px] border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all">
                Full Academic Calendar <ArrowRight className="w-4 h-4 ml-3"/>
            </Button>
        </div>
    </div>
  );
};