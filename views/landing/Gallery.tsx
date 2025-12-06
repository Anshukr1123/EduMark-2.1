
import React from 'react';
import { Button } from '../../components/UIComponents';

export const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Life at EduMark</h2>
                    <p className="text-slate-500">Explore our vibrant campus, modern facilities, and student activities.</p>
                </div>
                <Button variant="secondary" className="hidden md:flex">Follow @edumark_official</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                {/* Gallery Grid */}
                <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80" alt="Campus" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 text-white font-bold text-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">Central Library</div>
                </div>
                <div className="rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80" alt="Lab" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80" alt="Students" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80" alt="Graduation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="col-span-2 rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1576495199011-eb94736e0506?auto=format&fit=crop&q=80" alt="Auditorium" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute bottom-4 left-4 text-white font-bold text-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">Annual Convocation</div>
                </div>
            </div>
        </div>
    </section>
  );
};
