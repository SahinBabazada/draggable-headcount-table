import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  TableContainer,
} from '@mui/material';
import './DraggableTable.css';
import config from '../config.json';

const HeadcountPage = () => {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [sections, setSections] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [managerSearchTerm, setManagerSearchTerm] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchProjects();
    fetchFunctionalAreas();
    fetchSections();
    fetchSubSections();
    fetchPositions();
  }, []);

  useEffect(() => {
    if (employeeSearchTerm) {
      fetchEmployees(employeeSearchTerm);
    }
  }, [employeeSearchTerm]);

  useEffect(() => {
    if (managerSearchTerm) {
      fetchEmployees(managerSearchTerm);
    }
  }, [managerSearchTerm]);

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
      setFunctionalAreas(response.data[0].FunctionalAreas);
    } catch (error) {
      console.error('Error fetching functional areas:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Section?Page=1&ShowMore.Take=100`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setSections(response.data[0].Sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchSubSections = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/SubSection?Page=1&ShowMore.Take=100`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setSubSections(response.data[0].SubSections);
    } catch (error) {
      console.error('Error fetching sub-sections:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Position?Page=1&ShowMore.Take=100`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setPositions(response.data[0].Positions);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const fetchEmployees = async (searchTerm) => {
    try {
      const response = await axios.get(`${config.apiHost}/api/Employee?Page=1&ShowMore.Take=10&FullName=${searchTerm}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
      setEmployees(response.data[0].Employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchHeadcounts = async (projectId) => {
    try {
      const response = await axios.get(`${config.apiHost}/api/HeadCount?Page=1&ShowMore.Take=20&ProjectId=${projectId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });
  
      const headcounts = response.data[0].HeadCounts;
  
      // Create a mapping from headcount Id to EmployeeId for lookup
      const headcountIdToEmployeeIdMap = {};
      headcounts.forEach(headcount => {
        headcountIdToEmployeeIdMap[headcount.Id] = headcount.EmployeeId;
      });
  
      // Update headcounts to include the correct Manager EmployeeId
      const updatedHeadcounts = headcounts.map(headcount => {
        const managerEmployeeId = headcountIdToEmployeeIdMap[headcount.ParentId] || null;
        return {
          ...headcount,
          ParentId: managerEmployeeId, // Add this field for easier access in the UI
        };
      });
  
      setData(updatedHeadcounts);
    } catch (error) {
      console.error('Error fetching headcounts:', error);
    }
  };

  const getFullNameById = async (id) => {

    if (id != null){
      const response = await axios.get(`${config.apiHost}/api/Employee/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
        },
      });

      return response.data.FullName; // Return the full name directly instead of ID
    }else{
      return '';
    }
  };

  const getNameById = (id, list) => {
    const item = list.find((x) => x.Id === id);
    return item ? item.Name : '';
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    fetchHeadcounts(project.Id);
  };

  const handleOpenDialog = (item = null) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentItem(null);
    setIsDialogOpen(false);
  };

  const handleFieldChange = (field, value) => {
    setCurrentItem({ ...currentItem, [field]: value });
  };

  const handleDeleteHeadcount = async (id) => {
    try {
      await axios.delete(`${config.apiHost}/api/HeadCount`, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any-value',
        },
        data: { Id: id },
      });
      fetchHeadcounts(selectedProject.Id);
    } catch (error) {
      console.error('Error deleting headcount:', error);
    }
  };

  const onVacancyToggle = async (id, isVacant) => {
    const updatedItem = data.find(item => item.Id === id);
    if (updatedItem) {
      updatedItem.IsVacant = isVacant;
      setData([...data]); // Update state to re-render
    }
  };

  const handleSaveHeadcount = async () => {
    try {
      const payload = {
        Id: currentItem.Id || 0,
        ProjectId: selectedProject.Id,
        FunctionalAreaId: currentItem.FunctionalAreaId || null,
        SectionId: currentItem.SectionId || null,
        SubSectionId: currentItem.SubSectionId || null,
        PositionId: currentItem.PositionId || null,
        EmployeeId: currentItem.EmployeeId || null,
        HCNumber: currentItem.HCNumber || null,
        ParentId: currentItem.ParentId || null,
        IsVacant: currentItem.IsVacant,
        RecruiterComment: currentItem.RecruiterComment || null,
      };

      if (currentItem.Id) {
        await axios.put(`${config.apiHost}/api/HeadCount`, payload, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      } else {
        await axios.post(`${config.apiHost}/api/HeadCount`, payload, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any-value',
          },
        });
      }
      fetchHeadcounts(selectedProject.Id);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving headcount:', error);
    }
  };

  const handleSaveAllHeadcounts = async () => {
    try {
      // console.log(data);
      await Promise.all(
        data.map(async (item) => {
          const payload = {
            Id: item.Id,
            ProjectId: item.ProjectId,
            FunctionalAreaId: item.FunctionalAreaId || null,
            SectionId: item.SectionId || null,
            SubSectionId: item.SubSectionId || null,
            PositionId: item.PositionId || null,
            EmployeeId: item.EmployeeId || null,
            HCNumber: item.HCNumber,
            ParentId: item.ParentId || null,
            IsVacant: item.IsVacant,
            RecruiterComment: item.RecruiterComment || null,
          };
          const resp = await axios.put(`${config.apiHost}/api/HeadCount`, payload, {
            headers: {
              'accept': '*/*',
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'any-value',
            },
          });

        })
      );
      fetchHeadcounts(selectedProject.Id);
    } catch (error) {
      console.error('Error saving headcounts:', error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.Id === parseInt(active.id));
      const newIndex = data.findIndex((item) => item.Id === parseInt(over.id));
  
      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedData = arrayMove(data, oldIndex, newIndex);
  
        // Ensure that each item's HCNumber is correctly updated according to its new position
        updatedData.forEach((item, index) => {
          item.HCNumber = index + 1;
        });
  
        // Temporarily update the UI to reflect the changes
        setData(updatedData);
  
        // Log the updatedData to check if HCNumbers are correctly assigned
        console.log("Updated data after drag:", updatedData);
  
        try {
          // Save all updated items after drag end
          await handleSaveAllHeadcounts();
        } catch (error) {
          console.error('Error saving headcounts after drag:', error);
          // Optionally, revert the UI to the previous state if saving fails
          fetchHeadcounts(selectedProject.Id);
        }
      }
    }
  };

  const getProjectNameById = (id) => {
    const project = projects.find((x) => x.Id === id);
    return project ? project.ProjectName : '';
  };

  const renderTable = (items) => (
    <SortableContext items={items.map((item) => item.Id.toString())} strategy={verticalListSortingStrategy}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Functional Area</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Sub Section</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Employee</TableCell> {/* Updated */}
              <TableCell>Manager</TableCell> {/* Updated */}
              <TableCell>Is Vacant</TableCell>
              <TableCell>HC Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <SortableItem
                key={item.Id}
                id={item.Id.toString()}
                item={item}
                onEdit={() => handleOpenDialog(item)}
                onDelete={() => handleDeleteHeadcount(item.Id)}
                getFullNameById={getFullNameById} // Updated to use getFullNameById
                getNameById = {getNameById}
                functionalAreas={functionalAreas}
                sections={sections}
                subSections={subSections}
                positions={positions}
                employees={employees}
                onVacancyToggle={onVacancyToggle} // Pass the function here
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleSaveAllHeadcounts} variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Save All Changes
      </Button>
    </SortableContext>
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ padding: '20px' }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Project</InputLabel>
          <Select
            value={selectedProject ? selectedProject.Id : ''}
            onChange={(e) => handleProjectClick(projects.find((project) => project.Id === e.target.value))}
          >
            {projects.map((project) => (
              <MenuItem key={project.Id} value={project.Id}>
                {project.ProjectName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedProject ? (
          <Paper style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Headcounts for Project: {getProjectNameById(selectedProject.Id)}
            </Typography>
            {renderTable(data)}
          </Paper>
        ) : (
          <Typography>Select a project from the dropdown above</Typography>
        )}
      </div>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentItem?.Id ? 'Edit Headcount' : 'Add New Headcount'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentItem?.Id ? 'Edit the details of the headcount.' : 'Enter the details of the new headcount.'}
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Functional Area</InputLabel>
            <Select value={currentItem?.FunctionalAreaId || ''} onChange={(e) => handleFieldChange('FunctionalAreaId', e.target.value)}>
              {functionalAreas.map((area) => (
                <MenuItem key={area.Id} value={area.Id}>
                  {area.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Section</InputLabel>
            <Select value={currentItem?.SectionId || ''} onChange={(e) => handleFieldChange('SectionId', e.target.value)}>
              {sections.map((section) => (
                <MenuItem key={section.Id} value={section.Id}>
                  {section.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sub Section</InputLabel>
            <Select value={currentItem?.SubSectionId || ''} onChange={(e) => handleFieldChange('SubSectionId', e.target.value)}>
              {subSections.map((subSection) => (
                <MenuItem key={subSection.Id} value={subSection.Id}>
                  {subSection.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Position</InputLabel>
            <Select value={currentItem?.PositionId || ''} onChange={(e) => handleFieldChange('PositionId', e.target.value)}>
              {positions.map((position) => (
                <MenuItem key={position.Id} value={position.Id}>
                  {position.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            fullWidth
            options={employees}
            getOptionLabel={(option) => option.FullName || ''}
            onInputChange={(event, newInputValue) => setEmployeeSearchTerm(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employee"
                margin="normal"
                fullWidth
              />
            )}
            onChange={(event, newValue) => handleFieldChange('EmployeeId', newValue ? newValue.Id : '')}
          />
          <Autocomplete
            fullWidth
            options={employees}
            getOptionLabel={(option) => option.FullName || ''}
            onInputChange={(event, newInputValue) => setManagerSearchTerm(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Manager"
                margin="normal"
                fullWidth
              />
            )}
            onChange={(event, newValue) => handleFieldChange('ParentId', newValue ? newValue.Id : '')}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Is Vacant</InputLabel>
            <Select value={currentItem?.IsVacant || false} onChange={(e) => handleFieldChange('IsVacant', e.target.value)}>
              <MenuItem value={true}>TRUE</MenuItem>
              <MenuItem value={false}>FALSE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            name="HCNumber"
            label="HC Number"
            type="number"
            fullWidth
            value={currentItem?.HCNumber || ''}
            onChange={(e) => handleFieldChange('HCNumber', e.target.value)}
          />
          <TextField
            margin="normal"
            name="RecruiterComment"
            label="Recruiter Comment"
            type="text"
            fullWidth
            value={currentItem?.RecruiterComment || ''}
            onChange={(e) => handleFieldChange('RecruiterComment', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveHeadcount} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DndContext>
  );
};

const SortableItem = ({ id, item, onEdit, onDelete, onVacancyToggle, getFullNameById, getNameById, functionalAreas, sections, subSections, positions }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [employeeName, setEmployeeName] = useState('');
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    async function fetchNames() {
      const empName = await getFullNameById(item.EmployeeId);
      const mgrName = await getFullNameById(item.ParentId);
      setEmployeeName(empName);
      setManagerName(mgrName);
    }
    fetchNames();
  }, [item.EmployeeId, item.ParentId]);

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TableCell>{getNameById(item.FunctionalAreaId, functionalAreas)}</TableCell>
      <TableCell>{getNameById(item.SectionId, sections)}</TableCell>
      <TableCell>{getNameById(item.SubSectionId, subSections)}</TableCell>
      <TableCell>{getNameById(item.PositionId, positions)}</TableCell>
      <TableCell>{employeeName}</TableCell> {/* Display Employee Full Name */}
      <TableCell>{managerName}</TableCell> {/* Display Manager Full Name */}
      <TableCell>
        <Switch
          checked={item.IsVacant}
          onChange={() => onVacancyToggle(item.Id, !item.IsVacant)}
          color="primary"
        />
      </TableCell>
      <TableCell>{item.HCNumber}</TableCell>
      <TableCell>
        <Button onClick={onEdit} variant="outlined" color="primary" size="small" style={{ marginRight: '10px' }}>
          Edit
        </Button>
        <Button onClick={onDelete} variant="outlined" color="secondary" size="small">
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default HeadcountPage;
