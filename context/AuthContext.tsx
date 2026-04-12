'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OperatorInfo {
  id: string;
  name: string;
  email: string;
  companyName: string;
  tier: string;
}

interface AuthContextType {
  token: string | null;
  operator: OperatorInfo | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [operator, setOperator] = useState<OperatorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      const savedOperator = localStorage.getItem('operator');
      if (savedOperator) {
        setOperator(JSON.parse(savedOperator));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setOperator(data.operator);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('operator', JSON.stringify(data.operator));
 
  // Also set cookie so middleware can read it
  document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};
  const register = async (data: any) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    setToken(result.token);
    setOperator(result.operator);
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('operator', JSON.stringify(result.operator));
  document.cookie = `authToken=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};
  

const logout = () => {
  setToken(null);
  setOperator(null);
  localStorage.removeItem('authToken');
  localStorage.removeItem('operator');
  document.cookie = 'authToken=; path=/; max-age=0';
};

  return (
    <AuthContext.Provider
      value={{
        token,
        operator,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
