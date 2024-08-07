import { createContext, useContext, useState } from 'react';

import { User } from '@/types/models';

import { useLocalStorage } from './localstorage-provider';

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderState = {
  user: User | null;
  loginUser: (email: string, password: string) => void;
  registerUser: (name: string, email: string, password: string) => void;
  logoutUser: () => void;
};

const initialState: AuthProviderState = {
  user: null,
  loginUser: () => null,
  registerUser: () => null,
  logoutUser: () => null,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    getUsers,
    addUser,
    addLoggedInUser,
    getLoggedInUser,
    removeLoggedInUser,
  } = useLocalStorage();

  const [user, setUser] = useState<User | null>(getLoggedInUser());

  const loginUser = (email: string, password: string) => {
    const users = getUsers();
    const user = users.find((user) => user.email === email);

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password.');
    }

    setUser({ ...user, password: null });
    addLoggedInUser({ ...user, password: null });
  };

  const registerUser = (name: string, email: string, password: string) => {
    const users = getUsers();

    if (users.some((user) => user.email === email)) {
      throw new Error('User already exists');
    }

    addUser({ name, email, password });

    setUser({ name, email, password: null });
    addLoggedInUser({ name, email, password: null });
  };

  const logoutUser = () => {
    setUser(null);
    removeLoggedInUser();
  };

  const value = {
    user,
    loginUser,
    registerUser,
    logoutUser,
  };

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthProviderContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
