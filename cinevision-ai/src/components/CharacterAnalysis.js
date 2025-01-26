import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CharacterAnalysis = ({ scriptContent }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeCharacters = async () => {
      if (!scriptContent) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:3001/api/analyze/characters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scriptText: scriptContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze characters');
        }

        const data = await response.json();
        setCharacters(data.characters || []);
      } catch (err) {
        setError('Error analyzing characters: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeCharacters();
  }, [scriptContent]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Analyzing characters...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">{error}</Typography>
    );
  }

  if (characters.length === 0) {
    return (
      <Typography>No characters found in the script.</Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Characters Analysis</Typography>
      
      {characters.map((character, index) => (
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
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography>
              {character.name} - {character.role}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {character.description && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Description:</strong> {character.description}
                </Typography>
              )}
              
              <Typography sx={{ mb: 1 }}>
                <strong>Lines:</strong> {character.lineCount}
              </Typography>
              
              {character.sampleDialogues?.length > 0 && (
                <>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Sample Dialogues:</strong>
                  </Typography>
                  {character.sampleDialogues.map((dialogue, i) => (
                    <Typography 
                      key={i} 
                      sx={{ 
                        pl: 2,
                        borderLeft: '2px solid #3498db',
                        mb: 1
                      }}
                    >
                      "{dialogue}"
                    </Typography>
                  ))}
                </>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CharacterAnalysis;
