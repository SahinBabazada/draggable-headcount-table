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

const FunctionalAreaPage = () => {
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [currentFunctionalArea, setCurrentFunctionalArea] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchFunctionalAreas();
  }, [page, rowsPerPage]);

  const fetchFunctionalAreas = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/FunctionalArea?Page=${page + 1}&ShowMore.Take=${rowsPerPage}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setFunctionalAreas(response.data[0]['FunctionalAreas']);
      setTotalRows(response.data[0]['TotalCount']); // Assuming the API returns a TotalCount field
    } catch (error) {
      console.error('Error fetching functional areas:', error);
    }
  };

  const handleOpenDialog = (functionalArea = null) => {
    setCurrentFunctionalArea(functionalArea);
    setIsEditMode(!!functionalArea);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentFunctionalArea(null);
    setIsDialogOpen(false);
  };

  const handleSaveFunctionalArea = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${config.apiHost}/api/FunctionalArea`, currentFunctionalArea, {
          headers: {
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      } else {
        await axios.post(`${config.apiHost}/api/FunctionalArea`, currentFunctionalArea, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      }
      fetchFunctionalAreas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving functional area:', error);
    }
  };

  const handleDeleteFunctionalArea = async (id) => {
    try {
      await axios.delete(`${config.apiHost}/api/FunctionalArea`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any-value',
        },
        data: { Id: id },
      });
      fetchFunctionalAreas();
    } catch (error) {
      console.error('Error deleting functional area:', error);
    }
  };

  const handleChange = (e) => {
    setCurrentFunctionalArea({ ...currentFunctionalArea, [e.target.name]: e.target.value });
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
          Functional Areas
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Functional Area
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
              {functionalAreas.map((area) => (
                <TableRow key={area.Id}>
                  <TableCell>{area.Id}</TableCell>
                  <TableCell>{area.Name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(area)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteFunctionalArea(area.Id)}>
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
        <DialogTitle>{isEditMode ? 'Edit Functional Area' : 'Add New Functional Area'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode
              ? 'Edit the details of the functional area.'
              : 'Enter the details of the new functional area.'}
          </DialogContentText>
          <TextField
            margin="dense"
            name="Name"
            label="Name"
            type="text"
            fullWidth
            value={currentFunctionalArea ? currentFunctionalArea.Name : ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveFunctionalArea} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FunctionalAreaPage;
