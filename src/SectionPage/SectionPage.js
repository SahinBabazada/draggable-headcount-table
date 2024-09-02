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

const SectionPage = () => {
  const [sections, setSections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchSections();
    fetchProjects();
  }, [page, rowsPerPage]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Section?Page=${page + 1}&ShowMore.Take=${rowsPerPage}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setSections(response.data[0].Sections);
      setTotalRows(response.data[0].TotalSectionCount);
    } catch (error) {
      console.error('Error fetching sections:', error);
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

  const handleOpenDialog = (section = null) => {
    setCurrentSection(section || {
      Name: '',
      ProjectId: '',
    });
    setIsEditMode(!!section);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentSection(null);
    setIsDialogOpen(false);
  };

  const handleSaveSection = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${config.apiHost}/api/Section`, currentSection, {
          headers: {
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      } else {
        await axios.post(`${config.apiHost}/api/Section`, currentSection, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      }
      fetchSections();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      await axios.delete(`${config.apiHost}/api/Section`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any-value',
        },
        data: { Id: id },
      });
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSection({ ...currentSection, [name]: value });
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
          Sections
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Section
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Project ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.Id}>
                  <TableCell>{section.Id}</TableCell>
                  <TableCell>{section.Name}</TableCell>
                  <TableCell>{section.ProjectId}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(section)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSection(section.Id)}>
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
        <DialogTitle>{isEditMode ? 'Edit Section' : 'Add New Section'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? 'Edit the details of the section.' : 'Enter the details of the new section.'}
          </DialogContentText>
          <TextField
            margin="dense"
            name="Name"
            label="Name"
            type="text"
            fullWidth
            value={currentSection ? currentSection.Name : ''}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="project-id-label">Project</InputLabel>
            <Select
              labelId="project-id-label"
              name="ProjectId"
              value={currentSection ? currentSection.ProjectId : ''}
              onChange={handleChange}
            >
              {projects.map((project) => (
                <MenuItem key={project.Id} value={project.Id}>
                  {project.ProjectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveSection} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SectionPage;
