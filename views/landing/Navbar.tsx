
import React, { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '../../components/UIComponents';

interface NavbarProps {
    onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
      setIsMobileMenuOpen(false);
      if (onOpenLogin) {
          onOpenLogin();
      } else {
          scrollToSection('login-form');
      }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">EduMark</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {['About', 'Events', 'Gallery', 'Contact'].map((item) => (
                        <button 
                          key={item} 
                          onClick={() => scrollToSection(item.toLowerCase())} 
                          className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            {item}
                        </button>
                    ))}
                    <Button size="sm" onClick={handleLoginClick}>Login Portal</Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                        {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                    </button>
                </div>
            </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-2">
                <div className="px-4 pt-2 pb-4 space-y-1">
                    {['About', 'Events', 'Gallery', 'Contact'].map((item) => (
                        <button 
                          key={item} 
                          onClick={() => scrollToSection(item.toLowerCase())} 
                          className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                        >
                            {item}
                        </button>
                    ))}
                    <div className="pt-2">
                       <Button className="w-full" onClick={handleLoginClick}>Login Portal</Button>
                    </div>
                </div>
            </div>
        )}
    </nav>
  );
};
