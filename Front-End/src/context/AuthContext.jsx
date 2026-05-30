import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Decodes a JWT token payload without a library.
 * Returns null if the token is invalid or expired.
 */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    // Convert Base64Url to Base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Handle padding
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    
    // Decode handling UTF-8 characters
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
}

/**
 * Extracts user-friendly info from JWT claims.
 */
function getUserFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
    email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
    role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
  };
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // On mount, check localStorage for an existing valid token
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const userData = getUserFromToken(savedToken);
      if (userData) {
        setToken(savedToken);
        setUser(userData);
      } else {
        // Token is expired or invalid — clean up
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(getUserFromToken(jwtToken));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
