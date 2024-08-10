import { createContext, useContext, useState } from 'react';

import { Transaction, User } from '@/types/models';

type LocalStorageProviderProps = {
  children: React.ReactNode;
};

type LocalStorageProviderState = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  addUser: (user: User) => void;
  getUsers: () => User[];
  getTransactions: () => Transaction[];
  getTransactionsOfUser: (email: string) => Transaction[];
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transaction: Transaction) => void;
  addLoggedInUser: (user: User) => void;
  getLoggedInUser: () => User | null;
  removeLoggedInUser: () => void;
};

const initialState: LocalStorageProviderState = {
  currentPage: 'Budget Tracker',
  setCurrentPage: () => null,
  addUser: () => null,
  getUsers: () => [],
  getTransactions: () => [],
  getTransactionsOfUser: () => [],
  addTransaction: () => null,
  editTransaction: () => null,
  deleteTransaction: () => null,
  addLoggedInUser: () => null,
  getLoggedInUser: () => null,
  removeLoggedInUser: () => null,
};

const LocalStorageContext =
  createContext<LocalStorageProviderState>(initialState);

export function LocalStorageProvider({ children }: LocalStorageProviderProps) {
  const [currentPage, setCurrentPage] = useState('Budget Tracker');
  const get = (key: string) => localStorage.getItem(key);
  const set = (key: string, value: string) => localStorage.setItem(key, value);
  const remove = (key: string) => localStorage.removeItem(key);

  const value = {
    currentPage,
    setCurrentPage,
    getUsers: () => {
      const users = get('users');
      return users ? JSON.parse(users) : [];
    },
    addUser: (user: User) => {
      const users = value.getUsers();
      users.push(user);
      set('users', JSON.stringify(users));
    },
    getTransactions: () => {
      const transactions = get('transactions');
      return transactions ? JSON.parse(transactions) : [];
    },
    getTransactionsOfUser: (email: string) => {
      const transactions = value.getTransactions();
      return transactions.filter(
        (transaction: Transaction) => transaction.user === email
      );
    },
    addTransaction: (transaction: Transaction) => {
      const transactions = value.getTransactions();
      transactions.push(transaction);
      set('transactions', JSON.stringify(transactions));
    },
    editTransaction: (transaction: Transaction) => {
      const transactions = value.getTransactions();
      const index = transactions.findIndex((t) => t.id === transaction.id);
      transactions[index] = transaction;
      set('transactions', JSON.stringify(transactions));
    },
    deleteTransaction: (transaction: Transaction) => {
      const transactions = value.getTransactions();
      const index = transactions.findIndex((t) => t.id === transaction.id);
      transactions.splice(index, 1);
      set('transactions', JSON.stringify(transactions));
    },
    addLoggedInUser: (user: User) => {
      set('loggedInUser', JSON.stringify(user));
    },
    getLoggedInUser: () => {
      const user = get('loggedInUser');
      return user ? JSON.parse(user) : null;
    },
    removeLoggedInUser: () => {
      remove('loggedInUser');
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
