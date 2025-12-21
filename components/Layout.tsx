
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { 
  LogOut, Menu, Bell, GraduationCap, Check, Trash2, Info, AlertCircle, CheckCircle2, XCircle, ArrowLeft, Search, ChevronRight, Home, Command
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

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, navItems, activeTab, onTabChange, onBack, showBackButton }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const handleClearNotifications = () => { setNotifications([]); setShowNotifications(false); };
  const handleNotificationClick = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'WARNING': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'ERROR': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Group nav items by category
  const categories = Array.from(new Set(navItems.map(item => item.category || 'OTHER')));
  
  const activeLabel = navItems.find(i => i.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center border-b border-slate-800 px-6">
          <div className="bg-indigo-600 p-1.5 rounded-lg mr-3 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">EduMark</span>
        </div>
        
        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll">
          {categories.map(cat => (
            <div key={cat} className="mb-6 last:mb-0">
              <h3 className="px-3 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{cat}</h3>
              <div className="space-y-1">
                {navItems.filter(item => (item.category || 'OTHER') === cat).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); setIsSidebarOpen(false); }}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <span className={`mr-3 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>{item.icon}</span>
                    {item.label}
                    {activeTab === item.id && <ChevronRight className="ml-auto w-3.5 h-3.5 opacity-50" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4 shrink-0 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center p-2 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full bg-slate-700 object-cover ring-2 ring-slate-700" />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-1">
            <button onClick={toggleSidebar} className="text-slate-500 md:hidden mr-4 p-1 rounded-lg hover:bg-slate-100">
              <Menu className="h-6 w-6" />
            </button>
            
            {showBackButton && onBack ? (
              <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors shadow-sm bg-white border border-slate-100" title="Go Back">
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
                <div className="hidden sm:flex items-center text-slate-400 text-xs font-medium mr-8">
                    <Home className="w-3.5 h-3.5 mr-2" />
                    <ChevronRight className="w-3 h-3 mx-2 opacity-50" />
                    <span className="text-slate-600 font-bold">{activeLabel}</span>
                </div>
            )}

            {/* Realistic Global Search */}
            <div className="hidden lg:flex items-center flex-1 max-w-md relative">
                <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search for courses, events, or tools..." 
                    className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-12 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-400 flex items-center gap-1 shadow-sm">
                    <Command className="w-2.5 h-2.5" /> K
                </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4" ref={notificationRef}>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all focus:outline-none">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 rounded-full ring-2 ring-white animate-bounce">{unreadCount}</span>}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50 border border-slate-100">
                  <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50 rounded-t-2xl">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Center Alerts</h3>
                    <div className="flex gap-3">
                      {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center uppercase"><Check className="h-3 w-3 mr-1" /> Mark read</button>}
                      <button onClick={handleClearNotifications} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-2">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Bell className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-sm font-medium">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-1">No new alerts to show.</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map(n => (
                          <div key={n.id} onClick={() => handleNotificationClick(n.id)} className={`p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent ${!n.isRead ? 'bg-indigo-50/50 border-indigo-100/50' : ''}`}>
                            <div className="flex gap-3">
                              <div className="mt-1 flex-shrink-0">{getNotificationIcon(n.type)}</div>
                              <div className="flex-1 space-y-0.5">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0 animate-pulse"></span>}
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-50 text-center">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 w-full py-2 hover:bg-indigo-50 rounded-lg transition-colors uppercase tracking-widest">View Activity Logs</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <button className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 transition-colors group">
                <img src={user.avatar} className="h-8 w-8 rounded-full border border-slate-200 shadow-sm" alt="Avatar"/>
                <span className="text-xs font-bold text-slate-700 pr-2 hidden sm:block group-hover:text-indigo-600">{user.name.split(' ')[0]}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 overflow-x-hidden">
            {children}
        </main>
      </div>
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300" />}
    </div>
  );
};

export default Layout;