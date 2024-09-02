import React, { useState } from 'react';
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
import Modal from 'react-modal';
import {
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Box,
} from '@mui/material';
import './DraggableTable.css';

const initialData = [
  { id: '1', functionalArea: 'Store OP', project: '1001', section: 'Admin', subSection: '', position: 'Store Manager', badge: '', isVacant: 'FALSE', finCode: '', hcNumber: '1', managerId: '' },
  { id: '2', functionalArea: 'Store OP', project: '1001', section: 'Admin', subSection: '', position: 'Senior Cashier', badge: '', isVacant: 'FALSE', finCode: '', hcNumber: '2', managerId: '1' },
  { id: '3', functionalArea: 'Store OP', project: '1001', section: 'Admin', subSection: '', position: 'Senior Cashier', badge: '', isVacant: 'TRUE', finCode: '', hcNumber: '3', managerId: '1' },
  { id: '4', functionalArea: 'Store OP', project: '1001', section: 'Admin', subSection: '', position: 'Senior Cashier', badge: '', isVacant: 'FALSE', finCode: '', hcNumber: '4', managerId: '1' },
  { id: '5', functionalArea: 'Store OP', project: '1001', section: 'Admin', subSection: '', position: 'Senior Cashier', badge: '', isVacant: 'FALSE', finCode: '', hcNumber: '5', managerId: '1' },
  { id: '6', functionalArea: 'HO', project: 'HR', section: 'HR Compliance & Reward', subSection: 'HRIS', position: 'HRIS Manager', badge: 'AS1396', isVacant: 'FALSE', finCode: '', hcNumber: '1', managerId: '' },
  { id: '7', functionalArea: 'HO', project: 'HR', section: 'HR Compliance & Reward', subSection: 'HRIS', position: 'HRIS Specialist', badge: 'ASL1912', isVacant: 'FALSE', finCode: '', hcNumber: '2', managerId: '6' }
];

const userDatabase = [
  { id: 'AS1396', name: 'John Doe' },
  { id: 'ASL1912', name: 'Jane Smith' },
  { id: 'AS1234', name: 'Alice Johnson' },
  { id: 'AS5678', name: 'Bob Brown' },
];

const projectColors = {
  '1001': '#e3f2fd',
  'HR': '#fff3e0',
};

const allProjects = ['1001', 'HR'];

