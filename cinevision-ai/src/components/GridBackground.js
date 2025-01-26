import React from 'react';
import { Box } from '@mui/material';

const GridBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, rgba(255,0,255,0.1) 0%, rgba(0,0,255,0.1) 50%, rgba(0,255,255,0.1) 100%),
            linear-gradient(0deg, #000000 0%, rgba(0,0,0,0) 100%)
          `,
          zIndex: 1,
        },
      }}
    >
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '60%',
          minWidth: '1000px',
        }}
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF00FF" />
            <stop offset="50%" stopColor="#0000FF" />
            <stop offset="100%" stopColor="#00FFFF" />
          </linearGradient>
          
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#grid)"
          opacity="0.3"
        />

        {/* Wave lines */}
        {[...Array(3)].map((_, i) => (
          <path
            key={i}
            d={`M -100 ${400 + i * 50} C 200 ${300 + i * 50}, 800 ${500 + i * 50}, 1100 ${350 + i * 50}`}
            fill="none"
            stroke="url(#wave-gradient)"
            strokeWidth={3 - i * 0.5}
            opacity={0.8 - i * 0.2}
          />
        ))}
      </svg>
    </Box>
  );
};

export default GridBackground;
