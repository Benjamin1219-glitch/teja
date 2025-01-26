import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo" onClick={() => navigate('/')}>
        CineVision AI
      </div>
      
      {/* Background gradients */}
      <div className="background-gradient gradient-1" />
      <div className="background-gradient gradient-2" />
      <div className="background-gradient gradient-3" />

      <Box className="auth-card">
        <Typography variant="h4" className="auth-title">
          Cinevision AI
        </Typography>
        <Typography variant="h6" className="auth-subtitle">
          Login
        </Typography>
        {error && (
          <Typography
            sx={{
              color: '#ff4444',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '16px'
            }}
          >
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <Typography
            className="forgot-password"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </Typography>
          <Button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>
        <div className="auth-footer">
          <Typography component="span">
            Don't have an account?
            <span className="auth-link" onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default LoginPage;
