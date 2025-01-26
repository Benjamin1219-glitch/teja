import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)`
  background: rgba(17, 25, 40, 0.75);
  backdrop-filter: blur(16px);
  border-bottom: none;
  box-shadow: none;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

const LogoButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.9);
`;

const NavButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.9);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    color: #2196F3;
  }
`;

const LogoText = styled(Typography)`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #2196F3 30%, #1A237E 90%);
  border-radius: 25px;
  border: 0;
  color: white;
  height: 40px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(33, 150, 243, .3);
  text-transform: none;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #1A237E 30%, #2196F3 90%);
    transform: scale(1.05);
  }
`;

const OutlinedButton = styled(Button)`
  border: 2px solid #2196F3;
  border-radius: 25px;
  color: white;
  height: 40px;
  padding: 0 30px;
  text-transform: none;
  font-size: 16px;
  margin-right: 16px;
  transition: all 0.3s ease;

  &:hover {
    border: 2px solid #1A237E;
    background: rgba(33, 150, 243, 0.1);
    transform: scale(1.05);
  }
`;

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: currentUser ? '/dashboard' : '/' },
    { text: 'Storyboard', icon: <MovieIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Design', icon: <PaletteIcon />, path: 'https://www.figma.com/file/your-design-file', target: '_blank' },
  ];

  const drawer = (
    <Box sx={{ 
      width: 250,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
      height: '100%',
      color: 'white',
    }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => {
              if (item.target) {
                window.open(item.path, item.target);
              } else {
                navigate(item.path);
              }
              handleDrawerToggle();
            }}
            sx={{
              '&:hover': {
                background: 'rgba(33, 150, 243, 0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#2196F3' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isLandingPage) return null;

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          {!isAuthPage && (
            <IconButton
              color="inherit"
              aria-label="menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                color: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  background: 'rgba(33, 150, 243, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <LogoButton onClick={() => navigate('/')}>
            <HomeIcon />
          </LogoButton>
          <LogoText 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            CineVision AI
          </LogoText>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {!isAuthPage && menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  startIcon={item.icon}
                  onClick={() => {
                    if (item.target) {
                      window.open(item.path, item.target);
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  {item.text}
                </NavButton>
              ))}
              {currentUser ? (
                <StyledButton onClick={handleLogout}>
                  Logout
                </StyledButton>
              ) : (
                <>
                  <OutlinedButton onClick={() => navigate('/login')}>
                    Log In
                  </OutlinedButton>
                  <StyledButton onClick={() => navigate('/signup')}>
                    Sign Up
                  </StyledButton>
                </>
              )}
            </Box>
          )}
        </StyledToolbar>
      </StyledAppBar>
      <Toolbar sx={{ minHeight: '80px !important' }} /> {/* Spacer */}

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default NavBar;
