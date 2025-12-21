import React from 'react';
import { Button } from '../../components/UIComponents';
import { Instagram, ArrowUpRight } from 'lucide-react';

export const GallerySection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 flex flex-col justify-center h-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">Vibrant <br/> Campus Ecosystem</h2>
                <p className="text-slate-500 font-medium text-lg max-w-xl">Exploring our state-of-the-art technical facilities, collaborative nodes, and research clusters.</p>
            </div>
            <Button variant="secondary" className="hidden md:flex h-12 px-8 font-black uppercase tracking-widest text-[10px] rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                <Instagram className="w-4 h-4 mr-2" /> Follow Institutional Feed
            </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[500px]">
            <div className="col-span-2 row-span-2 rounded-[40px] overflow-hidden relative group shadow-2xl">
                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80" alt="Campus" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-8 left-8 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                    <h4 className="font-black text-3xl uppercase tracking-tighter">Central Libris Node</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-2">Active Research Zone</p>
                </div>
            </div>
            <div className="rounded-[32px] overflow-hidden relative group shadow-xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80" alt="Lab" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" />
            </div>
            <div className="rounded-[32px] overflow-hidden relative group shadow-xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80" alt="Students" className="w-full h-full object-cover transition-transform duration-1000 group-hover:rotate-3" />
            </div>
            <div className="rounded-[32px] overflow-hidden relative group shadow-xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80" alt="Graduation" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="col-span-2 rounded-[40px] overflow-hidden relative group shadow-2xl">
                <img src="https://images.unsplash.com/photo-1576495199011-eb94736e0506?auto=format&fit=crop&q=80" alt="Auditorium" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                <div className="absolute bottom-8 left-8 text-white font-black text-2xl uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-3">
                    Convocation Cluster <ArrowUpRight className="w-6 h-6" />
                </div>
            </div>
        </div>
    </div>
  );
};