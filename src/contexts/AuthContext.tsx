
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'student' | 'donor' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, userType: User['userType']) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'maria@student.com',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    userType: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b407?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '2',
    email: 'john@donor.com',
    firstName: 'John',
    lastName: 'Smith',
    userType: 'donor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '3',
    email: 'admin@edufund.com',
    firstName: 'Admin',
    lastName: 'User',
    userType: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login - find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, userType: User['userType']) => {
    // Mock signup - create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      firstName,
      lastName,
      userType,
      avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b407?auto=format&fit=crop&w=150&h=150&q=80`
    };
    mockUsers.push(newUser);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
