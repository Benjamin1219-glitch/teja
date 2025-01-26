import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import StoryboardGenerator from './StoryboardGenerator';
import CharacterAnalysis from './CharacterAnalysis';
import BudgetAnalysis from './BudgetAnalysis';
import CameraAnalysis from './CameraAnalysis';
import SuggestionsAnalysis from './SuggestionsAnalysis';
import '../styles/Background.css';

const Dashboard = () => {
  const [scriptContent, setScriptContent] = useState('');

  const handleScriptUpload = (content) => {
    setScriptContent(content);
  };

  return (
    <>
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
      </div>
      
      <div className="content-overlay">
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
              CineVision AI Dashboard
            </Typography>
            
            <Grid container spacing={3}>
              {/* Storyboard Generator */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>Generate Storyboard</Typography>
                  <StoryboardGenerator onScriptUpload={handleScriptUpload} />
                </Paper>
              </Grid>

              {/* Character Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
                  <CharacterAnalysis scriptContent={scriptContent} />
                </Paper>
              </Grid>

              {/* Budget Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
                  <BudgetAnalysis scriptContent={scriptContent} />
                </Paper>
              </Grid>

              {/* Camera Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
                  <CameraAnalysis scriptContent={scriptContent} />
                </Paper>
              </Grid>

              {/* Production Suggestions */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
                  <SuggestionsAnalysis scriptContent={scriptContent} />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default Dashboard;
