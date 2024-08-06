import { createContext, useContext } from 'react';

import { User } from '@/types/models';

type LocalStorageProviderProps = {
  children: React.ReactNode;
};

type LocalStorageProviderState = {
  addUser: (user: User) => void;
  getUsers: () => User[];
};

const initialState: LocalStorageProviderState = {
  addUser: () => null,
  getUsers: () => [],
};

const LocalStorageContext =
  createContext<LocalStorageProviderState>(initialState);

export function LocalStorageProvider({ children }: LocalStorageProviderProps) {
  const get = (key: string) => localStorage.getItem(key);
  const set = (key: string, value: string) => localStorage.setItem(key, value);
  const remove = (key: string) => localStorage.removeItem(key);

  const value = {
    getUsers: () => {
      const users = get('users');
      return users ? JSON.parse(users) : [];
    },
    addUser: (user: User) => {
      const users = value.getUsers();
      users.push(user);
      set('users', JSON.stringify(users));
    },
  };

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
}

export function useLocalStorage() {
  const context = useContext(LocalStorageContext);

  if (!context) {
    throw new Error(
      'useLocalStorage must be used within a LocalStorageProvider'
    );
  }

  return context;
}
