import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { 
  LogOut, Menu, Bell, GraduationCap, ChevronRight, Home
} from 'lucide-react';
import { User, Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category?: 'MAIN' | 'ACADEMICS' | 'FINANCE' | 'SOCIAL' | 'ADMIN' | 'SYSTEM';
}

interface LayoutProps {
  children: ReactNode;
  user: User;
  onLogout: () => void;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, navItems, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scale, setScale] = useState(100);
  const [isPinching, setIsPinching] = useState(false);
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const initialPinchDist = useRef<number | null>(null);
  const initialScale = useRef<number>(100);

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`;
  }, [scale]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      initialPinchDist.current = dist;
      initialScale.current = scale;
      setIsPinching(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDist.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const ratio = currentDist / initialPinchDist.current;
      const newScale = Math.min(Math.max(initialScale.current * ratio, 60), 140);
      setScale(Math.round(newScale));
    }
  };

  const handleTouchEnd = () => {
    initialPinchDist.current = null;
    setIsPinching(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div 
      className="fixed inset-0 h-screen w-screen flex bg-slate-900 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visual Feedback for Scale */}
      {isPinching && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-in fade-in duration-200">
           <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 px-10 py-6 rounded-[40px] shadow-2xl flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Viewport Scale</span>
              <span className="text-6xl font-black text-white tracking-tighter tabular-nums">{scale}%</span>
           </div>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] bg-purple-100/30 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Fixed Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 shrink-0 items-center border-b border-slate-800 px-6">
          <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase">EduMark</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar space-y-8">
          {['MAIN', 'ACADEMICS', 'FINANCE', 'SOCIAL'].map(cat => (
            <div key={cat} className="space-y-2">
              <h3 className="px-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{cat}</h3>
              <div className="space-y-1">
                {navItems.filter(item => (item.category || 'OTHER') === cat).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); setIsSidebarOpen(false); }}
                    className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <span className={`mr-3 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <img src={user.avatar} className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/50" alt={user.name} />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-black text-white truncate">{user.name}</p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center rounded-xl py-3 text-xs font-black text-slate-400 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest border border-slate-800">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport Container */}
      <div className="flex-1 flex flex-col md:ml-64 relative z-10 h-full overflow-hidden">
        {/* Fixed Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-xl px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-600 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
               <Home className="w-4 h-4" />
               <ChevronRight className="w-3 h-3 opacity-30" />
               <span className="text-slate-900">{activeTab.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-white hover:shadow-sm transition-all">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 rounded-full ring-2 ring-white">{unreadCount}</span>}
            </button>
          </div>
        </header>

        {/* Scrollable Main Area - ONLY element that scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 scroll-smooth">
            <div className="w-full max-w-[1400px] mx-auto pb-20">
                {children}
            </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300" />}
    </div>
  );
};

export default Layout;