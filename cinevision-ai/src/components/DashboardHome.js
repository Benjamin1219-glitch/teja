import React from 'react';
import { Box, Typography, Button, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Description as ScriptIcon,
  Movie as StoryboardIcon,
  Person as CharacterIcon,
  AttachMoney as BudgetIcon,
  CameraAlt as CameraIcon,
  Edit as EditorIcon
} from '@mui/icons-material';

const GradientText = styled(Typography)`
  background: linear-gradient(90deg, #5D6EF3 0%, #00F0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StyledButton = styled(Button)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 22px 32px;
  gap: 10px;
  width: 176px;
  height: 70px;
  background: #000000;
  border-radius: 100px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #FFFFFF;
  text-transform: none;
  flex: none;
  order: 0;
  flex-grow: 0;
  &:hover {
    background: #1a1a1a;
  }
`;

const FeatureButton = styled(Button)`
  width: 100%;
  height: 70px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  font-family: 'Space Grotesk';
  font-weight: 400;
  font-size: 18px;
  color: #FFFFFF;
  text-transform: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const HeadlineGradientText = styled(Typography)`
  background: linear-gradient(90deg, #FF3BFF 0%, #ECBFBF 50%, #5C24FF 75%, #D94FD5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeatureCard = styled(Box)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 200px;
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(93, 110, 243, 0.5);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  }

  .icon-container {
    background: linear-gradient(45deg, #5D6EF3 0%, #00F0FF 100%);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  &:hover .icon-container {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(93, 110, 243, 0.3);
  }

  .icon {
    font-size: 32px;
    color: white;
  }

  .title {
    color: white;
    font-family: 'Space Grotesk';
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  }

  .description {
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Space Grotesk';
    font-size: 14px;
    text-align: center;
    line-height: 1.4;
  }
`;

const FooterLink = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Space Grotesk';
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #5D6EF3;
  }
`;

const Footer = styled(Box)`
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px 0;
  margin-top: 120px;
  width: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const GetStartedButton = styled(Button)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 22px 32px;
  gap: 10px;
  width: 176px;
  height: 70px;
  background: #000000;
  border-radius: 100px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #FFFFFF;
  text-transform: none;
  flex: none;
  order: 0;
  flex-grow: 0;

  &:hover {
    background: #1a1a1a;
  }
`;

const features = [
  {
    title: 'Script Analysis',
    description: 'Analyze your movie script with our advanced tools',
    icon: <ScriptIcon className="icon" />,
    path: '/analysis'
  },
  {
    title: 'Storyboard Generator',
    description: 'Generate visual storyboards from your script automatically',
    icon: <StoryboardIcon className="icon" />,
    path: '/storyboard'
  },
  {
    title: 'Character Analysis',
    description: 'Analyze and develop your character profiles',
    icon: <CharacterIcon className="icon" />,
    path: '/character'
  },
  {
    title: 'Budget Analysis',
    description: 'Estimate and manage your production budget',
    icon: <BudgetIcon className="icon" />,
    path: '/budget'
  },
  {
    title: 'Camera Suggestions',
    description: 'Get AI-powered camera angle and shot suggestions',
    icon: <CameraIcon className="icon" />,
    path: '/camera'
  },
  {
    title: 'Script Editor',
    description: 'Create and edit your movie scripts with our advanced editor',
    icon: <EditorIcon className="icon" />,
    path: '/editor'
  }
];

const DashboardHome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box
      sx={{
        background: '#000000',
        position: 'relative',
        width: '1728px',
        minHeight: '1117px',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none'
      }}
    >
      {/* Logo */}
      <GradientText
        onClick={() => navigate('/dashboard')}
        sx={{
          position: 'absolute',
          left: '121px',
          top: '75px',
          fontFamily: 'REM',
          fontWeight: 400,
          fontSize: '27px',
          lineHeight: '34px',
          zIndex: 1,
          cursor: 'pointer'
        }}
      >
        CineVision AI
      </GradientText>

      {/* Navigation Links */}
      <Box sx={{ position: 'absolute', right: '121px', top: '90px', display: 'flex', gap: '24px', zIndex: 1 }}>
        <Typography
          sx={{
            fontFamily: 'REM',
            fontWeight: 400,
            fontSize: '27px',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          Home
        </Typography>
        <Typography
          sx={{
            fontFamily: 'REM',
            fontWeight: 400,
            fontSize: '27px',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
          onClick={handleLogout}
        >
          Log out
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        position: 'absolute',
        top: '200px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        paddingBottom: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1
      }}>
        <HeadlineGradientText
          sx={{
            fontFamily: 'RocknRoll One',
            fontSize: '50px',
            lineHeight: '72px',
            letterSpacing: '0.02em',
            marginBottom: '24px',
            textAlign: 'center',
            maxWidth: '1000px'
          }}
        >
          Transforming Scripts into Cinematic Masterpieces.
        </HeadlineGradientText>

        <Typography
          sx={{
            fontFamily: 'REM',
            fontWeight: 500,
            fontSize: '80px',
            lineHeight: '1.2',
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          CineVision AI
        </Typography>

        <Typography
          sx={{
            fontFamily: 'Space Grotesk',
            fontSize: '20px',
            lineHeight: '1.6',
            color: '#FFFFFF',
            opacity: 0.8,
            letterSpacing: '0.02em',
            maxWidth: '800px',
            marginBottom: '60px',
            textAlign: 'center'
          }}
        >
          CineVision AI is an advanced platform designed for filmmakers, storytellers, and creative professionals to revolutionize the process of movie production. By analyzing your movie script, CineVision AI provides detailed insights and tools to simplify filmmaking and enhance creativity.
        </Typography>

        <Box sx={{ position: 'relative', marginBottom: '60px' }}>
          <GetStartedButton onClick={() => navigate('/storyboard')}>
            Get started
          </GetStartedButton>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              onClick={() => navigate(feature.path)}
            >
              <Box className="icon-container">
                {feature.icon}
              </Box>
              <Typography className="title" variant="h6">
                {feature.title}
              </Typography>
              <Typography className="description">
                {feature.description}
              </Typography>
            </FeatureCard>
          ))}
        </Box>

        {/* Footer */}
        <Footer>
          <Box sx={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: '24px',
            width: '100%'
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <GradientText
                sx={{
                  fontFamily: 'REM',
                  fontSize: '20px',
                  marginBottom: '16px',
                  display: 'block'
                }}
              >
                CineVision AI
              </GradientText>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Space Grotesk',
                  fontSize: '14px',
                  maxWidth: '300px'
                }}
              >
                Transforming the future of filmmaking with AI-powered tools and insights.
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: { xs: '32px', md: '64px' },
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' }
            }}>
              <Box>
                <Typography
                  sx={{
                    color: 'white',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}
                >
                  Features
                </Typography>
                {features.slice(0, 3).map((feature) => (
                  <FooterLink
                    key={feature.title}
                    onClick={() => navigate(feature.path)}
                    sx={{ display: 'block', marginBottom: '8px' }}
                  >
                    {feature.title}
                  </FooterLink>
                ))}
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: 'white',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}
                >
                  More
                </Typography>
                {features.slice(3).map((feature) => (
                  <FooterLink
                    key={feature.title}
                    onClick={() => navigate(feature.path)}
                    sx={{ display: 'block', marginBottom: '8px' }}
                  >
                    {feature.title}
                  </FooterLink>
                ))}
              </Box>
            </Box>
          </Box>
        </Footer>
      </Box>
    </Box>
  );
};

export default DashboardHome;
