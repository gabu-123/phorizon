'use client';

import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransferForm } from '@/components/dashboard/payments/transfer-form';
import { useAccounts } from '@/contexts/accounts-context';
import type { Transaction } from '@/lib/mock-data';

export default function PaymentsPage() {
  const { accounts, handleNewTransaction } = useAccounts();

  const handleNewTransfer = (newTransaction: Transaction, fromAccountNumber: string) => {
    handleNewTransaction(newTransaction, fromAccountNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transfer Funds</h2>
          <p className="text-muted-foreground">
            Securely move money between your accounts or to an external account.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300">
          <Lock className="h-4 w-4" />
          <span>Secure & Encrypted Transfer</span>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Bank Transfer</CardTitle>
          <CardDescription>
            Please fill out the details below to initiate a transfer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransferForm onTransferSuccess={handleNewTransfer} accounts={accounts} />
        </CardContent>
      </Card>
    </div>
  );
}
