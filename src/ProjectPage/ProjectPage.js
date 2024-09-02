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
  FormControl,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import config from '../config.json';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchProjects();
    fetchFunctionalAreas();
  }, [page, rowsPerPage]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Project?Page=${page + 1}&ShowMore.Take=${rowsPerPage}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setProjects(response.data[0].Projects);
      setTotalRows(response.data[0].TotalProjectCount);
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
      setFunctionalAreas(response.data[0].FunctionalAreas);
    } catch (error) {
      console.error('Error fetching functional areas:', error);
    }
  };

  const handleOpenDialog = (project = null) => {
    setCurrentProject(project || {
      ProjectCode: '',
      ProjectName: '',
      IsStore: false,
      IsHeadOffice: false,
      FunctionalAreaId: ''
    });
    setIsEditMode(!!project);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentProject(null);
    setIsDialogOpen(false);
  };

  const handleSaveProject = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${config.apiHost}/api/Project`, currentProject, {
          headers: {
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      } else {
        await axios.post(`${config.apiHost}/api/Project`, currentProject, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      }
      fetchProjects();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`${config.apiHost}/api/Project`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any-value',
        },
        data: { Id: id },
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrentProject({
      ...currentProject,
      [name]: type === 'checkbox' ? checked : value
    });
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
          Projects
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Project
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Project Code</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Is Store</TableCell>
                <TableCell>Is Head Office</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.Id}>
                  <TableCell>{project.Id}</TableCell>
                  <TableCell>{project.ProjectCode}</TableCell>
                  <TableCell>{project.ProjectName}</TableCell>
                  <TableCell>{project.IsStore ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{project.IsHeadOffice ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(project)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProject(project.Id)}>
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
        <DialogTitle>{isEditMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? 'Edit the details of the project.' : 'Enter the details of the new project.'}
          </DialogContentText>
          <TextField
            margin="dense"
            name="ProjectCode"
            label="Project Code"
            type="text"
            fullWidth
            value={currentProject ? currentProject.ProjectCode : ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="ProjectName"
            label="Project Name"
            type="text"
            fullWidth
            value={currentProject ? currentProject.ProjectName : ''}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="IsStore"
                checked={currentProject ? currentProject.IsStore : false}
                onChange={handleChange}
              />
            }
            label="Is Store"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="IsHeadOffice"
                checked={currentProject ? currentProject.IsHeadOffice : false}
                onChange={handleChange}
              />
            }
            label="Is Head Office"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="functional-area-label">Functional Area</InputLabel>
            <Select
              labelId="functional-area-label"
              name="FunctionalAreaId"
              value={currentProject ? currentProject.FunctionalAreaId : ''}
              onChange={handleChange}
            >
              {functionalAreas.map((area) => (
                <MenuItem key={area.Id} value={area.Id}>
                  {area.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveProject} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectPage;
