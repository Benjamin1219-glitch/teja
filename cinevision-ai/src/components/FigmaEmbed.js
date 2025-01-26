import React from 'react';
import { Box } from '@mui/material';

const FigmaEmbed = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}
    >
      <iframe
        style={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
        }}
        width="100%"
        height="100%"
        src="https://embed.figma.com/design/JTKsmDiJL7zrHfQETCiVcS/Serendale.ai---AI-based-Blockchain-Hero-Exploration-(Community)?node-id=0-1&embed-host=share"
        allowFullScreen
        title="Figma Design"
      />
    </Box>
  );
};

export default FigmaEmbed;
