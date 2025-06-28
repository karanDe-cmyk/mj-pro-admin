
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import {
  Box, Button, Card, CardContent, CardHeader,
  Typography, Grid
} from '@mui/material';
import AddNoteDialog from '../components/AddNoteDialog';
import NoteCard from '../components/NoteCard';

const Index = () => {
  const [withdrawalNotes, setWithdrawalNotes] = useState([]);
  const [fundNotes, setFundNotes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('withdrawal');
  const [editingNote, setEditingNote] = useState(null);

  //const baseURL = 'http://localhost:5001';
const baseURL = 'https://maya-api.kglame.com';
  const fetchWithdrawalNotes = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/withdwawnotice/getWithdrawNotice`);
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      const formatted = data.map(n => ({ ...n, type: 'withdrawal' }));
      setWithdrawalNotes(formatted);
    } catch (err) {
      console.error('Error fetching withdrawal notes:', err);
    }
  };

  const fetchFundNotes = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/notice/getNotice`);
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      const formatted = data.map(n => ({ ...n, type: 'fund' }));
      setFundNotes(formatted);
    } catch (err) {
      console.error('Error fetching fund notes:', err);
    }
  };

  useEffect(() => {
    fetchWithdrawalNotes();
    fetchFundNotes();
  }, []);

  const handleAddNote = async (noteData) => {
    const isWithdrawal = selectedType === 'withdrawal';
    const apiBase = isWithdrawal
      ? `${baseURL}/api/withdwawnotice`
      : `${baseURL}/api/notice`;
    const setter = isWithdrawal ? setWithdrawalNotes : setFundNotes;

    try {
      if (editingNote) {
        const res = await axios.put(`${apiBase}/note/${editingNote._id}`, noteData);
        setter(prev =>
          prev.map(n => (n._id === editingNote._id ? { ...res.data.data, type: selectedType } : n))
        );
      } else {
        const res = await axios.post(`${apiBase}/AddNotice`, noteData);
        setter(prev => [{ ...res.data.data, type: selectedType }, ...prev]);
      }
      setIsDialogOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleDeleteNote = async (id, type) => {
    const isWithdrawal = type === 'withdrawal';
    const apiBase = isWithdrawal
      ? `${baseURL}/api/withdwawnotice/notes`
      : `${baseURL}/api/notice/note`;
    const setter = isWithdrawal ? setWithdrawalNotes : setFundNotes;

    try {
      await axios.delete(`${apiBase}/${id}`);
      setter(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setSelectedType(note.type);
    setIsDialogOpen(true);
  };

  const openDialog = (type) => {
    setSelectedType(type);
    setEditingNote(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
          Financial Notes
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Withdrawals"
                subheader={`Total Notes: ${withdrawalNotes.length}`}
                action={
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Plus />}
                    onClick={() => openDialog('withdrawal')}
                  >
                    Add Note
                  </Button>
                }
              />
              <CardContent>
                {withdrawalNotes.length === 0 ? (
                  <Typography align="center" color="textSecondary">No withdrawal notes yet</Typography>
                ) : (
                  <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {withdrawalNotes.map(note => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={() => handleDeleteNote(note._id, 'withdrawal')}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Funds"
                subheader={`Total Notes: ${fundNotes.length}`}
                action={
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Plus />}
                    onClick={() => openDialog('fund')}
                  >
                    Add Note
                  </Button>
                }
              />
              <CardContent>
                {fundNotes.length === 0 ? (
                  <Typography align="center" color="textSecondary">No fund notes yet</Typography>
                ) : (
                  <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {fundNotes.map(note => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={() => handleDeleteNote(note._id, 'fund')}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 6, bgcolor: 'primary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" align="center">Notes Summary</Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: 'white', color: 'black', p: 2, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1">Withdrawals</Typography>
                  <Typography variant="h5">{withdrawalNotes.length}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: 'white', color: 'black', p: 2, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1">Funds</Typography>
                  <Typography variant="h5">{fundNotes.length}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <AddNoteDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleAddNote}
        type={selectedType}
        editingNote={editingNote}
      />
    </Box>
  );
};

export default Index;