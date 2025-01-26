import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#000000',
      paper: 'rgba(0, 0, 0, 0.8)',
    },
  },
  typography: {
    fontFamily: 'REM, Space Grotesk, sans-serif',
    h1: {
      fontFamily: 'REM',
      fontWeight: 500,
    },
    h2: {
      fontFamily: 'REM',
      fontWeight: 400,
    },
    body1: {
      fontFamily: 'Space Grotesk',
    },
    button: {
      fontFamily: 'Space Grotesk',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '12px 32px',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

export default theme;
