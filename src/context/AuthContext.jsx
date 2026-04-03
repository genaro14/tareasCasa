import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch (err) {
      console.error('Auth check failed:', err);
      authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [checkAuth]);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await authApi.login(username, password);
      authApi.setToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await authApi.changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      logout,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
