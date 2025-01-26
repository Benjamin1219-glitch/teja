import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: white;
  padding: 2rem;
`;

const StyledButton = styled(Button)`
  margin: 1rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid white;
  color: white;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <HeroSection>
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to CineVision AI
          </Typography>
          <Typography variant="h5" gutterBottom>
            Transform your movie scripts into stunning storyboards with AI
          </Typography>
          <Typography variant="body1" paragraph>
            Upload your script and let our AI bring your story to life through beautifully generated storyboards
          </Typography>
          <StyledButton
            component={Link}
            to="/upload"
            variant="outlined"
          >
            Get Started
          </StyledButton>
        </motion.div>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="body1">
            Three simple steps to bring your story to life
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 4 }}>
          {[
            {
              title: 'Upload Script',
              description: 'Share your movie script in any common format'
            },
            {
              title: 'AI Processing',
              description: 'Our AI analyzes your script and visualizes key scenes'
            },
            {
              title: 'Get Storyboards',
              description: 'Download professionally generated storyboards'
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  maxWidth: 300,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {step.title}
                </Typography>
                <Typography>
                  {step.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </motion.div>
  );
};

export default Home;
