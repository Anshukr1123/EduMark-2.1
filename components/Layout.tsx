import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { 
  LogOut, Menu, Bell, GraduationCap, ChevronRight, Home, MoreVertical
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
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const scrollContainerRef = useRef<HTMLElement>(null);

  // Reset scroll on tab change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeTab]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 h-screen w-screen flex bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Hidden by default on all screen sizes */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 shrink-0 items-center border-b border-slate-800 px-6">
          <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase">EduMark</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar space-y-8">
          {['MAIN', 'ACADEMICS', 'FINANCE', 'SOCIAL'].map(cat => {
            const items = navItems.filter(item => (item.category || 'OTHER') === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="space-y-2">
                <h3 className="px-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{cat}</h3>
                <div className="space-y-1">
                  {items.map((item) => (
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
            );
          })}
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

      {/* Main Content Viewport Area - md:ml-64 removed to fill entire screen when sidebar is closed */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden transition-all duration-300">
        {/* Fixed Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-xl px-4 sm:px-8 z-40">
          <div className="flex items-center gap-4">
            {/* Menu button visible on all screens now */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-2 group"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Menu</span>
            </button>
            
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
               <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1 hover:text-indigo-600 transition-colors flex items-center gap-1"
                  title="Toggle Menu"
               >
                  <Home className="w-4 h-4" />
               </button>
               <ChevronRight className="w-3 h-3 opacity-30" />
               <span className="text-slate-900 truncate max-w-[120px] sm:max-w-none">{activeTab.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-white hover:shadow-sm transition-all">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 rounded-full ring-2 ring-white">{unreadCount}</span>}
            </button>
            <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
            >
               <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main content wrapper */}
        <main 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar"
        >
          <div className="w-full h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>

      {/* Backdrop - Visible on all screen sizes when sidebar is open */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        />
      )}
    </div>
  );
};

export default Layout;