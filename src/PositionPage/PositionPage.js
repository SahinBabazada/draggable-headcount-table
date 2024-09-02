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

const PositionPage = () => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchPositions();
  }, [page, rowsPerPage]);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Position?Page=${page + 1}&ShowMore.Take=${rowsPerPage}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setPositions(response.data[0].Positions);
      setTotalRows(response.data[0].TotalPositionCount);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const handleOpenDialog = (position = null) => {
    setCurrentPosition(position);
    setIsEditMode(!!position);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentPosition(null);
    setIsDialogOpen(false);
  };

  const handleSavePosition = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${config.apiHost}/api/Position`, currentPosition, {
          headers: {
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      } else {
        await axios.post(`${config.apiHost}/api/Position`, currentPosition, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      }
      fetchPositions();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      await axios.delete(`${config.apiHost}/api/Position`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any-value',
        },
        data: { Id: id },
      });
      fetchPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  const handleChange = (e) => {
    setCurrentPosition({ ...currentPosition, [e.target.name]: e.target.value });
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
          Positions
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Position
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
              {positions.map((position) => (
                <TableRow key={position.Id}>
                  <TableCell>{position.Id}</TableCell>
                  <TableCell>{position.Name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(position)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePosition(position.Id)}>
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
        <DialogTitle>{isEditMode ? 'Edit Position' : 'Add New Position'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? 'Edit the details of the position.' : 'Enter the details of the new position.'}
          </DialogContentText>
          <TextField
            margin="dense"
            name="Name"
            label="Name"
            type="text"
            fullWidth
            value={currentPosition ? currentPosition.Name : ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePosition} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PositionPage;
