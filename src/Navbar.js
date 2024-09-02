import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Workforce Management
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/business-items">Business Items</Button>
        <Button color="inherit" component={Link} to="/user-roles">User Roles</Button>
        <Button color="inherit" component={Link} to="/headcount-list">Headcount List</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
