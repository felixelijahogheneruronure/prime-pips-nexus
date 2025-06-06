
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  wallets: {
    USDC: number;
    BTC: number;
    ETH: number;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('primePipsUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for admin credentials
    if (email === 'admin@primepips.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-001',
        email: 'admin@primepips.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        wallets: { USDC: 10000, BTC: 1, ETH: 10 },
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      localStorage.setItem('primePipsUser', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }

    // Check for demo user
    if (email === 'demo@primepips.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'user-001',
        email: 'demo@primepips.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        wallets: { USDC: 100, BTC: 0, ETH: 0 },
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      localStorage.setItem('primePipsUser', JSON.stringify(demoUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      role: 'user',
      wallets: { USDC: 100, BTC: 0, ETH: 0 }, // Welcome bonus
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('primePipsUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('primePipsUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
