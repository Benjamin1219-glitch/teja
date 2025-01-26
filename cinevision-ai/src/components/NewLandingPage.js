import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components
const GradientText = styled(Typography)`
  background: linear-gradient(90deg, #FF1CF7 0%, #00F0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoText = styled(Typography)`
  background: linear-gradient(90deg, #5D6EF3 0%, #00F0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StyledButton = styled(Button)`
  background: #000000;
  border: 2px solid #FFFFFF;
  border-radius: 100px;
  padding: 20px 32px;
  text-transform: none;
  font-family: 'Space Grotesk';
  font-size: 20px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid #FFFFFF;
  }
`;

const BackgroundGradient = styled(Box)`
  position: absolute;
  width: 494px;
  height: 494px;
  border-radius: 50%;
  filter: blur(100px);
`;

const NewLandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradients */}
      <BackgroundGradient
        sx={{
          right: '5%',
          bottom: '10%',
          background: '#FC4FF6',
          opacity: 0.2,
        }}
      />
      <BackgroundGradient
        sx={{
          left: '5%',
          bottom: '10%',
          background: '#899AFF',
          opacity: 0.2,
        }}
      />
      <BackgroundGradient
        sx={{
          left: '40%',
          bottom: '20%',
          background: '#485DFF',
          opacity: 0.2,
          width: '426px',
          height: '426px',
          filter: 'blur(125px)',
        }}
      />

      {/* Header */}
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
          <LogoText variant="h4" sx={{ fontFamily: 'REM', fontSize: '27px' }}>
            CineVision AI
          </LogoText>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FFFFFF', 
                fontFamily: 'REM', 
                fontSize: '25px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              Home
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FFFFFF', 
                fontFamily: 'REM', 
                fontSize: '25px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/features')}
            >
              Features
            </Typography>
          </Box>
        </Box>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mt: 15 }}>
          <GradientText 
            variant="h1" 
            sx={{ 
              fontFamily: 'REM', 
              fontSize: '60px', 
              lineHeight: '75px',
              mb: 4,
              maxWidth: '1292px',
              mx: 'auto'
            }}
          >
            Transforming Scripts into Cinematic Masterpieces.
          </GradientText>

          <Typography 
            variant="h2" 
            sx={{ 
              color: '#FFFFFF',
              fontFamily: 'REM',
              fontSize: '80px',
              lineHeight: '100px',
              mb: 4
            }}
          >
            CineVision AI
          </Typography>

          <Typography 
            sx={{ 
              color: '#FFFFFF',
              fontFamily: 'Space Grotesk',
              fontSize: '20px',
              lineHeight: '33px',
              maxWidth: '956px',
              mx: 'auto',
              mb: 8,
              letterSpacing: '0.72px'
            }}
          >
            CineVision AI is an advanced platform designed for filmmakers, storytellers, and creative professionals to revolutionize the process of movie production. By analyzing your movie script, CineVision AI provides detailed insights and tools to simplify filmmaking and enhance creativity.
          </Typography>

          <StyledButton 
            variant="outlined" 
            color="inherit"
            onClick={() => navigate('/signup')}
          >
            Create an account
          </StyledButton>
        </Box>
      </Container>
    </Box>
  );
};

export default NewLandingPage;
