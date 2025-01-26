import React, { useState } from 'react';
import { Container, Typography, Box, Button, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import AnalysisNavbar from '../components/AnalysisNavbar';
import ScriptAnalysis from '../components/ScriptAnalysis';
import StoryboardGenerator from '../components/StoryboardGenerator';

const UploadContainer = styled(Container)`
  padding-top: 4rem;
  padding-bottom: 4rem;
`;

const UploadBox = styled(Paper)`
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px dashed #3498DB;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2980B9;
    transform: scale(1.02);
  }
`;

const UploadButton = styled(Button)`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #3498DB, #2980B9);
  color: white;
  
  &:hover {
    background: linear-gradient(90deg, #2980B9, #3498DB);
  }
`;

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [storyboards, setStoryboards] = useState([]);
  const [error, setError] = useState(null);
  const [scriptText, setScriptText] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({
    storyboard: null,
    roles: null,
    budget: null,
    camera: null,
    suggestions: null
  });
  const [activeTab, setActiveTab] = useState('roles');
  const [generatingStoryboard, setGeneratingStoryboard] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [storyboardPanels, setStoryboardPanels] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScriptText(e.target.result);
      };
      reader.readAsText(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScriptText(e.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleGenerate = () => {
    if (scriptText) {
      setShowAnalysis(true);
    }
  };

  const handleAnalysis = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      // API endpoint based on analysis type
      const endpoints = {
        storyboard: 'http://localhost:3001/api/analyze/storyboard',
        roles: 'http://localhost:3001/api/analyze/roles',
        budget: 'http://localhost:3001/api/analyze/budget',
        camera: 'http://localhost:3001/api/analyze/camera',
        suggestions: 'http://localhost:3001/api/analyze/suggestions'
      };

      const response = await fetch(endpoints[type], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scriptText }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the specific analysis result based on type
      setAnalysisResults(prev => ({
        ...prev,
        [type]: data
      }));

      // Show success message
      setError(null);
    } catch (error) {
      console.error(`${type} analysis failed:`, error);
      setError(`${type.charAt(0).toUpperCase() + type.slice(1)} analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !scriptText) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/upload', {
        scriptText: scriptText
      });

      setUploadSuccess(true);
      setShowAnalysis(true);
      setAnalysisResults(response.data);
      setActiveTab('roles');
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateStoryboard = async () => {
    try {
      setGeneratingStoryboard(true);
      setGenerationProgress('Starting storyboard generation...');
      setStoryboardPanels([]);

      const response = await axios.post('http://localhost:3001/api/generate/storyboard', {
        scriptText: scriptText
      });

      // Get the initial response
      const { id } = response.data;
      
      // Create EventSource for progress updates
      const eventSource = new EventSource(`http://localhost:3001/api/generate/storyboard/progress/${id}`);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setGenerationProgress(data.message);
        setStoryboardPanels(data.panels);
        
        if (data.status === 'completed' || data.status === 'error') {
          eventSource.close();
          setGeneratingStoryboard(false);
        }
      };
      
      eventSource.onerror = () => {
        eventSource.close();
        setGeneratingStoryboard(false);
        setError('Error generating storyboard');
      };
      
    } catch (error) {
      console.error('Error generating storyboard:', error);
      setError('Error generating storyboard');
      setGeneratingStoryboard(false);
    }
  };

  return (
    <Box>
      {!showAnalysis ? (
        <UploadContainer maxWidth="md">
          <Typography variant="h4" gutterBottom align="center">
            Upload Your Screenplay
          </Typography>
          
          <UploadBox
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragLeave}
            style={{ borderStyle: isDragging ? 'solid' : 'dashed' }}
          >
            <input
              type="file"
              accept=".txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="script-upload"
            />
            <label htmlFor="script-upload">
              <CloudUploadIcon style={{ fontSize: 60, color: '#3498DB' }} />
              <Typography variant="h6" gutterBottom>
                Drag & Drop your screenplay here
              </Typography>
              <Typography color="textSecondary">
                or click to browse
              </Typography>
            </label>
            
            {file && (
              <Typography variant="body1" style={{ marginTop: '1rem' }}>
                Selected file: {file.name}
              </Typography>
            )}
          </UploadBox>

          {error && (
            <Typography color="error" align="center" style={{ marginTop: '1rem' }}>
              {error}
            </Typography>
          )}

          <Box textAlign="center">
            <UploadButton
              variant="contained"
              onClick={handleUpload}
              disabled={!file || !scriptText || loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Uploading...' : 'Analyze Script'}
            </UploadButton>
          </Box>
        </UploadContainer>
      ) : (
        <Container maxWidth="xl">
          <AnalysisNavbar activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === 'roles' && (
            <ScriptAnalysis
              type="roles"
              results={analysisResults.roles}
              scriptContent={scriptText}
            />
          )}
          
          {activeTab === 'storyboard' && (
            <Box sx={{ py: 4 }}>
              <Typography variant="h4" gutterBottom>
                Storyboard Generator
              </Typography>
              {generatingStoryboard ? (
                <Typography variant="body1" gutterBottom>
                  {generationProgress}
                </Typography>
              ) : (
                <Button variant="contained" onClick={generateStoryboard}>
                  Generate Storyboard
                </Button>
              )}
              {storyboardPanels.length > 0 && (
                <StoryboardGenerator scriptContent={scriptText} panels={storyboardPanels} />
              )}
            </Box>
          )}
          
          {activeTab === 'budget' && (
            <ScriptAnalysis
              type="budget"
              results={analysisResults.budget}
              scriptContent={scriptText}
            />
          )}
          
          {activeTab === 'camera' && (
            <ScriptAnalysis
              type="camera"
              results={analysisResults.camera}
              scriptContent={scriptText}
            />
          )}
        </Container>
      )}
    </Box>
  );
};

export default Upload;
