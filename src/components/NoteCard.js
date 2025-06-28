import React from 'react';
import { Trash2, Calendar, Edit } from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Stack,
  Paper
} from '@mui/material';

const NoteCard = ({ note, onDelete, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isWithdrawal = note.type === 'withdrawal';
  const color = isWithdrawal ? 'error' : 'success';

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: 4,
        borderColor: `${color}.main`,
        bgcolor: 'grey.50',
        '&:hover': { bgcolor: 'grey.100' },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" color={`${color}.main`}>
            {isWithdrawal ? 'Withdrawal' : 'Fund'} Note
          </Typography>

          <Box>
            <IconButton
              onClick={() => onEdit(note)}
              size="small"
              sx={{ color: 'primary.main' }}
            >
              <Edit size={18} />
            </IconButton>
            <IconButton
              onClick={() => onDelete(note.id)}
              size="small"
              sx={{ color: 'error.main' }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        </Box>

        {/* <Stack direction="row" alignItems="center" spacing={1} mb={2} color="text.secondary">
          <Calendar size={16} />
          <Typography variant="body2">{formatDate(note.date)}</Typography>
        </Stack> */}

        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'white' }}>
          <Typography variant="body2" color="text.primary">
            {note.message}
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
