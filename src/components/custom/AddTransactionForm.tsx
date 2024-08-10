import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types/models';

import { useAuth } from '../contexts/auth-provider';
import { useLocalStorage } from '../contexts/localstorage-provider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { DatePicker } from './DatePicker';

type AddTransactionFormProps = {
  mode: string;
  refreshFunc: () => void;
  closeAddPage: () => void;
  activeTransaction?: Transaction;
};

const transactionFormSchema = z.object({
  name: z.string(),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  date: z.date(),
  type: z.enum(['income', 'expense']),
  reoccuring: z.enum(['one-time', 'daily', 'weekly', 'monthly', 'yearly']),
  category: z.string(),
});

const AddTransactionForm = ({
  mode = 'create',
  refreshFunc,
  closeAddPage,
  activeTransaction,
}: AddTransactionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addTransaction, editTransaction } = useLocalStorage();

  const transactionForm = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      type: 'income',
      reoccuring: 'one-time',
      ...activeTransaction,
      date: activeTransaction ? new Date(activeTransaction.date) : new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof transactionFormSchema>) => {
    if (!user) return;
    if (mode === 'edit' && activeTransaction) {
      editTransaction({
        ...activeTransaction,
        ...values,
        date: values.date.toISOString(),
      });
      toast({
        title: 'Transaction Updated',
        description: 'Transaction has been updated successfully',
      });
    } else {
      addTransaction({
        ...values,
        date: values.date.toISOString(),
        user: user.email,
        id: uuidv4(),
      });
      toast({
        title: 'Transaction Added',
        description: 'Transaction has been added successfully',
      });
    }
    refreshFunc();
    closeAddPage();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <Form {...transactionForm}>
          <form
            onSubmit={transactionForm.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={transactionForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={transactionForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1000"
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={transactionForm.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={transactionForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Transaction Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={transactionForm.control}
              name="reoccuring"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reoccuring</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={transactionForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Eating Out" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <fieldset className="space-x-2">
              <Button
                type="button"
                variant={'secondary'}
                onClick={() => {
                  closeAddPage();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
