import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Description as DocumentIcon,
  Notifications as NotificationIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorBoundary } from '../ErrorBoundary';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // State for different sections
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        usersData,
        transactionsData,
        healthData,
        logsData
      ] = await Promise.all([
        adminService.getStats(),
        adminService.getActiveUsers(),
        adminService.getRecentTransactions(),
        adminService.getSystemHealth(),
        adminService.getAuditLogs()
      ]);

      setStats(statsData);
      setActiveUsers(usersData);
      setRecentTransactions(transactionsData);
      setSystemHealth(healthData);
      setAuditLogs(logsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      showNotification('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportData = async (type: string) => {
    try {
      await adminService.exportData(type);
      showNotification(`${type} data exported successfully`, 'success');
    } catch (err) {
      showNotification(`Failed to export ${type} data`, 'error');
    }
    handleMenuClose();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <ErrorBoundary>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1">
                Admin Dashboard
              </Typography>
              <Box>
                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleExportData('users')}>
                    Export Users
                  </MenuItem>
                  <MenuItem onClick={() => handleExportData('transactions')}>
                    Export Transactions
                  </MenuItem>
                  <MenuItem onClick={() => handleExportData('audit')}>
                    Export Audit Logs
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Total Users</Typography>
                </Box>
                <Typography variant="h4">{stats?.totalUsers}</Typography>
                <Typography color="textSecondary">
                  {stats?.newUsersToday} new today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">Revenue</Typography>
                </Box>
                <Typography variant="h4">
                  {formatCurrency(stats?.totalRevenue)}
                </Typography>
                <Typography color="textSecondary">
                  {formatCurrency(stats?.revenueToday)} today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <DocumentIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Documents</Typography>
                </Box>
                <Typography variant="h4">{stats?.totalDocuments}</Typography>
                <Typography color="textSecondary">
                  {stats?.documentsToday} uploaded today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SecurityIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6">Active Sessions</Typography>
                </Box>
                <Typography variant="h4">{stats?.activeSessions}</Typography>
                <Typography color="textSecondary">
                  {stats?.sessionsToday} new today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.userDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats?.userDistribution.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              {recentTransactions.map((transaction) => (
                <Box
                  key={transaction.id}
                  sx={{
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0 }
                  }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography>{transaction.description}</Typography>
                    <Typography
                      color={
                        transaction.type === 'credit'
                          ? 'success.main'
                          : 'error.main'
                      }
                    >
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(transaction.timestamp)}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* System Health */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">CPU Usage</Typography>
                  <Typography
                    color={
                      systemHealth?.cpu > 80
                        ? 'error.main'
                        : systemHealth?.cpu > 60
                        ? 'warning.main'
                        : 'success.main'
                    }
                  >
                    {systemHealth?.cpu}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Memory Usage</Typography>
                  <Typography
                    color={
                      systemHealth?.memory > 80
                        ? 'error.main'
                        : systemHealth?.memory > 60
                        ? 'warning.main'
                        : 'success.main'
                    }
                  >
                    {systemHealth?.memory}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Disk Usage</Typography>
                  <Typography
                    color={
                      systemHealth?.disk > 80
                        ? 'error.main'
                        : systemHealth?.disk > 60
                        ? 'warning.main'
                        : 'success.main'
                    }
                  >
                    {systemHealth?.disk}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">API Response Time</Typography>
                  <Typography
                    color={
                      systemHealth?.apiResponseTime > 1000
                        ? 'error.main'
                        : systemHealth?.apiResponseTime > 500
                        ? 'warning.main'
                        : 'success.main'
                    }
                  >
                    {systemHealth?.apiResponseTime}ms
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Audit Logs */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Audit Logs
              </Typography>
              {auditLogs.map((log) => (
                <Box
                  key={log.id}
                  sx={{
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0 }
                  }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography>
                      <strong>{log.user}</strong> {log.action}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(log.timestamp)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    IP: {log.ip} | User Agent: {log.userAgent}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ErrorBoundary>
  );
};

export default AdminDashboard; 