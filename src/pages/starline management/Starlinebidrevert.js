import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  MenuItem, 
  Typography, 
  Snackbar, 
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
// import axios from "axios";
import axiosInstance from '../../utils/axiosInstance'
import dayjs from "dayjs";

const gameOptions = ["11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"];

const StarlineRevert = () => {
  const [date, setDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [game, setGame] = useState("");
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [selectedBids, setSelectedBids] = useState([]);
  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [singleRevertId, setSingleRevertId] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchBids = async () => {
    if (!date || !game) return;
    
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/api/Starlinebid/filter-bids", 
        { date, gamename: game },
        getAuthHeader()
      );
      setBids(res.data.bids);
      setSelectedBids([]); // Reset selection on new fetch
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to fetch bids");
      setAlertOpen(true);
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (bidId = null) => {
    const idsToRevert = bidId ? [bidId] : selectedBids;
    
    if (!idsToRevert.length) return;
    
    setReverting(true);
    try {
      const res = await axiosInstance.post(
        "/api/Starlinebid/revert-bids", 
        { 
          date, 
          gamename: game,
          bidIds: idsToRevert,
          deleteHistory: true // Add this flag to backend
        },
        getAuthHeader()
      );
      setMessage(`${res.data.count} bids reverted and history cleared`);
      setAlertOpen(true);
      fetchBids(); // Refresh the list
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to revert bids");
      setAlertOpen(true);
    } finally {
      setReverting(false);
      setSingleRevertId(null);
      setConfirmOpen(false);
    }
  };

  const handleSelect = (bidId) => {
    setSelectedBids(prev => 
      prev.includes(bidId) 
        ? prev.filter(id => id !== bidId) 
        : [...prev, bidId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBids.length === bids.length) {
      setSelectedBids([]);
    } else {
      setSelectedBids(bids.map(b => b.bidId));
    }
  };

  useEffect(() => {
    if (date && game) {
      fetchBids();
    }
  }, [date, game]);

  return (
    <Box sx={{ p: 3, maxWidth: 1200 }}>
      <Typography variant="h5" gutterBottom>
        Starline Bid Revert Panel
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD")}
            onChange={(e) => setDate(dayjs(e.target.value).format("DD-MM-YYYY"))}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            select
            label="Game Time"
            fullWidth
            value={game}
            onChange={(e) => setGame(e.target.value)}
          >
            {gameOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={`${bids.length} bids found (${selectedBids.length} selected)`} 
            color="primary" 
          />
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmOpen(true)}
            disabled={!selectedBids.length || reverting}
            startIcon={reverting ? <CircularProgress size={20} /> : null}
          >
            Revert Selected
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedBids.length > 0 && selectedBids.length < bids.length}
                      checked={bids.length > 0 && selectedBids.length === bids.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Digit</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((bid) => (
                  <TableRow key={bid.bidId}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedBids.includes(bid.bidId)}
                        onChange={() => handleSelect(bid.bidId)}
                        disabled={bid.reverted}
                      />
                    </TableCell>
                    <TableCell>{bid.userName}</TableCell>
                    <TableCell>{bid.digit}</TableCell>
                    <TableCell>₹{bid.points}</TableCell>
                    <TableCell>
                      {bid.reverted ? (
                        <Chip label="Reverted" color="error" size="small" />
                      ) : (
                        <Chip label="Active" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setSingleRevertId(bid.bidId);
                          setConfirmOpen(true);
                        }}
                        disabled={bid.reverted}
                      >
                        Revert
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>
          Confirm Revert
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {singleRevertId 
              ? "Are you sure you want to revert this single bid and delete its history?"
              : `Are you sure you want to revert ${selectedBids.length} selected bids and delete their history?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleRevert(singleRevertId)} 
            color="error"
            autoFocus
          >
            Confirm Revert
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={alertOpen} 
        autoHideDuration={5000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={message.includes('Failed') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StarlineRevert;