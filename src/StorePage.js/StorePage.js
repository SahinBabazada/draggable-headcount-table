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
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import config from '../config.json';

const StorePage = () => {
  const [stores, setStores] = useState([]);
  const [projects, setProjects] = useState([]);
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [formats, setFormats] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchStores();
    fetchProjects();
    fetchFunctionalAreas();
    fetchFormats();
  }, [page, rowsPerPage]);

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Store?Page=${page + 1}&ShowMore.Take=${rowsPerPage}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setStores(response.data[0].Stores);
      setTotalRows(response.data[0].TotalStoreCount);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Project?Page=1&ShowMore.Take=100`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setProjects(response.data[0].Projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchFunctionalAreas = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/FunctionalArea?Page=1&ShowMore.Take=100`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setFunctionalAreas(response.data[0]['FunctionalAreas']);
    } catch (error) {
      console.error('Error fetching functional areas:', error);
    }
  };

  const fetchFormats = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Format?Page=1&ShowMore.Take=100`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setFormats(response.data[0]['Formats']);
    } catch (error) {
      console.error('Error fetching formats:', error);
    }
  };

  const handleOpenDialog = (store = null) => {
    setCurrentStore(store || {
      ProjectId: '',
      FunctionalAreaId: '',
      FormatId: '',
      HeadCountNumber: '',
    });
    setIsEditMode(!!store);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentStore(null);
    setIsDialogOpen(false);
  };

  const handleSaveStore = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${config.apiHost}/api/Store`, currentStore, {
          headers: {
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      } else {
        await axios.post(`${config.apiHost}/api/Store`, currentStore, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      }
      fetchStores();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving store:', error);
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await axios.delete(`${config.apiHost}/api/Store`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any-value',
        },
        data: { Id: id },
      });
      fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentStore({ ...currentStore, [name]: value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getProjectName = (id) => {
    const project = projects.find((project) => project.Id === id);
    return project ? project.ProjectName : id;
  };

  const getFunctionalAreaName = (id) => {
    const area = functionalAreas.find((area) => area.Id === id);
    return area ? area.Name : id;
  };

  const getFormatName = (id) => {
    const format = formats.find((format) => format.Id === id);
    return format ? format.Name : id;
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5">
          Stores
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Store
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Functional Area</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Head Count Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.Id}>
                  <TableCell>{store.Id}</TableCell>
                  <TableCell>{getProjectName(store.ProjectId)}</TableCell>
                  <TableCell>{getFunctionalAreaName(store.FunctionalAreaId)}</TableCell>
                  <TableCell>{getFormatName(store.FormatId)}</TableCell>
                  <TableCell>{store.HeadCountNumber}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(store)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteStore(store.Id)}>
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
        <DialogTitle>{isEditMode ? 'Edit Store' : 'Add New Store'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? 'Edit the details of the store.' : 'Enter the details of the new store.'}
          </DialogContentText>
          <FormControl fullWidth margin="dense">
            <InputLabel id="project-id-label">Project</InputLabel>
            <Select
              labelId="project-id-label"
              name="ProjectId"
              value={currentStore ? currentStore.ProjectId : ''}
              onChange={handleChange}
            >
              {projects.map((project) => (
                <MenuItem key={project.Id} value={project.Id}>
                  {project.ProjectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="functional-area-id-label">Functional Area</InputLabel>
            <Select
              labelId="functional-area-id-label"
              name="FunctionalAreaId"
              value={currentStore ? currentStore.FunctionalAreaId : ''}
              onChange={handleChange}
            >
              {functionalAreas.map((area) => (
                <MenuItem key={area.Id} value={area.Id}>
                  {area.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="format-id-label">Format</InputLabel>
            <Select
              labelId="format-id-label"
              name="FormatId"
              value={currentStore ? currentStore.FormatId : ''}
              onChange={handleChange}
            >
              {formats.map((format) => (
                <MenuItem key={format.Id} value={format.Id}>
                  {format.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="HeadCountNumber"
            label="Head Count Number"
            type="number"
            fullWidth
            value={currentStore ? currentStore.HeadCountNumber : ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveStore} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StorePage;
