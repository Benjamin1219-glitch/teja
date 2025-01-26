import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GradientText = styled(Typography)`
  background: linear-gradient(90deg, #5D6EF3 0%, #00F0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeadlineGradientText = styled(Typography)`
  background: linear-gradient(90deg, #FF3BFF 0%, #ECBFBF 50%, #5C24FF 75%, #D94FD5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StyledButton = styled(Button)`
  background: #FFFFFF;
  color: #000000;
  border-radius: 100px;
  padding: 12px 32px;
  font-family: 'Space Grotesk';
  font-size: 20px;
  text-transform: none;
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <GradientText
        sx={{
          position: 'absolute',
          left: '40px',
          top: '40px',
          fontFamily: 'REM',
          fontWeight: 400,
          fontSize: '27px',
          lineHeight: '34px',
          zIndex: 1,
        }}
      >
        CineVision AI
      </GradientText>

      {/* Main Content */}
      <Box sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '1200px',
        padding: '0 20px',
        zIndex: 1 
      }}>
        <HeadlineGradientText
          sx={{
            fontFamily: 'RocknRoll One',
            fontSize: '50px',
            lineHeight: '72px',
            letterSpacing: '0.02em',
            marginBottom: '24px',
          }}
        >
          Transforming Scripts into Cinematic Masterpieces.
        </HeadlineGradientText>

        <Typography
          sx={{
            fontFamily: 'REM',
            fontWeight: 500,
            fontSize: { xs: '40px', md: '80px' },
            lineHeight: '1.2',
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            marginBottom: '24px',
          }}
        >
          CineVision AI
        </Typography>

        <Typography
          sx={{
            fontFamily: 'Space Grotesk',
            fontSize: { xs: '16px', md: '20px' },
            lineHeight: '1.6',
            color: '#FFFFFF',
            opacity: 0.8,
            letterSpacing: '0.02em',
            maxWidth: '800px',
            margin: '0 auto 40px',
          }}
        >
          CineVision AI is an advanced platform designed for filmmakers, storytellers, and creative professionals to revolutionize the process of movie production. By analyzing your movie script, CineVision AI provides detailed insights and tools to simplify filmmaking and enhance creativity.
        </Typography>

        <StyledButton onClick={() => navigate('/signup')}>
          Create an account
        </StyledButton>
      </Box>

      {/* Gradient Circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '446px',
          height: '446px',
          right: '206px',
          bottom: '-112px',
          background: '#FC4FF6',
          opacity: 0.2,
          filter: 'blur(100px)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '464px',
          height: '462px',
          left: '168px',
          bottom: '-87px',
          background: '#8593E8',
          opacity: 0.2,
          filter: 'blur(100px)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '467px',
          height: '467px',
          left: '602px',
          bottom: '-2px',
          background: '#5D6EF3',
          opacity: 0.2,
          filter: 'blur(125px)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default LandingPage;
