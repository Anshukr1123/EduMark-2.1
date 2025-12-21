import React from 'react';
import { MOCK_COLLEGE_EVENTS } from '../../constants';
import { Card, Button } from '../../components/UIComponents';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="full-screen bg-white justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Upcoming Campus Events</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">From tech symposiums to cultural fests, discover what's happening at EduMark this semester.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_COLLEGE_EVENTS.slice(0, 3).map((event) => (
                    <Card key={event.id} className="group p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                        <div className="relative h-48 overflow-hidden">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                                {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </div>
                            <span className="absolute bottom-4 left-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                {event.category}
                            </span>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                            
                            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {event.location}</span>
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {event.time}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="text-center mt-12">
                <Button variant="outline" className="rounded-full px-8">View Full Calendar <ArrowRight className="w-4 h-4 ml-2"/></Button>
            </div>
        </div>
    </section>
  );
};