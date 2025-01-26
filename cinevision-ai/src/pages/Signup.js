import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  TextField,
  Button,
  Typography, 
  Paper,
  IconButton,
  InputAdornment,
  Fade,
  Alert,
  styled,
  CircularProgress
} from '@mui/material';
import { 
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import VideoBackground from '../components/VideoBackground';
import '../styles/HoverEffects.css';

const StyledPaper = styled(Paper)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const StyledTextField = styled(TextField)`
  margin: 12px 0;
  
  .MuiOutlinedInput-root {
    color: white;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }

    fieldset {
      border-color: rgba(255, 255, 255, 0.2);
    }

    &.Mui-focused fieldset {
      border-color: #2196F3;
    }
  }
  
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    
    &.Mui-focused {
      color: #2196F3;
    }
  }

  .MuiInputAdornment-root {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
  border-radius: 25px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(33, 203, 243, .3);
  text-transform: none;
  font-size: 16px;
  margin-top: 24px;
  width: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    background: linear-gradient(45deg, #1976D2 30%, #00BCD4 90%);
  }
`;

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        color: 'white',
        margin: 0,
        position: 'relative',
        paddingTop: '120px'
      }}
    >
      <VideoBackground />
      <Container maxWidth="xs" sx={{ pt: 8 }}>
        <Fade in timeout={1000}>
          <StyledPaper elevation={6}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join CineVision AI to bring your scripts to life
              </Typography>
            </Box>

            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <StyledButton
                type="submit"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </StyledButton>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#2196F3', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
}

export default Signup;
