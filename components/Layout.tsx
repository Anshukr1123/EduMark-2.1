
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { 
  LogOut, Menu, Bell, GraduationCap, Check, Trash2, Info, AlertCircle, CheckCircle2, XCircle, ArrowLeft
} from 'lucide-react';
import { User, Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface LayoutProps {
  children: ReactNode;
  user: User;
  onLogout: () => void;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onBack?: () => void; // New Prop for Back Navigation
  showBackButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, navItems, activeTab, onTabChange, onBack, showBackButton }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition-transform duration-200 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <GraduationCap className="h-6 w-6 text-indigo-400 mr-2" />
          <span className="text-xl font-bold tracking-tight">EduMark</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setIsSidebarOpen(false); }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center">
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full bg-slate-700 object-cover" />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize truncate">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-slate-500 md:hidden mr-4">
              <Menu className="h-6 w-6" />
            </button>
            {showBackButton && onBack && (
              <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors" title="Go Back">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-slate-800">
              {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4" ref={notificationRef}>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <div className="flex gap-2">
                      {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center"><Check className="h-3 w-3 mr-1" /> Mark read</button>}
                      <button onClick={handleClearNotifications} className="text-xs text-slate-400 hover:text-slate-600"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500"><Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" /><p className="text-sm">No notifications</p></div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map(n => (
                          <div key={n.id} onClick={() => handleNotificationClick(n.id)} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-indigo-50/50' : ''}`}>
                            <div className="flex gap-3">
                              <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm font-medium ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>}
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-slate-400">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-100 text-center">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 w-full py-2">View All Activity</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm md:hidden" />}
    </div>
  );
};

export default Layout;
