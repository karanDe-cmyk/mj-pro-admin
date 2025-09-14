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
  DialogTitle,
  Grid,
  Stack
} from "@mui/material";
import axios from "../../utils/axiosInstance";
import dayjs from "dayjs";
import { green, red, grey } from '@mui/material/colors';

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
  const [gameOptions, setGameOptions] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    const fetchGameList = async () => {
      try {
        const response = await axios.get(`/api/starline/getGameList`);
        const uniqueGameNames = new Set();

        if (Array.isArray(response.data.data)) {
          response.data.data.forEach((game) => {
            uniqueGameNames.add(game.game_name);
          });
          setGameOptions([...uniqueGameNames].sort());
        } else {
          console.error("Expected an array at response.data.data");
          setMessage("Failed to load game list");
          setAlertOpen(true);
        }
      } catch (error) {
        console.error("Error fetching game list:", error);
        setMessage("Error loading game list");
        setAlertOpen(true);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchGameList();
  }, []);

  const fetchBids = async () => {
    if (!date || !game) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/Starlinebid/filter-bids",
        { date, gamename: game }
      );
      setBids(res.data.bids);
      setSelectedBids([]);
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
      const res = await axios.post(
        "/api/Starlinebid/revert-bids",
        {
          date,
          gamename: game,
          bidIds: idsToRevert,
          deleteHistory: true
        }
      );
      setMessage(`${res.data.count} bids reverted and history cleared`);
      setAlertOpen(true);
      fetchBids();
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

  const allSelected = bids.length > 0 && selectedBids.length === bids.length;
  const indeterminate = selectedBids.length > 0 && selectedBids.length < bids.length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Starline Bid Revert Panel
      </Typography>

      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: '12px' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD")}
              onChange={(e) => setDate(dayjs(e.target.value).format("DD-MM-YYYY"))}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Game Name"
              fullWidth
              variant="outlined"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              disabled={loadingGames}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              {loadingGames ? (
                <MenuItem disabled>Loading games...</MenuItem>
              ) : (
                gameOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmOpen(true)}
              disabled={!selectedBids.length || reverting}
              startIcon={reverting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                width: { xs: '100%', md: 'auto' },
                borderRadius: '8px',
                py: '12px',
                fontWeight: 'bold',
                bgcolor: red[600],
                '&:hover': { bgcolor: red[700] }
              }}
            >
              Revert Selected Bids ({selectedBids.length})
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>Fetching bids...</Typography>
        </Box>
      ) : bids.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="subtitle1" color="text.secondary">
            No bids found for the selected date and game.
          </Typography>
        </Box>
      ) : (
        <Paper elevation={4} sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Bids Found:
            </Typography>
            <Chip
              label={`${bids.length} bids (${selectedBids.length} selected)`}
              color="primary"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={indeterminate}
                      checked={allSelected}
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
                  <TableRow
                    key={bid.bidId}
                    hover
                    sx={{ '&.Mui-selected': { bgcolor: grey[200] } }}
                    selected={selectedBids.includes(bid.bidId)}
                  >
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
                        <Chip label="Reverted" sx={{ bgcolor: red[100], color: red[700], fontWeight: 'bold' }} size="small" />
                      ) : (
                        <Chip label="Active" sx={{ bgcolor: green[100], color: green[700], fontWeight: 'bold' }} size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
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
        </Paper>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Revert
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {singleRevertId
              ? "Are you sure you want to revert this single bid and delete its history? This action cannot be undone."
              : `Are you sure you want to revert ${selectedBids.length} selected bids and delete their history? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">Cancel</Button>
          <Button
            onClick={() => handleRevert(singleRevertId)}
            color="error"
            autoFocus
            disabled={reverting}
            startIcon={reverting ? <CircularProgress size={20} color="inherit" /> : null}
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
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StarlineRevert;