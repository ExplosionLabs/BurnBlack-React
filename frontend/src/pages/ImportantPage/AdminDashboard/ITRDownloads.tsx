import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Eye, 
  RefreshCw, 
  Search, 
  Filter, 
  Calendar,
  User,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { api } from '../../../utils/api';

interface ITRDownload {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  itrType: string;
  assessmentYear: string;
  status: 'generated' | 'downloaded' | 'pending' | 'failed';
  generatedAt: string;
  downloadedAt?: string;
  fileSize: number;
  taxableIncome: number;
  taxPayable: number;
  refundAmount?: number;
}

const ITRDownloads = () => {
  const [downloads, setDownloads] = useState<ITRDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  useEffect(() => {
    fetchITRDownloads();
  }, []);

  const fetchITRDownloads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/itr-downloads');
      setDownloads(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch ITR downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateITR = async (userId: string) => {
    try {
      await api.post(`/admin/generate-itr/${userId}`);
      fetchITRDownloads();
    } catch (error) {
      console.error('Failed to generate ITR:', error);
    }
  };

  const handleDownloadITR = async (downloadId: string) => {
    try {
      const response = await api.get(`/admin/download-itr/${downloadId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ITR_${downloadId}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download ITR:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'downloaded':
        return <Download className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'generated':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'downloaded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredDownloads = downloads.filter(download => {
    const matchesSearch = download.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         download.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         download.itrType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || download.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Download className="h-8 w-8 mr-3 text-blue-600" />
            ITR JSON Downloads
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all ITR JSON file generations and downloads</p>
        </div>
        <button
          onClick={fetchITRDownloads}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or ITR type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="h-4 w-4 inline mr-1" />
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="generated">Generated</option>
              <option value="downloaded">Downloaded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{downloads.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Generated</p>
              <p className="text-2xl font-bold text-green-600">
                {downloads.filter(d => d.status === 'generated').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {downloads.filter(d => d.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {downloads.filter(d => d.status === 'failed').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Downloads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ITR Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financial Summary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDownloads.map((download) => (
                <tr key={download.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {download.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {download.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{download.itrType}</div>
                      <div className="text-gray-500">AY {download.assessmentYear}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Income: ₹{download.taxableIncome.toLocaleString()}</div>
                      <div>Tax: ₹{download.taxPayable.toLocaleString()}</div>
                      {download.refundAmount && (
                        <div className="text-green-600">
                          Refund: ₹{download.refundAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(download.status)}
                      <span className={getStatusBadge(download.status)}>
                        {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(download.generatedAt).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      {(download.fileSize / 1024).toFixed(1)} KB
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {download.status === 'generated' && (
                      <button
                        onClick={() => handleDownloadITR(download.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    )}
                    {download.status === 'pending' && (
                      <button
                        onClick={() => handleGenerateITR(download.userId)}
                        className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Retry</span>
                      </button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDownloads.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No ITR downloads found matching your criteria</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ITRDownloads;