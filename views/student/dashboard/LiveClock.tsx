
import React, { useState, useEffect, memo } from 'react';
import { Clock } from 'lucide-react';

const LiveClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden md:flex flex-col justify-center items-center bg-white border border-slate-200 rounded-2xl p-6 min-w-[200px] shadow-sm animate-in slide-in-from-right-4 duration-500 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
      <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Campus Time</span>
      <div className="text-4xl font-black text-indigo-600 font-mono relative z-10 drop-shadow-sm">
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xs font-bold text-slate-500 mt-2 flex items-center relative z-10">
        <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-400"/> {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
};

export default memo(LiveClock);
