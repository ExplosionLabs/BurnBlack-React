import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UserManagement } from './components/Admin/UserManagement';
import { GSTManagement } from './components/Admin/GSTManagement';
import { AdminSettings } from './components/Admin/AdminSettings';
import { SupportManagement } from './components/Admin/SupportManagement';
import { UserRoute } from './components/UserRoute';
import { Dashboard } from './components/Dashboard';
import { FileITR } from './components/FileITR';
import { Documents } from './components/Documents';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { HomePage } from './components/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            {/* Existing routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/gst" element={<GSTManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/support" element={<SupportManagement />} />
            
            {/* Protected user routes */}
            <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
            <Route path="/fileITR" element={<UserRoute><FileITR /></UserRoute>} />
            <Route path="/documents" element={<UserRoute><Documents /></UserRoute>} />
            <Route path="/settings" element={<UserRoute><Settings /></UserRoute>} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App; 