import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white">TimeTrack Pro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
              <User className="w-5 h-5 text-white/80" />
              <span className="text-sm font-medium text-white">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}