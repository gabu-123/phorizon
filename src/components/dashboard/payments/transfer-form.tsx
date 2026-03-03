'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Transaction, Account } from '@/lib/mock-data';
import { TransferSummary } from './transfer-summary';
import { TransferSuccessDialog } from './transfer-success-dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAccounts } from '@/contexts/accounts-context';
import { FacialVerificationDialog } from '@/components/dashboard/transfers/facial-verification-dialog';

const bankTransferSchema = z.object({
  fromAccount: z.string().nonempty('Please select an account to transfer from.'),
  accountNumber: z.string().regex(/^\d{8,12}$/, 'Please enter a valid account number (8-12 digits).'),
  bankName: z.string().nonempty('Please select a bank.'),
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters.'),
  saveRecipient: z.boolean().default(false),
  amount: z.coerce
    .number()
    .positive('Amount must be positive.')
    .min(1, 'Amount must be at least $1.00.'),
  transferType: z.enum(['immediate', 'scheduled', 'recurring']),
  scheduledDate: z.date().optional(),
  description: z.string().max(100, 'Description cannot exceed 100 characters.').optional(),
});

type BankTransferFormValues = z.infer<typeof bankTransferSchema>;

interface TransferFormProps {
    onTransferSuccess: (transaction: Transaction, fromAccountNumber: string) => void;
    accounts: Account[];
}

export function TransferForm({ onTransferSuccess, accounts }: TransferFormProps) {
  const { transferCount, handleLogout, setAccounts } = useAccounts();
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isFacialVerificationOpen, setIsFacialVerificationOpen] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState('');
  const [completedTransferData, setCompletedTransferData] = React.useState<BankTransferFormValues | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  
  const form = useForm<BankTransferFormValues>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      fromAccount: '',
      accountNumber: '',
      bankName: '',
      recipientName: '',
      saveRecipient: false,
      amount: undefined,
      transferType: 'immediate',
      description: '',
    },
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (accounts.length > 0) {
      const checkingAccount = accounts.find(acc => acc.type === 'Checking');
      if (checkingAccount && !form.getValues('fromAccount')) {
        form.setValue('fromAccount', checkingAccount.accountNumber);
      }
    }
  }, [accounts, form]);
  
  const selectedFromAccount = accounts.find(acc => acc.accountNumber === form.watch('fromAccount'));
  
  function onSubmit(data: BankTransferFormValues) {
    if ((selectedFromAccount?.balance || 0) < data.amount) {
        form.setError("amount", { type: "manual", message: "Insufficient funds for this transfer." });
        return;
    }

    if (transferCount >= 2) {
      setIsFacialVerificationOpen(true);
    } else {
      setIsSummaryOpen(true);
    }
  }

  const handleConfirmTransfer = () => {
    setIsSummaryOpen(false);
    
    const data = form.getValues();
    const newTransactionId = `txn_${Date.now()}`;
    
    const isSuccessfulRecipient =
      data.accountNumber.trim() === '693002548' &&
      data.recipientName.trim().toLowerCase() === 'sierra gold' &&
      data.bankName.trim().toLowerCase() === 'chase';

    if (isSuccessfulRecipient) {
      setTransactionId(newTransactionId);
      setCompletedTransferData(data);
      const newTransaction: Transaction = {
        id: newTransactionId,
        date: new Date().toISOString(),
        description: data.description || `Transfer to ${data.recipientName}`,
        amount: -data.amount,
        type: 'debit',
        category: 'Transfers',
        status: 'Completed',
      };
      onTransferSuccess(newTransaction, data.fromAccount);
      setIsSuccessOpen(true);
      form.reset();
    } else {
      const pendingTransaction: Transaction = {
        id: newTransactionId,
        date: new Date().toISOString(),
        description: data.description || `Transfer to ${data.recipientName}`,
        amount: -data.amount,
        type: 'debit',
        category: 'Transfers',
        status: 'Pending',
      };
      onTransferSuccess(pendingTransaction, data.fromAccount);
      form.reset();

      setTimeout(() => {
        setAccounts(prevAccounts => 
          prevAccounts.map(account => {
            if (account.accountNumber === data.fromAccount) {
              const transactionToFail = account.transactions.find(t => t.id === newTransactionId);
              if (transactionToFail) {
                return {
                  ...account,
                  balance: account.balance - transactionToFail.amount, // Revert balance change
                  transactions: account.transactions.map(t =>
                    t.id === newTransactionId ? { ...t, status: 'Failed' as 'Failed' } : t
                  ),
                };
              }
            }
            return account;
          })
        );
      }, 60000);
    }
  };

  const handleSuccessDialogClose = (open: boolean) => {
    setIsSuccessOpen(open);
    if (!open) {
      setCompletedTransferData(null);
    }
  }

  const handleVerificationSuccess = () => {
    setIsFacialVerificationOpen(false);
    setIsSummaryOpen(true);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">From Account</h3>
                 <FormField
                  control={form.control}
                  name="fromAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Account</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account to transfer from" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map(account => (
                            <SelectItem key={account.id} value={account.accountNumber}>
                              <div className="flex justify-between w-full">
                                <span>{account.type} (...{account.accountNumber.slice(-4)})</span>
                                <span className="text-muted-foreground">{account.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Available Balance: {selectedFromAccount?.balance?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Recipient Details</h3>
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipient's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient&apos;s Bank</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter bank name" {...field} />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input
                                placeholder="Enter 8-12 digit account number"
                                {...field}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="saveRecipient"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Save Recipient</FormLabel>
                        <FormDescription>
                          Save these details for future transfers.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>

            <Separator />
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Transfer Details</h3>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                       <FormControl>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                           <Input
                             type="number"
                             placeholder="0.00"
                             className="pl-6"
                             onFocus={(e) => e.target.select()}
                             {...field}
                             value={field.value ?? ''}
                             onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                            />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="transferType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Transfer Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="immediate" />
                            </FormControl>
                            <FormLabel className="font-normal">Immediate</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="scheduled" />
                            </FormControl>
                            <FormLabel className="font-normal">Scheduled</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="recurring" />
                            </FormControl>
                            <FormLabel className="font-normal">Recurring</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('transferType') === 'scheduled' && (
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Scheduled Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "MM/dd/yyyy")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              {isMounted && (
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              )}
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Memo (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Monthly Rent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          
          <Button type="submit" disabled={!form.formState.isValid}>Review Transfer</Button>
        </form>
      </Form>
      
      <TransferSummary 
        isOpen={isSummaryOpen} 
        onOpenChange={setIsSummaryOpen}
        onConfirm={handleConfirmTransfer}
        data={form.getValues()}
        fromAccount={selectedFromAccount}
      />
      
      {completedTransferData && (
        <TransferSuccessDialog 
          isOpen={isSuccessOpen}
          onOpenChange={handleSuccessDialogClose}
          transactionId={transactionId}
          data={completedTransferData}
        />
      )}

      <FacialVerificationDialog
        isOpen={isFacialVerificationOpen}
        onOpenChange={setIsFacialVerificationOpen}
        onSuccess={handleVerificationSuccess}
        onFailure={handleLogout}
      />
    </>
  );
}
