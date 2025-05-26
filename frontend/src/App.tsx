import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App; 