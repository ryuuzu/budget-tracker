import { DialogClose } from '@radix-ui/react-dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types/models';

import { useLocalStorage } from '../contexts/localstorage-provider';
import { Input } from '../ui/input';
import { DataTable } from './DataTable';
import { DatePickerWithRange } from './DatePickerRange';

type HomeComponentProps = {
  openAddPage: () => void;
  openEditPage: (transaction: Transaction) => void;
  transactions: Transaction[];
  refreshFunc: () => void;
};

const HomeComponent = ({
  openAddPage,
  transactions,
  openEditPage,
  refreshFunc,
}: HomeComponentProps) => {
  const { deleteTransaction } = useLocalStorage();
  const [searchText, setSearchText] = useState('');
  const [transactionFilters, setTransactionFilters] = useState<{
    dateRange: DateRange | undefined;
    type: 'income' | 'expense' | null;
    reoccuring: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  }>({
    dateRange: undefined,
    type: null,
    reoccuring: null,
  });

  // Columnds for the transaction data table
  const transactionColumns: ColumnDef<Transaction>[] = [
    // { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const dateString = row.getValue('date') as string;
        return format(new Date(dateString), 'PPP');
      },
    },
    { accessorKey: 'amount', header: 'Amount' },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const typeValue = row.getValue('type') as 'income' | 'expense';
        return typeValue === 'income' ? 'Income' : 'Expense';
      },
    },
    {
      accessorKey: 'reoccuring',
      header: 'Reoccuring',
      cell: ({ row }) => {
        const reoccuringValue = row.getValue('reoccuring') as
          | 'one-time'
          | 'daily'
          | 'weekly'
          | 'monthly'
          | 'yearly';
        return reoccuringValue === 'one-time'
          ? 'One Time'
          : reoccuringValue.charAt(0).toUpperCase() + reoccuringValue.slice(1);
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div className="space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => openEditPage(transaction)}
            >
              <span className="sr-only">Open menu</span>
              <Pencil className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the transaction.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteTransaction(transaction);
                        refreshFunc();
                      }}
                    >
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  // Filtering transactions based on search text, date range, transaction type and reoccuring mode
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filtering based on search text
      if (
        searchText &&
        !transaction.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      // Filtering based on date range
      if (
        transactionFilters.dateRange &&
        ((transactionFilters.dateRange.from &&
          new Date(transaction.date) < transactionFilters.dateRange.from) ||
          (transactionFilters.dateRange.to &&
            new Date(transaction.date) > transactionFilters.dateRange.to))
      ) {
        return false;
      }

      // Filtering based on transaction type
      if (
        transactionFilters.type &&
        transaction.type !== transactionFilters.type
      ) {
        return false;
      }

      // Filtering based on reoccuring mode
      if (
        transactionFilters.reoccuring &&
        transaction.reoccuring !== transactionFilters.reoccuring
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, searchText, transactionFilters]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button onClick={openAddPage} className="space-x-1 md:space-x-2">
          <PlusIcon />
          Add
        </Button>
      </div>
      <div className="filters grid grid-cols-3 gap-2">
        <div className="col-span-3">
          <DatePickerWithRange
            dateRange={transactionFilters.dateRange}
            onDateRangeChange={(dateRange) => {
              setTransactionFilters({
                ...transactionFilters,
                dateRange,
              });
            }}
          />
        </div>
        <div>
          <Select
            onValueChange={(value) => {
              setTransactionFilters({
                ...transactionFilters,
                type: value as 'income' | 'expense',
              });
            }}
            value={transactionFilters.type ?? ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            onValueChange={(value) => {
              setTransactionFilters({
                ...transactionFilters,
                reoccuring: value as
                  | 'one-time'
                  | 'daily'
                  | 'weekly'
                  | 'monthly'
                  | 'yearly',
              });
            }}
            value={transactionFilters.reoccuring ?? ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Reoccuring Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-time">One Time</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            className="h-full w-full"
            onClick={() => {
              setTransactionFilters({
                dateRange: undefined,
                type: null,
                reoccuring: null,
              });
            }}
          >
            <CrossCircledIcon />
            Reset Filters
          </Button>
        </div>
      </div>
      <DataTable
        columns={transactionColumns}
        // Sorting transactions based on date in descending order
        data={filteredTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )}
      />
    </div>
  );
};

export default HomeComponent;
