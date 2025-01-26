import React from 'react';
import { Box } from '@mui/material';

const WaveBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        left: 0,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <defs>
          <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF00FF', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#0000FF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00FFFF', stopOpacity: 1 }} />
          </linearGradient>
          
          <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path 
              d="M 30 0 L 0 0 0 30" 
              fill="none" 
              stroke="url(#grid-gradient)" 
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
          
          <pattern id="grid" width="300" height="300" patternUnits="userSpaceOnUse">
            <rect width="300" height="300" fill="url(#smallGrid)" />
          </pattern>
        </defs>

        {/* Base grid */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#grid)"
          transform="rotate(-10)"
          style={{
            transformOrigin: 'center',
          }}
        />

        {/* Animated wave paths */}
        {Array.from({ length: 5 }, (_, i) => {
          const yOffset = 400 + (i * 100);
          return (
            <g key={i} opacity={(1 - (i * 0.15)).toString()}>
              <path
                d={`M-100 ${yOffset} C 500 ${yOffset - 200}, 1000 ${yOffset + 200}, 2000 ${yOffset - 100}`}
                fill="none"
                stroke="url(#grid-gradient)"
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>
    </Box>
  );
};

export default WaveBackground;
