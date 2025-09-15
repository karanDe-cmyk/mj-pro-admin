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
} from "@mui/material";
import { green, red, grey } from "@mui/material/colors";
import axiosInstance from "../utils/axiosInstance";
import dayjs from "dayjs";

const BidRevert = () => {
  const [date, setDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [market, setMarket] = useState("");
  const [game, setGame] = useState("");
  const [gameType, setGameType] = useState("open");
  const [marketList, setMarketList] = useState([]);
  const [gameOptions, setGameOptions] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [selectedBids, setSelectedBids] = useState([]);
  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [singleRevertId, setSingleRevertId] = useState(null);

  // Fetch markets
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await axiosInstance.get("/api/marketManagement/getMarketGames");
        if (res.data) {
          const uniqueMarkets = [...new Set(res.data.map((item) => item.marketName))];
          setMarketList(uniqueMarkets);
        }
      } catch (err) {
        setMessage("Failed to fetch market list");
        setAlertOpen(true);
      }
    };
    fetchMarkets();
  }, []);

  // Fetch games when market changes
  const handleMarketChange = async (marketName) => {
    setMarket(marketName);
    setGame("");
    setGameOptions([]);
    try {
      const res = await axiosInstance.get(
        `/api/marketManagement/getMarketGames?marketName=${marketName}`
      );
      if (res.data) {
        const uniqueGames = [...new Set(res.data.map((item) => item.gameName))];
        setGameOptions(uniqueGames);
      }
    } catch (err) {
      setMessage("Failed to fetch games for market");
      setAlertOpen(true);
    }
  };

  // Fetch bids based on filters
  const fetchBids = async () => {
    if (!date || !market || !game || !gameType) return;
    setLoading(true);
    try {
      const formattedDate = dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD");
      const res = await axiosInstance.post("/api/bid/filterBids", {
        date: formattedDate,
        market,
        gameName: game,
        gameType,
      });
      setBids(res.data.bids || []);
      setSelectedBids([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to fetch bids");
      setAlertOpen(true);
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  // Revert bids
  const handleRevert = async (bidId = null) => {
    const idsToRevert = bidId ? [bidId] : selectedBids;
    if (!idsToRevert.length) return;

    setReverting(true);
    try {
      const formattedDate = dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD");

      const res = await axiosInstance.post("/api/bid/revertBid", {
        date: formattedDate,
        market,
        gameName: game,
        gameType,
        bidIds: idsToRevert,
      });

      setMessage(res.data.message || "Bids reverted and deleted successfully");
      setAlertOpen(true);

      // Remove reverted bids from state immediately
      setBids((prevBids) => prevBids.filter((b) => !idsToRevert.includes(b.bidId)));

      // Clear selected bids
      setSelectedBids([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to revert bids");
      setAlertOpen(true);
    } finally {
      setReverting(false);
      setSingleRevertId(null);
      setConfirmOpen(false);
    }
  };


  // Selection logic
  const handleSelect = (bidId) => {
    setSelectedBids((prev) =>
      prev.includes(bidId) ? prev.filter((id) => id !== bidId) : [...prev, bidId]
    );
  };
  const handleSelectAll = () => {
    if (selectedBids.length === bids.length) {
      setSelectedBids([]);
    } else {
      setSelectedBids(bids.map((b) => b.bidId));
    }
  };

  const allSelected = bids.length > 0 && selectedBids.length === bids.length;
  const indeterminate = selectedBids.length > 0 && selectedBids.length < bids.length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "text.primary" }}>
        Main Market Bid Revert Panel
      </Typography>

      {/* Filters */}
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: "12px" }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField select label="Market" fullWidth value={market} onChange={(e) => handleMarketChange(e.target.value)}>
              {marketList.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField select label="Game" fullWidth value={game} onChange={(e) => setGame(e.target.value)} disabled={!gameOptions.length}>
              {gameOptions.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField select label="Type" fullWidth value={gameType} onChange={(e) => setGameType(e.target.value)}>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="close">Close</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD")}
              onChange={(e) => setDate(dayjs(e.target.value).format("DD-MM-YYYY"))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button variant="contained" color="primary" onClick={fetchBids} fullWidth>Fetch Bids</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bids Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ ml: 2, color: "text.secondary" }}>Fetching bids...</Typography>
        </Box>
      ) : bids.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="subtitle1" color="text.secondary">No bids found for the selected filters.</Typography>
        </Box>
      ) : (
        <Paper elevation={4} sx={{ mb: 4, borderRadius: "12px", overflow: "hidden" }}>
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>Bids Found:</Typography>
            <Chip label={`${bids.length} bids (${selectedBids.length} selected)`} color="primary" size="small" sx={{ fontWeight: "bold" }} />
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmOpen(true)}
              disabled={!selectedBids.length || reverting}
              startIcon={reverting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Revert Selected Bids ({selectedBids.length})
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox indeterminate={indeterminate} checked={allSelected} onChange={handleSelectAll} />
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
                  <TableRow key={bid.bidId} hover sx={{ "&.Mui-selected": { bgcolor: grey[200] } }} selected={selectedBids.includes(bid.bidId)}>
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
                        <Chip label="Reverted" sx={{ bgcolor: red[100], color: red[700], fontWeight: "bold" }} size="small" />
                      ) : (
                        <Chip label="Active" sx={{ bgcolor: green[100], color: green[700], fontWeight: "bold" }} size="small" />
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
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} aria-labelledby="confirm-dialog-title">
        <DialogTitle id="confirm-dialog-title">Confirm Revert</DialogTitle>
        <DialogContent>
          <DialogContentText>
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

      {/* Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={message.includes("Failed") ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%", boxShadow: 3 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BidRevert;