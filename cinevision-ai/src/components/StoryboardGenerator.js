import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Paper, 
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardMedia,
  CardContent 
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {
  Home as InteriorIcon,
  Landscape as ExteriorIcon,
  CompareArrows as IntExtIcon,
} from '@mui/icons-material';
import { generateImage } from '../services/imageGenerationService';

const StoryboardGenerator = ({ onScriptUpload }) => {
  const [scriptContent, setScriptContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [scenes, setScenes] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('INT');
  const [generatedImages, setGeneratedImages] = useState({});

  const handleLocationMenuClick = (event) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const handleLocationMenuClose = () => {
    setLocationAnchorEl(null);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    handleLocationMenuClose();
  };

  const locationItems = [
    { text: 'INT', icon: <InteriorIcon />, description: 'Interior' },
    { text: 'EXT', icon: <ExteriorIcon />, description: 'Exterior' },
    { text: 'INT/EXT', icon: <IntExtIcon />, description: 'Interior/Exterior' },
  ];

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const content = await file.text();
        setScriptContent(content);
        setUploadedFile(file);
        onScriptUpload(content);
        setError(null);
      } catch (err) {
        setError('Error reading file: ' + err.message);
      }
    }
  }, [onScriptUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const generateStoryboard = async () => {
    if (!scriptContent) {
      setError('Please upload a script first');
      return;
    }

    setGenerating(true);
    setError(null);
    setScenes([]);
    setProgress('Starting storyboard generation...');
    setGeneratedImages({});

    try {
      const response = await fetch('http://localhost:3001/api/generate/storyboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scriptText: scriptContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate storyboard');
      }

      const data = await response.json();
      const { id } = data;

      const eventSource = new EventSource(`http://localhost:3001/api/generate/storyboard/progress/${id}`);
      
      eventSource.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received event data:', data);
          
          if (data.status === 'error') {
            setError(data.message);
            eventSource.close();
            setGenerating(false);
            return;
          }
          
          if (data.scenes) {
            setScenes(data.scenes);
            // Generate images for each scene that doesn't have an image yet
            for (const scene of data.scenes) {
              if (!generatedImages[scene.id]) {
                try {
                  setProgress(`Generating image for scene ${scene.scene_number}: ${scene.description.substring(0, 50)}...`);
                  const imageData = await generateImage(scene.description);
                  setGeneratedImages(prev => ({
                    ...prev,
                    [scene.id]: imageData
                  }));
                } catch (err) {
                  console.error('Error generating image for scene:', err);
                  setError(`Error generating image for scene ${scene.scene_number}: ${err.message}`);
                }
              }
            }
          }
          
          if (data.status === 'complete') {
            eventSource.close();
            setGenerating(false);
            setProgress('Storyboard generation complete!');
          } else if (data.message) {
            setProgress(data.message);
          }
        } catch (err) {
          console.error('Error parsing event data:', err);
          setError('Error processing server response');
        }
      };

      eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        eventSource.close();
        setGenerating(false);
        setError('Error connecting to server');
      };
    } catch (err) {
      console.error('Error generating storyboard:', err);
      setGenerating(false);
      setError(err.message);
    }
  };

  const renderScenes = () => {
    return (
      <Grid container spacing={3}>
        {scenes.map((scene, index) => (
          <Grid item xs={12} sm={6} md={4} key={scene.id}>
            <Card>
              {generatedImages[scene.id] && (
                <CardMedia
                  component="img"
                  height="300"
                  image={`data:image/jpeg;base64,${generatedImages[scene.id]}`}
                  alt={`Scene ${index + 1}`}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scene {index + 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scene.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <Box
          {...getRootProps()}
          sx={{
            flex: 1,
            border: '2px dashed rgba(33, 150, 243, 0.5)',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'rgba(33, 150, 243, 0.1)' : 'background.paper',
            '&:hover': {
              bgcolor: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {isDragActive ? 'Drop your script here' : 'Upload a Script'}
          </Typography>
        </Box>

        <Button
          onClick={handleLocationMenuClick}
          sx={{
            color: '#2196f3',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            bgcolor: 'rgba(33, 150, 243, 0.1)',
            minWidth: '120px',
            '&:hover': {
              bgcolor: 'rgba(33, 150, 243, 0.2)',
              border: '1px solid #2196f3',
              boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
            },
          }}
        >
          {selectedLocation} ▼
        </Button>

        <Menu
          anchorEl={locationAnchorEl}
          open={Boolean(locationAnchorEl)}
          onClose={handleLocationMenuClose}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(0, 10, 25, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
              boxShadow: '0 0 10px rgba(33, 150, 243, 0.3)',
              '& .MuiMenuItem-root': {
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.2)',
                  color: '#2196f3',
                  boxShadow: 'inset 0 0 8px rgba(33, 150, 243, 0.3)',
                },
                '& .MuiListItemIcon-root': {
                  color: '#2196f3',
                },
              },
            },
          }}
        >
          {locationItems.map((item) => (
            <MenuItem 
              key={item.text} 
              onClick={() => handleLocationSelect(item.text)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                secondary={item.description}
                secondaryTypographyProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.5)' }
                }}
              />
            </MenuItem>
          ))}
        </Menu>

        <Button
          variant="contained"
          onClick={generateStoryboard}
          sx={{
            bgcolor: '#2196f3',
            color: 'white',
            '&:hover': {
              bgcolor: '#1976d2',
              boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
            },
          }}
        >
          Generate Storyboard
        </Button>

        <Button
          variant="contained"
          sx={{
            bgcolor: '#2196f3',
            color: 'white',
            '&:hover': {
              bgcolor: '#1976d2',
              boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
            },
          }}
          onClick={() => window.location.href = '/write-script'}
        >
          Write a Script
        </Button>
      </Box>

      {uploadedFile && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2,
            bgcolor: 'rgba(33, 150, 243, 0.1)',
            color: '#2196f3',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            '& .MuiAlert-icon': {
              color: '#2196f3'
            }
          }}
        >
          <Typography variant="body1" sx={{ color: '#2196f3' }}>
            Script "{uploadedFile.name}" has been successfully uploaded!
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(33, 150, 243, 0.7)' }}>
            File size: {(uploadedFile.size / 1024).toFixed(2)} KB
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            bgcolor: 'rgba(33, 150, 243, 0.1)',
            color: '#2196f3',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            '& .MuiAlert-icon': {
              color: '#2196f3'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {generating && (
        <Typography sx={{ mb: 2, color: '#2196f3' }}>
          {progress}
        </Typography>
      )}

      {scenes.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2196f3' }}>
            Generated Storyboard:
          </Typography>
          {renderScenes()}
        </Box>
      )}
    </Box>
  );
};

export default StoryboardGenerator;
