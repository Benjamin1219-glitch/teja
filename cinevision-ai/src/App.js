import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import StoryboardGenerator from './components/StoryboardGenerator';
import CharacterAnalysis from './components/CharacterAnalysis';
import BudgetAnalysis from './components/BudgetAnalysis';
import CameraAnalysis from './components/CameraAnalysis';
import SuggestionsAnalysis from './components/SuggestionsAnalysis';
import NewLandingPage from './components/NewLandingPage';
import DashboardHome from './components/DashboardHome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ScriptEditor from './components/ScriptEditor';
import FigmaEmbed from './components/FigmaEmbed';
import { useAuth } from './context/AuthContext';
import theme from './styles/theme';
import './styles/Background.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route component - redirects to dashboard if user is logged in
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isDashboardHome = location.pathname === '/dashboard';
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        {!isLandingPage && !isDashboardHome && !isLoginPage && !isSignupPage && (
          <div className="video-background">
            <video autoPlay muted loop playsInline style={{
              position: 'fixed',
              right: 0,
              bottom: 0,
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              zIndex: -1
            }}>
              <source src="/smoke-background.mp4" type="video/mp4" />
            </video>
          </div>
        )}
        {!isLandingPage && !isDashboardHome && !isLoginPage && !isSignupPage && <Navbar />}
        <Routes>
          {/* Public routes - only accessible when not logged in */}
          <Route path="/" element={
            <PublicRoute>
              <NewLandingPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="/design" element={<FigmaEmbed />} />
          <Route path="/login-page" element={<LoginPage />} />

          {/* Protected routes - only accessible when logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/features"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write-script"
            element={
              <ProtectedRoute>
                <ScriptEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storyboard"
            element={
              <ProtectedRoute>
                <StoryboardGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/characters"
            element={
              <ProtectedRoute>
                <CharacterAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/camera"
            element={
              <ProtectedRoute>
                <CameraAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <ProtectedRoute>
                <SuggestionsAnalysis />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
