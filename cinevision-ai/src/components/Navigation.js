import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GradientText = styled(Typography)`
  background: linear-gradient(90deg, #5D6EF3 0%, #00F0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
`;

const NavLink = styled(Typography)`
  font-family: 'REM';
  font-weight: 400;
  font-size: 20px;
  color: #FFFFFF;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 1;
  }
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-width: 200px;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  font-family: 'Space Grotesk';
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Navigation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogoClick = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleHomeClick = () => {
    if (currentUser) {
      navigate('/dashboard');
    }
  };

  const handleFeaturesClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFeatureSelect = (path) => {
    navigate(path);
    handleClose();
  };

  const features = [
    { name: 'Script Analysis', path: '/analysis' },
    { name: 'Storyboard Generator', path: '/storyboard' },
    { name: 'Character Analysis', path: '/character' },
    { name: 'Budget Analysis', path: '/budget' },
    { name: 'Camera Suggestions', path: '/camera' },
    { name: 'Script Editor', path: '/editor' },
  ];

  return (
    <Box sx={{ 
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10
    }}>
      <GradientText
        onClick={handleLogoClick}
        sx={{
          fontFamily: 'REM',
          fontWeight: 400,
          fontSize: '27px',
          lineHeight: '34px',
        }}
      >
        CineVision AI
      </GradientText>

      <Box sx={{ display: 'flex', gap: '24px' }}>
        <NavLink onClick={handleHomeClick}>
          Home
        </NavLink>
        <NavLink onClick={handleFeaturesClick}>
          Features
        </NavLink>
      </Box>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {features.map((feature) => (
          <StyledMenuItem 
            key={feature.path}
            onClick={() => handleFeatureSelect(feature.path)}
          >
            {feature.name}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
};

export default Navigation;
