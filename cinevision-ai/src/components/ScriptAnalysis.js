import React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MovieIcon from '@mui/icons-material/Movie';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const AnalysisButton = styled(Button)`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  background: linear-gradient(90deg, #3498DB, #2980B9);
  color: white;
  
  &:hover {
    background: linear-gradient(90deg, #2980B9, #3498DB);
  }
`;

const ResultPaper = styled(Paper)`
  padding: 1rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const formatRolesAnalysis = (rolesData) => {
  if (!rolesData || !rolesData.roles) return '';
  
  let analysis = 'Script Character Analysis\n\n';
  
  // Overall story overview
  analysis += `This screenplay features an ensemble of ${rolesData.totalCharacters} distinct characters, ` +
    `creating a rich tapestry of personalities and relationships. The cast includes ` +
    `${rolesData.supportingCharacters} supporting roles and ${rolesData.minorCharacters} minor characters ` +
    `that help bring the story to life.\n\n`;
  
  // Individual character analysis
  analysis += 'Key Characters and Their Roles:\n\n';
  
  rolesData.roles.forEach(role => {
    // Character introduction
    analysis += `${role.name} - A ${role.importance.toLowerCase()} character who enters the story at line ${role.firstAppearance}. `;
    
    // Dialogue and presence
    analysis += `Throughout the script, ${role.name} delivers ${role.dialogueCount} lines of dialogue ` +
      `and appears in ${role.scenes.length} different scenes. `;
    
    // Character relationships
    if (role.interactions.length > 0) {
      const otherCharacters = role.interactions.filter(char => char !== role.name);
      if (otherCharacters.length > 0) {
        analysis += `${role.name}'s story arc interweaves with ${otherCharacters.join(', ')}, ` +
          `creating meaningful character dynamics.\n`;
      }
    }
    
    analysis += '\n';
  });
  
  return analysis;
};

const formatStoryboardAnalysis = (data) => {
  if (!data || !data.scenes) return '';
  
  let analysis = 'Storyboard Analysis\n\n';
  data.scenes.forEach((scene, index) => {
    analysis += `Scene ${index + 1}:\n`;
    analysis += `Location: ${scene.location}\n`;
    analysis += `Description: ${scene.description}\n`;
    if (scene.characters) {
      analysis += `Characters: ${scene.characters.join(', ')}\n`;
    }
    analysis += '\n';
  });
  return analysis;
};

const formatBudgetAnalysis = (data) => {
  if (!data || !data.budget) return '';
  
  let analysis = 'Budget Analysis\n\n';
  analysis += `Estimated Total Budget: $${data.budget.total.toLocaleString()}\n\n`;
  
  Object.entries(data.budget.breakdown || {}).forEach(([category, amount]) => {
    analysis += `${category}: $${amount.toLocaleString()}\n`;
  });
  
  return analysis;
};

const formatCameraAnalysis = (data) => {
  if (!data || !data.cameraAndLights) return '';
  
  let analysis = 'Camera & Lights Analysis\n\n';
  const { cameraAndLights } = data;
  
  if (cameraAndLights.specialShots) {
    analysis += 'Special Shots:\n';
    cameraAndLights.specialShots.forEach(shot => {
      analysis += `- ${shot}\n`;
    });
    analysis += '\n';
  }
  
  if (cameraAndLights.lightingSetups) {
    analysis += 'Lighting Setups:\n';
    cameraAndLights.lightingSetups.forEach(setup => {
      analysis += `- ${setup}\n`;
    });
  }
  
  return analysis;
};

const formatSuggestions = (data) => {
  if (!data || !data.suggestions) return '';
  
  let analysis = 'Script Suggestions\n\n';
  
  if (data.suggestions.improvements.length > 0) {
    analysis += 'Improvements:\n';
    data.suggestions.improvements.forEach(item => {
      analysis += `- ${item}\n`;
    });
    analysis += '\n';
  }
  
  if (data.suggestions.recommendations.length > 0) {
    analysis += 'Recommendations:\n';
    data.suggestions.recommendations.forEach(item => {
      analysis += `- ${item}\n`;
    });
    analysis += '\n';
  }
  
  if (data.suggestions.technicalNotes.length > 0) {
    analysis += 'Technical Notes:\n';
    data.suggestions.technicalNotes.forEach(item => {
      analysis += `- ${item}\n`;
    });
  }
  
  return analysis;
};

const ScriptAnalysis = ({ scriptText, onAnalysisResult }) => {
  const [analysisResult, setAnalysisResult] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleAnalysis = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analyze/${type}`, {
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
      
      let formattedAnalysis;
      switch (type) {
        case 'roles':
          formattedAnalysis = formatRolesAnalysis(data);
          break;
        case 'storyboard':
          formattedAnalysis = formatStoryboardAnalysis(data);
          break;
        case 'budget':
          formattedAnalysis = formatBudgetAnalysis(data);
          break;
        case 'camera':
          formattedAnalysis = formatCameraAnalysis(data);
          break;
        case 'suggestions':
          formattedAnalysis = formatSuggestions(data);
          break;
        default:
          formattedAnalysis = JSON.stringify(data, null, 2);
      }
      
      setAnalysisResult(formattedAnalysis);
      
      if (onAnalysisResult) {
        onAnalysisResult(data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <AnalysisButton
            startIcon={<MovieIcon />}
            onClick={() => handleAnalysis('storyboard')}
            disabled={loading}
          >
            Generate Storyboard
          </AnalysisButton>
          <AnalysisButton
            startIcon={<GroupIcon />}
            onClick={() => handleAnalysis('roles')}
            disabled={loading}
          >
            Analyze Roles
          </AnalysisButton>
          <AnalysisButton
            startIcon={<AccountBalanceWalletIcon />}
            onClick={() => handleAnalysis('budget')}
            disabled={loading}
          >
            Estimate Budget
          </AnalysisButton>
          <AnalysisButton
            startIcon={<CameraAltIcon />}
            onClick={() => handleAnalysis('camera')}
            disabled={loading}
          >
            Camera & Lights
          </AnalysisButton>
          <AnalysisButton
            startIcon={<LightbulbIcon />}
            onClick={() => handleAnalysis('suggestions')}
            disabled={loading}
          >
            Get Suggestions
          </AnalysisButton>
        </Grid>
        <Grid item xs={12} md={8}>
          <ResultPaper elevation={3}>
            <Typography
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                color: 'white'
              }}
            >
              {loading ? 'Analyzing...' : analysisResult || 'Click an analysis option to begin'}
            </Typography>
          </ResultPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScriptAnalysis;
