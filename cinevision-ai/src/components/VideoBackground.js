import React from 'react';
import { Box } from '@mui/material';
import '../styles/VideoBackground.css';

const VideoBackground = () => {
  return (
    <Box className="video-background">
      <video
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/smoke-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default VideoBackground;
