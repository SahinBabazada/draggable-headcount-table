import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import config from '../config.json';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      Email: email,
      Password: password,
    };

    try {
      const response = await axios.post(`${config.apiHost}/api/AdminApplicationUser/Login`, loginData);
      const result = response.data;
      setMessage(result.Message);

      if (result.IsSuccess) {
        // Handle successful login (e.g., redirect to dashboard)
        console.log('Login successful:', result);
      } else {
        // Handle unsuccessful login
        console.log('Login failed:', result);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
          >
            Sign In
          </Button>
          {message && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {message}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