const DraggableTable = () => {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    functionalArea: '',
    project: '',
    section: '',
    subSection: '',
  });
  const [selectedProject, setSelectedProject] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const movedItem = items[oldIndex];
        const targetItem = over.id === 'project-placeholder' ? { project: selectedProject } : items[newIndex];

        movedItem.project = targetItem.project;
        movedItem.section = targetItem.section || '';
        movedItem.subSection = targetItem.subSection || '';

        let updatedItems;
        if (over.id === 'project-placeholder') {
          updatedItems = [
            ...items.slice(0, oldIndex),
            ...items.slice(oldIndex + 1),
            movedItem
          ];
        } else {
          updatedItems = arrayMove(items, oldIndex, newIndex);
        }

        const projectGroups = {};
        updatedItems.forEach(item => {
          if (!projectGroups[item.project]) {
            projectGroups[item.project] = [];
          }
          projectGroups[item.project].push(item);
        });

        Object.values(projectGroups).forEach(group => {
          group.forEach((item, index) => {
            item.hcNumber = (index + 1).toString();
          });
        });

        return updatedItems;
      });
    }
  };

  const handleBadgeClick = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleManagerClick = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleSelectBadge = (badge) => {
    setData((items) =>
      items.map((item) =>
        item.id === currentItem.id ? { ...item, badge: badge.id } : item
      )
    );
    setIsModalOpen(false);
    setCurrentItem(null);
    setSearchTerm('');
  };

  const handleSelectManager = (manager) => {
    setData((items) =>
      items.map((item) =>
        item.id === currentItem.id ? { ...item, managerId: manager.id } : item
      )
    );
    setIsEditModalOpen(false);
    setCurrentItem(null);
    setSearchTerm('');
  };

  const handleAddRow = () => {
    if (!selectedProject) return;
    const newRow = {
      id: (data.length + 1).toString(),
      functionalArea: '',
      project: selectedProject,
      section: '',
      subSection: '',
      position: '',
      badge: '',
      isVacant: 'FALSE',
      finCode: '',
      hcNumber: (data.filter(item => item.project === selectedProject).length + 1).toString(),
      managerId: ''
    };
    setData([...data, newRow]);
  };

  const handleDeleteRow = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    const updatedItems = updatedData.map((item, index) => ({
      ...item,
      hcNumber: (index + 1).toString()
    }));
    setData(updatedItems);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFieldChange = (id, field, value) => {
    setData((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const filteredData = data.filter(item => {
    return (
      (filters.functionalArea === '' || item.functionalArea.includes(filters.functionalArea)) &&
      (filters.project === '' || item.project.includes(filters.project)) &&
      (filters.section === '' || item.section.includes(filters.section)) &&
      (filters.subSection === '' || item.subSection.includes(filters.subSection))
    );
  });

  const renderTable = (items) => (
    <SortableContext items={[...items.map(item => item.id), 'project-placeholder']} strategy={verticalListSortingStrategy}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Functional Area</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Sub section</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Badge</TableCell>
            <TableCell>Is Vacant</TableCell>
            <TableCell>FIN Code</TableCell>
            <TableCell>HC Number</TableCell>
            <TableCell>Manager ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              item={item}
              onBadgeClick={() => handleBadgeClick(item)}
              onManagerClick={() => handleManagerClick(item)}
              onDelete={() => handleDeleteRow(item.id)}
              onFieldChange={handleFieldChange}
              onEdit={() => {
                setCurrentItem(item);
                setIsEditModalOpen(true);
              }}
            />
          ))}
          {items.length === 0 && (
            <SortableItem
              id="project-placeholder"
              item={{ project: selectedProject }}
              isPlaceholder={true}
            />
          )}
        </TableBody>
      </Table>
      <Button onClick={handleAddRow} variant="contained" color="primary" style={{ marginTop: '20px' }}>Add Row</Button>
    </SortableContext>
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Projects</Typography>
            <List>
              {allProjects.map(project => (
                <ListItem
                  key={project}
                  button
                  selected={selectedProject === project}
                  onClick={() => setSelectedProject(project)}
                  className="project-list-item"
                >
                  <Typography>{project}</Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>Filters</Typography>
            <FormControl style={{ marginRight: '10px', minWidth: '120px' }}>
              <InputLabel>Functional Area</InputLabel>
              <Select
                name="functionalArea"
                value={filters.functionalArea}
                onChange={handleFilterChange}
                label="Functional Area"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Store OP">Store OP</MenuItem>
                <MenuItem value="HO">HO</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="project"
              label="Project"
              value={filters.project}
              onChange={handleFilterChange}
              style={{ marginRight: '10px' }}
            />
            <TextField
              name="section"
              label="Section"
              value={filters.section}
              onChange={handleFilterChange}
              style={{ marginRight: '10px' }}
            />
            <TextField
              name="subSection"
              label="Sub Section"
              value={filters.subSection}
              onChange={handleFilterChange}
              style={{ marginRight: '10px' }}
            />
          </Paper>
          <Paper style={{ padding: '20px' }}>
            {selectedProject ? (
              <>
                <Typography variant="h6" gutterBottom>Project: {selectedProject}</Typography>
                {renderTable(data.filter(item => item.project === selectedProject))}
              </>
            ) : (
              <Typography>Select a project from the left panel</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
  
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Select Badge"
        className="Modal__Content"
        overlayClassName="Modal__Overlay"
      >
        <Typography variant="h6">Select Badge</Typography>
        <TextField
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        <List>
          {userDatabase
            .filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user) => (
              <ListItem button key={user.id} onClick={() => handleSelectBadge(user)}>
                <Typography>{user.name} ({user.id})</Typography>
              </ListItem>
            ))}
        </List>
        <Button onClick={() => setIsModalOpen(false)} variant="contained" color="primary">Close</Button>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Fields"
        className="Modal__Content"
        overlayClassName="Modal__Overlay"
      >
        <Typography variant="h6">Edit Fields</Typography>
        <TextField
          label="Functional Area"
          value={currentItem?.functionalArea || ''}
          onChange={(e) => handleFieldChange(currentItem.id, 'functionalArea', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Project"
          value={currentItem?.project || ''}
          onChange={(e) => handleFieldChange(currentItem.id, 'project', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Section"
          value={currentItem?.section || ''}
          onChange={(e) => handleFieldChange(currentItem.id, 'section', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Sub Section"
          value={currentItem?.subSection || ''}
          onChange={(e) => handleFieldChange(currentItem.id, 'subSection', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Position"
          value={currentItem?.position || ''}
          onChange={(e) => handleFieldChange(currentItem.id, 'position', e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Is Vacant</InputLabel>
          <Select
            value={currentItem?.isVacant || ''}
            onChange={(e) => handleFieldChange(currentItem.id, 'isVacant', e.target.value)}
          >
            <MenuItem value="TRUE">TRUE</MenuItem>
            <MenuItem value="FALSE">FALSE</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="FIN Code"
          value={currentItem?.finCode || ''}
          onChange={(e) => handleFieldChange(currentItem.id, 'finCode', e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button onClick={() => setIsEditModalOpen(false)} variant="contained" color="primary">Close</Button>
      </Modal>
    </DndContext>
  );
};

const SortableItem = ({ id, item, onBadgeClick, onManagerClick, onDelete, onEdit, isPlaceholder = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: item.isVacant === 'TRUE' ? '#fff9c4' : projectColors[item.project] || '#ffffff',
  };

  if (isPlaceholder) {
    return (
      <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <TableCell colSpan={12} align="center">
          <Typography>Drop here to add to {item.project}</Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TableCell>{item.functionalArea}</TableCell>
      <TableCell>{item.project}</TableCell>
      <TableCell>{item.section}</TableCell>
      <TableCell>{item.subSection}</TableCell>
      <TableCell>{item.position}</TableCell>
      <TableCell>{item.id}</TableCell>
      <TableCell onClick={onBadgeClick} className="badge-assign">
        {item.badge || 'Assign'}
      </TableCell>
      <TableCell>{item.isVacant}</TableCell>
      <TableCell>{item.finCode}</TableCell>
      <TableCell>{item.hcNumber}</TableCell>
      <TableCell onClick={onManagerClick} className="badge-assign">
        {item.managerId || 'Assign'}
      </TableCell>
      <TableCell>
        <Button onClick={onDelete} variant="outlined" color="secondary" size="small">Delete</Button>
        <Button onClick={onEdit} variant="outlined" color="primary" size="small" style={{ marginLeft: '10px' }}>Edit</Button>
      </TableCell>
    </TableRow>
  );
};

export default DraggableTable;
