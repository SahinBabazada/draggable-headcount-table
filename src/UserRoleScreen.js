import React, { useState } from 'react';
import { Container, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const UserRoleScreen = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [newRole, setNewRole] = useState({
    role: '',
    department: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  const handleAddRole = () => {
    if (editIndex !== null) {
      const updatedRoles = userRoles.map((role, index) =>
        index === editIndex ? newRole : role
      );
      setUserRoles(updatedRoles);
      setEditIndex(null);
    } else {
      setUserRoles([...userRoles, newRole]);
    }
    setNewRole({ role: '', department: '' });
  };

  const handleEditRole = (index) => {
    setNewRole(userRoles[index]);
    setEditIndex(index);
  };

  const handleDeleteRole = (index) => {
    const updatedRoles = userRoles.filter((_, i) => i !== index);
    setUserRoles(updatedRoles);
  };

  return (
    <Container>
      <h2>User Role CRUD</h2>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <TextField
          label="Role"
          name="role"
          value={newRole.role}
          onChange={handleInputChange}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Department"
          name="department"
          value={newRole.department}
          onChange={handleInputChange}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddRole}>
          {editIndex !== null ? 'Update' : 'Add'}
        </Button>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userRoles.map((role, index) => (
            <TableRow key={index}>
              <TableCell>{role.role}</TableCell>
              <TableCell>{role.department}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditRole(index)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteRole(index)}>
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

export default UserRoleScreen;
