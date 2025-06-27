import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Users, FileText, Settings, AlertCircle, TrendingUp, Shield, Download, Database, BarChart3, CreditCard, BookOpen, Globe, Receipt } from 'lucide-react';
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
      description: 'Manage users and ITR generations'
    },
    {
      title: 'ITR JSON Downloads',
      icon: Download,
      href: '/admin/itr-downloads',
      color: 'bg-green-500',
      description: 'View and manage all ITR JSON files'
    },
    {
      title: 'GST Management',
      icon: Receipt,
      href: '/admin/gst',
      color: 'bg-orange-500',
      description: 'GSTIN verification and data'
    },
    {
      title: 'Database Management',
      icon: Database,
      href: '/admin/database',
      color: 'bg-purple-500',
      description: 'Supabase data and analytics'
    },
    {
      title: 'Tax Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-red-500',
      description: 'Filing trends and statistics'
    },
    {
      title: 'Payment Management',
      icon: CreditCard,
      href: '/admin/payments',
      color: 'bg-indigo-500',
      description: 'Transactions and wallet balances'
    },
    {
      title: 'Documentation',
      icon: BookOpen,
      href: '/admin/docs',
      color: 'bg-teal-500',
      description: 'API docs and system guides'
    },
    {
      title: 'System Settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-600',
      description: 'Application configuration'
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
              className={`${action.color} p-6 rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <div className="flex flex-col items-start space-y-3">
                <action.icon className="h-8 w-8" />
                <div className="text-left">
                  <div className="text-lg font-semibold">{action.title}</div>
                  <div className="text-sm opacity-90 mt-1">{action.description}</div>
                </div>
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

        {/* Key Features Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ITR Processing Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Download className="h-6 w-6 mr-2 text-green-600" />
              ITR JSON Processing
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-gray-700">Total ITR Generated</span>
                <span className="font-bold text-green-600">{metrics?.filings.total || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-gray-700">Pending Processing</span>
                <span className="font-bold text-blue-600">{metrics?.filings.pending || 0}</span>
              </div>
              <button
                onClick={() => navigate('/admin/itr-downloads')}
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Manage ITR Downloads
              </button>
            </div>
          </motion.div>

          {/* GSTIN Integration Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="h-6 w-6 mr-2 text-orange-600" />
              GSTIN API Integration
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="text-gray-700">Verified GST Records</span>
                <span className="font-bold text-orange-600">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="text-gray-700">SurePass API</span>
                <span className="font-bold text-purple-600">Connected</span>
              </div>
              <button
                onClick={() => navigate('/admin/gst')}
                className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                Manage GST Data
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Admin User</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ITR JSON Generated</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">User Dashboard</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 minutes ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">System</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GSTIN Verified</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GST Management</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 minutes ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard; 