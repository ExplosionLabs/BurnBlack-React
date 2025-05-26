import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Description as DocumentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { adminService } from '../../services/adminService';
import { LineChart, BarChart } from '../../components/charts';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  documentStats: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  recentTransactions: Array<{
    id: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  }>;
  systemHealth: {
    status: string;
    cpu: number;
    memory: number;
    disk: number;
    uptime: number;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activeUsers, recentTransactions, systemHealth] = await Promise.all([
        adminService.getStats(),
        adminService.getActiveUsers(),
        adminService.getRecentTransactions(),
        adminService.getSystemHealth()
      ]);

      setStats({
        ...statsData,
        activeUsers: activeUsers.length,
        recentTransactions,
        systemHealth
      });
    } catch (error) {
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    handleMenuClose();
  };

  const handleExport = async (type: string) => {
    try {
      await adminService.exportData(type);
      showNotification(`${type} data exported successfully`, 'success');
    } catch (error) {
      showNotification('Failed to export data', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">
          Failed to load dashboard data
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <Box>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleTimeRangeChange('day')}>Last 24 Hours</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('week')}>Last 7 Days</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('month')}>Last 30 Days</MenuItem>
            <Divider />
            <MenuItem onClick={() => handleExport('users')}>Export Users</MenuItem>
            <MenuItem onClick={() => handleExport('transactions')}>Export Transactions</MenuItem>
            <MenuItem onClick={() => handleExport('documents')}>Export Documents</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h4">{formatNumber(stats.totalUsers)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {formatNumber(stats.activeUsers)} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(stats.totalRevenue)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {formatNumber(stats.totalTransactions)} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <DocumentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Documents</Typography>
              </Box>
              <Typography variant="h4">{formatNumber(stats.documentStats.total)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {formatNumber(stats.documentStats.verified)} verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">System Health</Typography>
              </Box>
              <Typography variant="h4" color={stats.systemHealth.status === 'healthy' ? 'success.main' : 'error.main'}>
                {stats.systemHealth.status}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Uptime: {Math.floor(stats.systemHealth.uptime / 3600)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Revenue Overview"
              subheader={`Last ${selectedTimeRange === 'day' ? '24 hours' : selectedTimeRange === 'week' ? '7 days' : '30 days'}`}
            />
            <CardContent>
              <LineChart
                data={[
                  { label: 'Revenue', data: [1200, 1900, 1500, 2100, 1800, 2400, 2200] },
                  { label: 'Transactions', data: [10, 15, 12, 18, 14, 20, 16] }
                ]}
                labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Document Status" />
            <CardContent>
              <BarChart
                data={[
                  { label: 'Verified', value: stats.documentStats.verified, color: 'success.main' },
                  { label: 'Pending', value: stats.documentStats.pending, color: 'warning.main' },
                  { label: 'Rejected', value: stats.documentStats.rejected, color: 'error.main' }
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Card>
        <CardHeader
          title="Recent Transactions"
          action={
            <IconButton onClick={() => navigate('/admin/transactions')}>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent>
          <List>
            {stats.recentTransactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <ListItem>
                  <ListItemIcon>
                    {transaction.status === 'completed' ? (
                      <CheckCircleIcon color="success" />
                    ) : transaction.status === 'pending' ? (
                      <WarningIcon color="warning" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${transaction.user.name} - ${formatCurrency(transaction.amount)}`}
                    secondary={`${transaction.type} - ${formatDate(transaction.createdAt)}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 