import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/Auth/LoginForm';
import { Timer } from './components/TimeTracker/Timer';
import { ManualEntry } from './components/TimeTracker/ManualEntry';
import { TimeEntryList } from './components/TimeTracker/TimeEntryList';
import { InternList } from './components/Admin/InternList';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

function InternDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Timer />
        <ManualEntry />
      </div>
      <TimeEntryList />
    </div>
  );
}

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginForm />} 
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <InternDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <InternList />
            </PrivateRoute>
          }
        />
        <Route 
          path="/" 
          element={
            user 
              ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;