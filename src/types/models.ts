export interface User {
  name: string;
  email: string;
  password: string | null;
}

export interface Transaction {
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  reoccuring: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  user: string;
}
