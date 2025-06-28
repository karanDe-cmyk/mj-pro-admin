import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@mui/material';

const AddNoteDialog = ({ isOpen, onClose, onSubmit, type, editingNote }) => {
  const [message, setMessage] = useState('');

  const title = editingNote
    ? `Edit ${type === 'withdrawal' ? 'Withdrawal' : 'Fund'} Note`
    : `Add ${type === 'withdrawal' ? 'Withdrawal' : 'Fund'} Note`;

  const color = type === 'withdrawal' ? 'error' : 'success';

  useEffect(() => {
    if (editingNote) {
      setMessage(editingNote.message);
    } else {
      setMessage('');
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmit({
      type,
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
    });

    setMessage('');
    onClose();
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" color={color}>
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={color}
          >
            {editingNote ? 'Update Note' : 'Add Note'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddNoteDialog;
