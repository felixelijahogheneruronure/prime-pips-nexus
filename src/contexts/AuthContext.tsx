
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsers, updateUsers, hashPassword, verifyPassword } from '@/utils/jsonbin-api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  tier: number;
  status: 'active' | 'suspended' | 'banned';
  wallets: {
    USDC: number;
    BTC: number;
    ETH: number;
    BCH: number;
    BNB: number;
    USDC_TOKEN: number;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUserData: (userData: Partial<User>) => void;
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

  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('primePipsUser', JSON.stringify(updatedUser));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      // Fetch users from the specific JSONBin
      const users = await fetchUsers();
      console.log('Fetched users:', users);
      
      const foundUser = users.find((u: any) => u.email === email);

      if (foundUser && verifyPassword(password, foundUser.passwordHash)) {
        const { passwordHash, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('primePipsUser', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        console.log('Login successful for:', email);
        return true;
      }

      console.log('Login failed for:', email);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting registration for:', email);
      
      // Fetch existing users from the specific JSONBin
      const users = await fetchUsers();
      console.log('Existing users:', users);
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        console.log('User already exists:', email);
        setIsLoading(false);
        return false;
      }

      // Create new user with expanded wallet support
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        role: 'user' as const,
        tier: 1,
        status: 'active' as const,
        wallets: { 
          USDC: 100, // Welcome bonus
          BTC: 0, 
          ETH: 0,
          BCH: 0,
          BNB: 0,
          USDC_TOKEN: 0
        },
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword(password)
      };

      // Update users array in the specific JSONBin
      const updatedUsers = [...users, newUser];
      await updateUsers(updatedUsers);
      console.log('User registered successfully:', email);

      // Set user (without password hash)
      const { passwordHash, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('primePipsUser', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('primePipsUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
