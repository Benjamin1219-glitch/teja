import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import MovieIcon from '@mui/icons-material/Movie';
import LensIcon from '@mui/icons-material/Lens';
import SettingsIcon from '@mui/icons-material/Settings';

const CameraAnalysis = ({ scriptContent }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeCameraRequirements = async () => {
      if (!scriptContent) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:3001/api/analyze/camera', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scriptText: scriptContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze camera requirements');
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError('Error analyzing camera requirements: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeCameraRequirements();
  }, [scriptContent]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Analyzing camera and lighting requirements...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">{error}</Typography>
    );
  }

  if (!analysis) {
    return (
      <Typography>No camera analysis available.</Typography>
    );
  }

  const getIconForCategory = (category) => {
    switch (category.toLowerCase()) {
      case 'camera':
        return <CameraAltIcon />;
      case 'lenses':
        return <LensIcon />;
      case 'lighting':
        return <WbIncandescentIcon />;
      case 'movement':
        return <MovieIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Camera & Lighting Analysis</Typography>

      {/* Overall Recommendations */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Key Recommendations</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {analysis.recommendations.map((rec, index) => (
            <Card 
              key={index}
              sx={{ 
                flex: '1 1 300px',
                maxWidth: 400,
                bgcolor: 'rgba(52, 152, 219, 0.1)',
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {getIconForCategory(rec.category)}
                  <Typography variant="h6">{rec.category}</Typography>
                </Box>
                <Typography sx={{ mb: 2 }}>{rec.suggestion}</Typography>
                {Array.isArray(rec.details) ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {rec.details.map((detail, i) => (
                      <Chip 
                        key={i}
                        label={detail}
                        sx={{ 
                          bgcolor: 'rgba(52, 152, 219, 0.2)',
                          color: 'white'
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box>
                    {Object.entries(rec.details).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#3498db' }}>
                          {key.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <List dense>
                          {Array.isArray(value) ? (
                            value.map((item, i) => (
                              <ListItem key={i}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <LensIcon sx={{ fontSize: 8, color: '#3498db' }} />
                                </ListItemIcon>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))
                          ) : (
                            <ListItem>
                              <ListItemText primary={value} />
                            </ListItem>
                          )}
                        </List>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Scene-by-Scene Analysis */}
      <Typography variant="h6" sx={{ mb: 2 }}>Scene-by-Scene Analysis</Typography>
      {analysis.scenes.map((scene, index) => (
        <Accordion 
          key={index}
          sx={{
            mb: 1,
            bgcolor: 'rgba(52, 152, 219, 0.1)',
            color: 'white',
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            sx={{ '&:hover': { bgcolor: 'rgba(52, 152, 219, 0.2)' } }}
          >
            <Typography>
              {scene.location_type} {scene.location} - {scene.time}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Camera Requirements */}
            {scene.camera_requirements.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#3498db', mb: 1 }}>
                  Camera Setup
                </Typography>
                <List dense>
                  {scene.camera_requirements.map((req, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <CameraAltIcon sx={{ color: '#3498db' }} />
                      </ListItemIcon>
                      <ListItemText primary={req.suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Lighting Requirements */}
            {scene.lighting_requirements.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#3498db', mb: 1 }}>
                  Lighting Setup
                </Typography>
                {scene.lighting_requirements.map((req, i) => (
                  <Box key={i}>
                    {Object.entries(req.setup).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#3498db' }}>
                          {key.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <List dense>
                          {value.map((item, j) => (
                            <ListItem key={j}>
                              <ListItemIcon>
                                <WbIncandescentIcon sx={{ color: '#3498db' }} />
                              </ListItemIcon>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            )}

            {/* Movement Requirements */}
            {scene.movement_requirements.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#3498db', mb: 1 }}>
                  Camera Movement
                </Typography>
                <List dense>
                  {scene.movement_requirements.map((req, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <MovieIcon sx={{ color: '#3498db' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={req.type}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Equipment: {req.equipment.join(', ')}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CameraAnalysis;
