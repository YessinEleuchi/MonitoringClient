import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { login as loginApi } from '../services/authService';

interface JWTPayload {
  sub: string;  // usually the email
  exp: number;
  iat?: number;
}

interface User {
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Optional: check expiration before restoring session
      const decoded: JWTPayload = jwtDecode(parsed.token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser(parsed);
      } else {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await loginApi({ username: email, password });
      const token = response.data.access_token;

      const decoded: JWTPayload = jwtDecode(token);

      const userData: User = {
        email: decoded.sub,
        token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
      <AuthContext.Provider value={{ user, login, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
  );
};
