import React, { useState } from 'react';
import { Container, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const BusinessItemScreen = () => {
  const [businessItems, setBusinessItems] = useState([]);
  const [newItem, setNewItem] = useState({
    businessName: '',
    format: '',
    functionalArea: '',
    project: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    if (editIndex !== null) {
      const updatedItems = businessItems.map((item, index) =>
        index === editIndex ? newItem : item
      );
      setBusinessItems(updatedItems);
      setEditIndex(null);
    } else {
      setBusinessItems([...businessItems, newItem]);
    }
    setNewItem({ businessName: '', format: '', functionalArea: '', project: '' });
  };

  const handleEditItem = (index) => {
    setNewItem(businessItems[index]);
    setEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = businessItems.filter((_, i) => i !== index);
    setBusinessItems(updatedItems);
  };

  return (
    <Container>
      <h2>Business Item CRUD</h2>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <TextField
          label="Business Name"
          name="businessName"
          value={newItem.businessName}
          onChange={handleInputChange}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Format"
          name="format"
          value={newItem.format}
          onChange={handleInputChange}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Functional Area"
          name="functionalArea"
          value={newItem.functionalArea}
          onChange={handleInputChange}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Project"
          name="project"
          value={newItem.project}
          onChange={handleInputChange}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          {editIndex !== null ? 'Update' : 'Add'}
        </Button>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Format</TableCell>
            <TableCell>Functional Area</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {businessItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.businessName}</TableCell>
              <TableCell>{item.format}</TableCell>
              <TableCell>{item.functionalArea}</TableCell>
              <TableCell>{item.project}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditItem(index)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem(index)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default BusinessItemScreen;
