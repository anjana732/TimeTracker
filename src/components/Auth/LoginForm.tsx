import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mock user based on email
    const mockUser = {
      id: '1',
      email,
      name: email.includes('admin') ? 'Admin User' : 'Intern User',
      role: email.includes('admin') ? 'admin' : 'intern',
    } as const;
    
    login(mockUser);
    
    // Redirect based on role
    if (mockUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-2xl">
            <Clock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            TimeTrack Pro
          </h1>
          <p className="text-gray-600 mt-2">Track your work hours efficiently</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-xl hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}