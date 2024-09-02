import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import config from '../config.json';

const FormatPage = () => {
  const [formats, setFormats] = useState([]);
  const [currentFormat, setCurrentFormat] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchFormats();
  }, [page, rowsPerPage]);

  const fetchFormats = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Format?Page=${page + 1}&ShowMore.Take=${rowsPerPage}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setFormats(response.data[0]['Formats']);
      setTotalRows(response.data[0].TotalFormatCount);
    } catch (error) {
      console.error('Error fetching formats:', error);
    }
  };

  const handleOpenDialog = (format = null) => {
    setCurrentFormat(format);
    setIsEditMode(!!format);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentFormat(null);
    setIsDialogOpen(false);
  };

  const handleSaveFormat = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${config.apiHost}/api/Format`, currentFormat, {
          headers: {
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      } else {
        await axios.post(`${config.apiHost}/api/Format`, currentFormat, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      }
      fetchFormats();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving format:', error);
    }
  };

  const handleDeleteFormat = async (id) => {
    try {
      await axios.delete(`${config.apiHost}/api/Format`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any-value',
        },
        data: { Id: id },
      });
      fetchFormats();
    } catch (error) {
      console.error('Error deleting format:', error);
    }
  };

  const handleChange = (e) => {
    setCurrentFormat({ ...currentFormat, [e.target.name]: e.target.value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5">
          Formats
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Format
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formats.map((format) => (
                <TableRow key={format.Id}>
                  <TableCell>{format.Id}</TableCell>
                  <TableCell>{format.Name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(format)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteFormat(format.Id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? 'Edit Format' : 'Add New Format'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? 'Edit the details of the format.' : 'Enter the details of the new format.'}
          </DialogContentText>
          <TextField
            margin="dense"
            name="Name"
            label="Name"
            type="text"
            fullWidth
            value={currentFormat ? currentFormat.Name : ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveFormat} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormatPage;
