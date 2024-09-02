import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
        <Button color="inherit" component={Link} to="/formats">Formats</Button>
        <Button color="inherit" component={Link} to="/functional-areas">Functional Areas</Button>
        <Button color="inherit" component={Link} to="/positions">Positions</Button>
        <Button color="inherit" component={Link} to="/projects">Projects</Button>
        <Button color="inherit" component={Link} to="/sections">Sections</Button>
        <Button color="inherit" component={Link} to="/stores">Stores</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
