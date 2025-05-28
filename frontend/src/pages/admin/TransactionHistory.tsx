import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  SelectChangeEvent,
  Grid as MuiGrid,
  GridProps,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { useNotification } from '../../contexts/NotificationContext';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate, formatStatus } from '../../utils/formatters';
import { LineChart } from '../../components/charts';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  metadata?: {
    description?: string;
    reference?: string;
    [key: string]: any;
  };
}

interface TransactionFilters {
  type?: string;
  status?: string;
  paymentMethod?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Create a type-safe Grid component with breakpoint props
type GridItemProps = GridProps & {
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

const Grid = MuiGrid as React.ComponentType<GridItemProps>;

const TransactionHistory: React.FC = () => {
  const { showNotification } = useNotification();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [page, rowsPerPage, filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTransactions({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      setTransactions(response.transactions);
      setTotalTransactions(response.total);
    } catch (error) {
      showNotification('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof TransactionFilters, value: string | { start: string; end: string }) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleSelectChange = (field: keyof TransactionFilters) => (event: SelectChangeEvent) => {
    handleFilterChange(field, event.target.value);
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...(prev.dateRange || { start: '', end: '' }),
        [field]: value
      }
    }));
    setPage(0);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsDialogOpen(true);
  };

  const handleExport = async () => {
    try {
      await adminService.exportData('transactions');
      showNotification('Transactions exported successfully', 'success');
    } catch (error) {
      showNotification('Failed to export transactions', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <CancelIcon color="error" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      default:
        return null;
    }
  };

  // Prepare data for the revenue chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 21000, 18000, 24000],
        color: 'rgb(75, 192, 192)'
      }
    ]
  };

  const handleTextFieldChange = (field: keyof TransactionFilters) => (event: ChangeEvent<HTMLInputElement>) => {
    handleFilterChange(field, event.target.value);
  };

  const handleDateFieldChange = (field: 'start' | 'end') => (event: ChangeEvent<HTMLInputElement>) => {
    handleDateChange(field, event.target.value);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transaction History</Typography>
        <Box>
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1 }}
          >
            Filters
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            variant="contained"
            color="primary"
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Revenue Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Revenue Overview
          </Typography>
          <LineChart data={chartData.datasets} labels={chartData.labels} />
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.search || ''}
                  onChange={handleTextFieldChange('search')}
                  placeholder="Search by ID or user"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    label="Type"
                    value={filters.type || ''}
                    onChange={handleSelectChange('type')}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="subscription">Subscription</MenuItem>
                    <MenuItem value="one-time">One Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    label="Status"
                    value={filters.status || ''}
                    onChange={handleSelectChange('status')}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="payment-method-select-label">Payment Method</InputLabel>
                  <Select
                    labelId="payment-method-select-label"
                    id="payment-method-select"
                    label="Payment Method"
                    value={filters.paymentMethod || ''}
                    onChange={handleSelectChange('paymentMethod')}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="bank">Bank Transfer</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.dateRange?.start || ''}
                  onChange={handleDateFieldChange('start')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  type="date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.dateRange?.end || ''}
                  onChange={handleDateFieldChange('end')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{transaction.user.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {transaction.user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{formatStatus(transaction.type)}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(transaction.status)}
                        <Chip
                          label={formatStatus(transaction.status)}
                          color={getStatusColor(transaction.status) as any}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{formatStatus(transaction.paymentMethod)}</TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(transaction)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalTransactions}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box pt={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1">{selectedTransaction.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Amount
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(selectedTransaction.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(selectedTransaction.status)}
                    <Typography variant="body1">
                      {formatStatus(selectedTransaction.status)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {formatStatus(selectedTransaction.type)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {formatStatus(selectedTransaction.paymentMethod)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedTransaction.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    User
                  </Typography>
                  <Typography variant="body1">{selectedTransaction.user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedTransaction.user.email}
                  </Typography>
                </Grid>
                {selectedTransaction.metadata && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Additional Information
                    </Typography>
                    {Object.entries(selectedTransaction.metadata).map(([key, value]) => (
                      <Box key={key} mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          {formatStatus(key)}
                        </Typography>
                        <Typography variant="body1">{value}</Typography>
                      </Box>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionHistory; 