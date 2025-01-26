import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};
