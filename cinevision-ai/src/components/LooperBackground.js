import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LooperBackground = () => {
  // Generate an array of 69 polygons with decreasing sizes and different rotations
  const polygons = Array.from({ length: 69 }, (_, index) => {
    const reverseIndex = 69 - index;
    const size = 453 + (reverseIndex * 4);
    const opacity = index === 68 ? 0 : (index + 1) / 69;
    const angle = (index * 5) % 360;
    const translateX = 306 + (index * 15);
    const translateY = 909 - (index * 10);

    return (
      <Box
        key={index}
        sx={{
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          left: `${translateX}px`,
          top: `${translateY}px`,
          opacity: opacity,
          borderRadius: '25px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: `matrix(${Math.cos(angle * Math.PI / 180)}, ${Math.sin(angle * Math.PI / 180)}, ${-Math.sin(angle * Math.PI / 180)}, ${Math.cos(angle * Math.PI / 180)}, 0, 0)`,
          transition: 'all 0.5s ease-in-out',
        }}
      />
    );
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '2259.73px',
        height: '1396.13px',
        left: '92.35px',
        top: '-41px',
        transform: 'rotate(15deg)',
        animation: `${rotate} 60s linear infinite`,
        '& > *': {
          boxSizing: 'border-box',
        },
      }}
    >
      {polygons}
    </Box>
  );
};

export default LooperBackground;
