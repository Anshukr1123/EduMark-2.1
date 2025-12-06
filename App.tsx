
import React, { useState } from 'react';
import { User, UserRole } from './types';
import Login from './views/Login';
import StudentView from './views/StudentView';
import TeacherView from './views/TeacherView';
import AdminView from './views/AdminView';
import ParentView from './views/ParentView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If no user is logged in, show the Login screen
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Role-based routing: Redirect to the specific View based on UserRole
  switch (currentUser.role) {
    case UserRole.STUDENT:
      return <StudentView user={currentUser} onLogout={handleLogout} />;
      
    case UserRole.TEACHER:
      return <TeacherView user={currentUser} onLogout={handleLogout} />;
      
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      return <AdminView user={currentUser} onLogout={handleLogout} />;

    case UserRole.PARENT:
      return <ParentView user={currentUser} onLogout={handleLogout} />;
      
    // Fallback for unhandled roles
    default:
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
              <span className="text-xl" role="img" aria-label="warning">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Not Available</h2>
            <p className="text-slate-600 mb-4">
              The dashboard for the role <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{currentUser.role}</span> is currently under development.
            </p>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 underline"
            >
              Sign out and return to login
            </button>
          </div>
        </div>
      );
  }
};

export default App;
