import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`);
      setUser(res.data);
    } catch (error) {
      // Token is invalid or expired — clear it so PrivateRoute redirects to login
      console.error('Session expired or invalid');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    setToken(res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email, avatar: res.data.avatar });
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    setToken(res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email, avatar: res.data.avatar });
    return res.data;
  };

  // Real Google OAuth — receives access token from @react-oauth/google (custom button flow)
  const googleLogin = async (tokenResponse) => {
    const res = await axios.post(`${API_URL}/api/auth/google`, {
      access_token: tokenResponse.access_token,
    });
    setToken(res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email, avatar: res.data.avatar });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
