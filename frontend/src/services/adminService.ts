import { apiClient } from './apiClient';
import { handleApiError } from '../utils/errorHandler';

interface PaginationParams {
  page: number;
class AdminService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/admin`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth token to requests
  private setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Get dashboard statistics
  async getStats() {
    try {
      const response = await this.api.get('/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get active users
  async getActiveUsers() {
    try {
      const response = await this.api.get('/users/active');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get recent transactions
  async getRecentTransactions() {
    try {
      const response = await this.api.get('/transactions/recent');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get system health metrics
  async getSystemHealth() {
    try {
      const response = await this.api.get('/system/health');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get audit logs
  async getAuditLogs() {
    try {
      const response = await this.api.get('/audit-logs');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Export data
  async exportData(type: string) {
    try {
      const response = await this.api.get(`/export/${type}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-export-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get user management data
  async getUsers(params: any) {
    try {
      const response = await this.api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update user
  async updateUser(userId: string, data: any) {
    try {
      const response = await this.api.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete user
  async deleteUser(userId: string) {
    try {
      const response = await this.api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get transaction history
  async getTransactions(params: any) {
    try {
      const response = await this.api.get('/transactions', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get document statistics
  async getDocumentStats() {
    try {
      const response = await this.api.get('/documents/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get system settings
  async getSystemSettings() {
    try {
      const response = await this.api.get('/system/settings');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update system settings
  async updateSystemSettings(settings: any) {
    try {
      const response = await this.api.put('/system/settings', settings);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get API usage statistics
  async getApiUsage() {
    try {
      const response = await this.api.get('/system/api-usage');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get error logs
  async getErrorLogs() {
    try {
      const response = await this.api.get('/system/error-logs');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get performance metrics
  async getPerformanceMetrics() {
    try {
      const response = await this.api.get('/system/performance');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get security events
  async getSecurityEvents() {
    try {
      const response = await this.api.get('/system/security-events');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get backup status
  async getBackupStatus() {
    try {
      const response = await this.api.get('/system/backup-status');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Trigger manual backup
  async triggerBackup() {
    try {
      const response = await this.api.post('/system/backup');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get subscription analytics
  async getSubscriptionAnalytics() {
    try {
      const response = await this.api.get('/analytics/subscriptions');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get user activity analytics
  async getUserActivityAnalytics() {
    try {
      const response = await this.api.get('/analytics/user-activity');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get document analytics
  async getDocumentAnalytics() {
    try {
      const response = await this.api.get('/analytics/documents');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const adminService = new AdminService(); 