import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// Contexte d'authentification
const AuthContext = createContext();
// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// Fournisseur de contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/user/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);
// Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };
// Fonction d'inscription
  const signup = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed' 
      };
    }
  };
// Fonction de déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);
  };
// Valeurs fournies par le contexte
  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading
  };
// Rendu du fournisseur de contexte
  return (
    // Ne rendre les enfants que lorsque le chargement est terminé
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};