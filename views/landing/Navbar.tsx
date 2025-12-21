
import React, { useState, useEffect } from 'react';
import { GraduationCap, Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/UIComponents';

interface NavbarProps {
    onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const main = document.querySelector('main');
      if (main && main.scrollTop > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    const main = document.querySelector('main');
    main?.addEventListener('scroll', handleScroll);
    return () => main?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200 h-16' : 'bg-transparent h-24'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex justify-between items-center h-full">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-2xl font-black uppercase tracking-tighter ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>EduMark</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    {['About', 'Features', 'Events', 'Gallery'].map((item) => (
                        <button 
                          key={item} 
                          onClick={() => scrollToSection(item.toLowerCase())} 
                          className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${scrolled ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
                        >
                            {item}
                        </button>
                    ))}
                    <Button size="sm" className="rounded-xl px-6 h-10 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100" onClick={onOpenLogin}>
                        Portal Login <ArrowUpRight className="w-3 h-3 ml-2" />
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                        {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                    </button>
                </div>
            </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100 animate-in slide-in-from-top-2">
                <div className="px-6 pt-4 pb-8 space-y-4">
                    {['About', 'Features', 'Events', 'Gallery'].map((item) => (
                        <button 
                          key={item} 
                          onClick={() => scrollToSection(item.toLowerCase())} 
                          className="block w-full text-left py-2 text-xs font-black uppercase tracking-[0.3em] text-slate-600 hover:text-indigo-600"
                        >
                            {item}
                        </button>
                    ))}
                    <div className="pt-4">
                       <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={onOpenLogin}>Login Portal</Button>
                    </div>
                </div>
            </div>
        )}
    </nav>
  );
};
