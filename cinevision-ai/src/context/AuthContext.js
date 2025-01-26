import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { user, token } = await loginUser(email, password);
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      return { user, token };
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { user, token } = await signupUser(name, email, password);
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      return { user, token };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
