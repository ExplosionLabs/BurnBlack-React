import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Users, FileText, Settings, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { AdminRoute } from '../../components/ProtectedRoutes';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

interface SystemMetrics {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  filings: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  system: {
    uptime: number;
    activeSessions: number;
    storageUsed: number;
  };
}

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/admin/metrics');
        setMetrics(response.data.data);
      } catch (err) {
        setError('Failed to fetch system metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'User Management',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'GST Management',
      icon: FileText,
      href: '/admin/gst',
      color: 'bg-green-500',
    },
    {
      title: 'System Settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-purple-500',
    },
    {
      title: 'Support Tickets',
      icon: AlertCircle,
      href: '/admin/support',
      color: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
            <motion.button
              key={action.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.href)}
              className={`${action.color} p-6 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center space-x-4">
                <action.icon className="h-8 w-8" />
                <span className="text-lg font-semibold">{action.title}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Users Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-500" />
              User Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold">{metrics?.users.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold">{metrics?.users.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Today</span>
                <span className="font-semibold text-green-500">
                  +{metrics?.users.newToday}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Filings Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-green-500" />
              Filing Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Filings</span>
                <span className="font-semibold">{metrics?.filings.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-500">
                  {metrics?.filings.pending}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approved</span>
                <span className="font-semibold text-green-500">
                  {metrics?.filings.approved}
                </span>
              </div>
            </div>
          </motion.div>

          {/* System Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-purple-500" />
              System Health
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="font-semibold">
                  {Math.floor(metrics?.system.uptime || 0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-semibold">{metrics?.system.activeSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-semibold">
                  {Math.round((metrics?.system.storageUsed || 0) / 1024 / 1024)} MB
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-red-500" />
            Recent Admin Activity
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Activity rows will be populated here */}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard; 