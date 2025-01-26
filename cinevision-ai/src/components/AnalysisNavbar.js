import React from 'react';
import { Tabs, Tab, Box, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const StyledToolbar = styled(Toolbar)`
  justify-content: center;
  gap: 1rem;
  background: linear-gradient(90deg, #3498DB, #2980B9);
`;

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
  '& .MuiTab-root': {
    minWidth: 120,
  },
}));

const AnalysisNavbar = ({ activeTab, onTabChange }) => {
  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <AppBar position="static" sx={{ marginTop: 2, marginBottom: 2 }}>
      <StyledToolbar>
        <StyledTabs
          value={activeTab}
          onChange={handleChange}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            icon={<GroupIcon />}
            label="Characters"
            value="roles"
          />
          <Tab
            icon={<MovieFilterIcon />}
            label="Storyboard"
            value="storyboard"
          />
          <Tab
            icon={<AttachMoneyIcon />}
            label="Budget"
            value="budget"
          />
          <Tab
            icon={<CameraAltIcon />}
            label="Camera & Lights"
            value="camera"
          />
          <Tab
            icon={<LightbulbIcon />}
            label="Suggestions"
            value="suggestions"
          />
        </StyledTabs>
      </StyledToolbar>
    </AppBar>
  );
};

export default AnalysisNavbar;
