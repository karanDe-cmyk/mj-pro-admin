import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
  Fade,
  Zoom,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Badge
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance';

const NotificationManagement = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/settings/noticeManagement');
      // Handle both array and object responses
      const notificationsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.notifications || [];
      
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/settings/noticeManagement/${id}`);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
      setSuccess('Notification deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedNotification(null);
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification. Please try again.');
    }
  };

  const openDeleteDialog = (notification) => {
    setSelectedNotification(notification);
    setDeleteDialogOpen(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (type) => {
    if (type) setFilterType(type);
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (sortType) => {
    if (sortType) setSortBy(sortType);
    setSortAnchorEl(null);
  };

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      // Search filter
      const matchesSearch = 
        (notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         notification.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         notification.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Type filter (if you have type field)
      const matchesType = filterType === 'all' || notification.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.declaredAt);
      const dateB = new Date(b.createdAt || b.declaredAt);
      
      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

  // Pagination
  const paginatedNotifications = filteredNotifications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(date);
  };

  const getNotificationIcon = (notification) => {
    if (notification.type === 'important') return <ErrorIcon color="error" />;
    if (notification.type === 'success') return <CheckCircleIcon color="success" />;
    if (notification.type === 'warning') return <WarningIcon color="warning" />;
    if (notification.type === 'info') return <InfoIcon color="info" />;
    return <NotificationsIcon color="primary" />;
  };

  const getNotificationColor = (notification) => {
    if (notification.type === 'important') return theme.palette.error.light;
    if (notification.type === 'success') return theme.palette.success.light;
    if (notification.type === 'warning') return theme.palette.warning.light;
    if (notification.type === 'info') return theme.palette.info.light;
    return theme.palette.primary.light;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Notification Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and delete system notifications
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {notifications.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Notifications
                </Typography>
              </Box>
              <NotificationsIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.5) }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {notifications.filter(n => getTimeAgo(n.createdAt).includes('hour')).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent (24h)
                </Typography>
              </Box>
              <AccessTimeIcon sx={{ fontSize: 48, color: alpha(theme.palette.success.main, 0.5) }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <TextField
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ flexGrow: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box display="flex" gap={1}>
            <Tooltip title="Filter">
              <IconButton onClick={handleFilterClick}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort">
              <IconButton onClick={handleSortClick}>
                <SortIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchNotifications}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip
            label={`All (${filteredNotifications.length})`}
            onClick={() => handleFilterClose('all')}
            color={filterType === 'all' ? 'primary' : 'default'}
            variant={filterType === 'all' ? 'filled' : 'outlined'}
          />
        </Box>
      </Paper>

      {/* Notifications Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {paginatedNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No notifications found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? 'Try adjusting your search' : 'All notifications will appear here'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNotifications.map((notification, index) => (
                  <TableRow
                    key={notification._id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        transition: 'all 0.3s'
                      }
                    }}
                  >
                    <TableCell>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getNotificationColor(notification), 0.2),
                          width: 40,
                          height: 40
                        }}
                      >
                        {getNotificationIcon(notification)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {notification.title || 'Untitled'}
                      </Typography>
                      {notification.type && (
                        <Chip
                          label={notification.type}
                          size="small"
                          sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                          color={
                            notification.type === 'important' ? 'error' :
                            notification.type === 'success' ? 'success' :
                            notification.type === 'warning' ? 'warning' : 'default'
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                        {notification.body || notification.message || notification.description || 'No message'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(notification.createdAt || notification.declaredAt)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getTimeAgo(notification.createdAt || notification.declaredAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(notification)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredNotifications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => handleFilterClose(null)}
      >
        <MenuItem onClick={() => handleFilterClose('all')}>All Notifications</MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => handleSortClose(null)}
      >
        <MenuItem onClick={() => handleSortClose('newest')}>Newest First</MenuItem>
        <MenuItem onClick={() => handleSortClose('oldest')}>Oldest First</MenuItem>
        <MenuItem onClick={() => handleSortClose('title')}>By Title</MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6" component="span">
            Delete Notification
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notification? This action cannot be undone.
          </DialogContentText>
          {selectedNotification && (
            <Box mt={2} p={2} bgcolor={alpha(theme.palette.error.main, 0.05)} borderRadius={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {selectedNotification.title || 'Untitled'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedNotification.body || selectedNotification.message || 'No message'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Created: {formatDate(selectedNotification.createdAt || selectedNotification.declaredAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(selectedNotification?._id)}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NotificationManagement;