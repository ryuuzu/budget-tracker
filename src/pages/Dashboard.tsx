import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/components/contexts/auth-provider';
import { useLocalStorage } from '@/components/contexts/localstorage-provider';
import AddTransactionForm from '@/components/custom/AddTransactionForm';
import HomeComponent from '@/components/custom/HomeComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Transaction } from '@/types/models';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshData, setRefreshData] = useState(false);
  const refresh = () => setRefreshData(true);
  const { user } = useAuth();
  const { getTransactionsOfUser } = useLocalStorage();

  // Fetch data when user is available
  useEffect(() => {
    if (user) {
      const transactions = getTransactionsOfUser(user.email);
      setTransactions(transactions);
    }
  }, [user, getTransactionsOfUser]);

  // Refresh data when user changes
  useEffect(() => {
    if (refreshData && user) {
      const transactions = getTransactionsOfUser(user.email);
      setTransactions(transactions);
      setRefreshData(false);
    }
  }, [refreshData, user, getTransactionsOfUser]);

  // Hook to calculate total income
  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  // Hook to calculate total expense
  const totalExpense = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  // Hook to calculate balance
  const balance = useMemo(
    () => totalIncome - totalExpense,
    [totalIncome, totalExpense]
  );

  const [isAddPageOpen, setIsAddPageOpen] = useState(false);

  const openAddPage = () => setIsAddPageOpen(true);
  const closeAddPage = () => setIsAddPageOpen(false);

  return (
    <div>
      <Card>
        <CardContent className="flex items-center justify-between gap-2 p-4">
          <div className="flex flex-col gap-1 p-1 text-center md:px-2 xl:gap-2 xl:px-3">
            <div className="font-medium">Total Income</div>
            <div className="text-2xl font-bold">{totalIncome}</div>
          </div>
          <Separator orientation="vertical" className="h-5 xl:h-8" />
          <div className="flex flex-col gap-1 p-1 text-center md:px-2 xl:gap-2 xl:px-3">
            <div className="font-medium">Total Expense</div>
            <div className="text-2xl font-bold">{totalExpense}</div>
          </div>
          <Separator orientation="vertical" className="h-5 xl:h-8" />
          <div className="flex flex-col gap-1 p-1 text-center md:px-2 xl:gap-2 xl:px-3">
            <div className="font-medium">Balance</div>
            <div className="text-2xl font-bold">{balance}</div>
          </div>
        </CardContent>
      </Card>
      <Separator className="my-4" />
      {isAddPageOpen ? (
        <AddTransactionForm refreshFunc={refresh} closeAddPage={closeAddPage} />
      ) : (
        <HomeComponent openAddPage={openAddPage} transactions={transactions} />
      )}
    </div>
  );
};

export default Dashboard;
