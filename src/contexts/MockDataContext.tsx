
import React, { createContext, useContext, useState } from 'react';

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  userType: 'student' | 'donor' | 'admin';
  avatar?: string;
}

interface MockDataContextType {
  currentUser: MockUser;
  setCurrentUser: (user: MockUser) => void;
  mockUsers: MockUser[];
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'student@example.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    username: 'alexj2024',
    userType: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b407?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '2',
    email: 'donor@example.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    userType: 'donor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '3',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    userType: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<MockUser>(mockUsers[0]); // Default to student user

  const value: MockDataContextType = {
    currentUser,
    setCurrentUser,
    mockUsers,
  };

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
};

export const useMockData = (): MockDataContextType => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
};
