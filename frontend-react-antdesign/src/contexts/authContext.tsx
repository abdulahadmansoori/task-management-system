import React, { createContext, useState, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Define the shape of the context value
interface AuthContextType {
  authenticated: boolean;
  login: (token: string) => boolean;
  logout: () => void;
  getRole: () => string;
  getCurrentUserId: () => number;
  token: string;
  role: string | null;
}

// Create the context with a default value of `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}


// // Function to decode JWT token
const getTokenData = (token) => {
  try {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } else {
      return ''
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>(Cookies.get('token') || '');
  const authenticated = !!token;

  const login = (t: string): boolean => {
    if (t !== '') {
      setToken(t);
      Cookies.set('token', t, { secure: true, sameSite: 'strict', expires: 1 });
      return true;
    }
    return false;
  };

  const getRole = (): string => {
    const data = getTokenData(token);
    return data.role;
  };
  const getCurrentUserId = (): number => {
    const data = getTokenData(token);
    return data.id;
  };

  const logout = (): void => {
    Cookies.remove('token');
    // setRole("");
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, token, getRole, getCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

