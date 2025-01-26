import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';

const SuggestionsAnalysis = ({ scriptContent }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeSuggestions = async () => {
      if (!scriptContent) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:3001/api/analyze/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scriptText: scriptContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze production suggestions');
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError('Error analyzing suggestions: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeSuggestions();
  }, [scriptContent]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Analyzing production suggestions...</Typography>
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
      <Typography>No suggestions analysis available.</Typography>
    );
  }

  const getIconForCategory = (category) => {
    switch (category.toLowerCase()) {
      case 'scheduling':
        return <EventIcon />;
      case 'timing':
        return <AccessTimeIcon />;
      case 'crew planning':
        return <GroupIcon />;
      case 'logistics':
        return <LocalShippingIcon />;
      default:
        return <BuildIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Production Suggestions</Typography>

      {/* Scheduling Overview */}
      <Card sx={{ mb: 3, bgcolor: 'rgba(52, 152, 219, 0.1)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <EventIcon sx={{ fontSize: 30 }} />
            <Typography variant="h6">
              Estimated Production Duration: {analysis.scheduling.estimated_days} days
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Location Groupings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'rgba(52, 152, 219, 0.1)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOnIcon />
                <Typography variant="h6">Location Groupings</Typography>
              </Box>
              <List>
                {analysis.scheduling.location_groupings.map((group, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={group.location}
                      secondary={
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {group.suggestion}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Time of Day Groupings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'rgba(52, 152, 219, 0.1)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccessTimeIcon />
                <Typography variant="h6">Time of Day Groupings</Typography>
              </Box>
              <List>
                {analysis.scheduling.time_of_day_groupings.map((group, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={group.time}
                      secondary={
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {group.suggestion}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Crew Requirements */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'rgba(52, 152, 219, 0.1)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <GroupIcon />
                <Typography variant="h6">Crew Requirements</Typography>
              </Box>
              
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Core Departments:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {analysis.crew_requirements.departments.map((dept, index) => (
                  <Chip 
                    key={index}
                    label={dept.name}
                    sx={{ bgcolor: 'rgba(52, 152, 219, 0.2)', color: 'white' }}
                  />
                ))}
              </Box>

              {analysis.crew_requirements.special_crew.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Special Crew Needed:</Typography>
                  <List dense>
                    {analysis.crew_requirements.special_crew.map((crew, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={crew.role}
                          secondary={
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {crew.reason}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Safety Considerations */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'rgba(52, 152, 219, 0.1)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon />
                <Typography variant="h6">Safety Considerations</Typography>
              </Box>
              <List>
                {analysis.safety_considerations.map((safety, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ErrorIcon sx={{ color: safety.priority === 'High' ? '#e74c3c' : '#f1c40f' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={safety.consideration}
                      secondary={
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Priority: {safety.priority}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Optimization Suggestions */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Optimization Suggestions</Typography>
        <Grid container spacing={2}>
          {analysis.optimization_suggestions.map((suggestion, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(52, 152, 219, 0.1)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {getIconForCategory(suggestion.category)}
                    <Typography variant="subtitle1">{suggestion.category}</Typography>
                  </Box>
                  <Typography sx={{ mb: 1 }}>{suggestion.suggestion}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Benefit: {suggestion.benefit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Production Challenges */}
      {analysis.production_challenges.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Production Challenges</Typography>
          <Grid container spacing={2}>
            {analysis.production_challenges.map((challenge, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', bgcolor: 'rgba(52, 152, 219, 0.1)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>{challenge.type}</Typography>
                    <Typography sx={{ mb: 1 }}>{challenge.description}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Solution: {challenge.suggestion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default SuggestionsAnalysis;
