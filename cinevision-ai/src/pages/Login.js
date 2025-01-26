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
  styled
} from '@mui/material';
import { 
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
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
        overflow: 'hidden',
        paddingTop: '120px',
        background: 'linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)',
      }}
    >
      <VideoBackground />
      <Container 
        maxWidth="sm" 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Fade in timeout={1000}>
          <StyledPaper className="hover-container">
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center'
              }}
            >
              Sign in to continue to CineVision AI
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  background: 'rgba(211, 47, 47, 0.1)',
                  color: '#ff5252',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                  '& .MuiAlert-icon': {
                    color: '#ff5252'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <StyledTextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
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
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <StyledButton
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </StyledButton>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="hover-link"
                    style={{ 
                      color: '#2196F3',
                      textDecoration: 'none',
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
