import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd verify the token with your backend
      try {
        // Decode token (simplified - in real app use jwt-decode library)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          email: payload.email,
          name: payload.name || payload.email,
          role: payload.role || 'learner'
        });
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return default values if not wrapped in AuthProvider
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      login: () => {},
      logout: () => {}
    };
  }
  return context;
};
