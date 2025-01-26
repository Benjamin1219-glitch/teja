import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StoryboardGenerator from '../components/StoryboardGenerator';
import CharacterAnalysis from '../components/CharacterAnalysis';
import BudgetAnalysis from '../components/BudgetAnalysis';
import CameraAnalysis from '../components/CameraAnalysis';
import SuggestionsAnalysis from '../components/SuggestionsAnalysis';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [scriptContent, setScriptContent] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [uploadedScript, setUploadedScript] = useState(false);
  const { logout } = useAuth();

  const handleScriptUpload = (content) => {
    setScriptContent(content);
    setUploadedScript(true);
  };

  const handleAnalyzeClick = (type) => {
    if (!uploadedScript) {
      alert('Please upload a script first');
      return;
    }
    setActiveAnalysis(type);
  };

  return (
    <Box sx={{ minHeight: '100vh', color: 'white' }}>
      <Box sx={{ 
        bgcolor: 'rgba(44, 62, 80, 0.8)', 
        backdropFilter: 'blur(10px)',
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <Typography variant="h6">CineVision AI</Typography>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={logout}
        >
          Logout
        </Button>
      </Box>

      <Container sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <StoryboardGenerator onScriptUpload={handleScriptUpload} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<MovieIcon />}
            onClick={() => handleAnalyzeClick('storyboard')}
            sx={{ bgcolor: '#3498db', color: 'white' }}
          >
            GENERATE STORYBOARD
          </Button>
          
          <Button
            variant="contained"
            startIcon={<PeopleIcon />}
            onClick={() => handleAnalyzeClick('characters')}
            sx={{ bgcolor: '#3498db', color: 'white' }}
          >
            ANALYZE ROLES
          </Button>
          
          <Button
            variant="contained"
            startIcon={<MonetizationOnIcon />}
            onClick={() => handleAnalyzeClick('budget')}
            sx={{ bgcolor: '#3498db', color: 'white' }}
          >
            ESTIMATE BUDGET
          </Button>
          
          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={() => handleAnalyzeClick('camera')}
            sx={{ bgcolor: '#3498db', color: 'white' }}
          >
            CAMERA & LIGHTS
          </Button>
          
          <Button
            variant="contained"
            startIcon={<LightbulbIcon />}
            onClick={() => handleAnalyzeClick('suggestions')}
            sx={{ bgcolor: '#3498db', color: 'white' }}
          >
            GET SUGGESTIONS
          </Button>
        </Box>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'rgba(44, 62, 80, 0.8)',
          backdropFilter: 'blur(10px)', 
          borderRadius: 1 
        }}>
          {!uploadedScript && (
            <Typography sx={{ color: '#666' }}>
              Click an analysis option to begin
            </Typography>
          )}
          
          {uploadedScript && activeAnalysis === 'characters' && (
            <CharacterAnalysis scriptContent={scriptContent} />
          )}
          
          {uploadedScript && activeAnalysis === 'budget' && (
            <BudgetAnalysis scriptContent={scriptContent} />
          )}
          
          {uploadedScript && activeAnalysis === 'camera' && (
            <CameraAnalysis scriptContent={scriptContent} />
          )}
          
          {uploadedScript && activeAnalysis === 'suggestions' && (
            <SuggestionsAnalysis scriptContent={scriptContent} />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
