import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
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
          Create Account
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
        <form onSubmit={handleSignup}>
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
          <Button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
        </form>
        <div className="auth-footer">
          <Typography component="span">
            Already have an account?
            <span className="auth-link" onClick={() => navigate('/login')}>
              Sign in
            </span>
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default SignupPage;
