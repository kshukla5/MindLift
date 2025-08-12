import { useMemo } from 'react';

const decodeToken = (token) => {
  try {
    // Basic check for JWT structure
    if (token.split('.').length !== 3) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

/**
 * A hook to get authentication status and user info from the JWT in localStorage.
 * It uses useMemo to avoid re-calculating on every render.
 */
export const useAuth = () => {
  const token = localStorage.getItem('token');

  return useMemo(() => {
    if (!token) {
      return { token: null, user: null, isAuthenticated: false, isAdmin: false, isSpeaker: false };
    }

    const user = decodeToken(token);

    if (!user) {
      return { token: null, user: null, isAuthenticated: false, isAdmin: false, isSpeaker: false };
    }

    return {
      token, user, isAuthenticated: true, isAdmin: user.role === 'admin', isSpeaker: user.role === 'speaker',
    };
  }, [token]);
};