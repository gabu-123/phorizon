'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Account } from '@/lib/mock-data';
import { format } from 'date-fns';

type TransferData = {
    fromAccount: string;
    routingNumber: string;
    accountNumber: string;
    bankName: string;
    recipientName: string;
    amount: number;
    transferType: 'immediate' | 'scheduled' | 'recurring';
    scheduledDate?: Date;
    description?: string;
};

interface TransferSummaryProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  data: TransferData;
  fromAccount: Account | undefined;
}

export function TransferSummary({ isOpen, onOpenChange, onConfirm, data, fromAccount }: TransferSummaryProps) {
  const transferFee = 2.50;
  const amount = data.amount || 0;
  const totalDebit = amount + transferFee;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Your Transfer</DialogTitle>
          <DialogDescription>
            Please review the details below before confirming the transfer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex justify-between">
                <span className="text-muted-foreground">From</span>
                <span className="font-medium text-right">{fromAccount?.type} (...{fromAccount?.accountNumber.slice(-4)})</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">To</span>
                <div className="text-right">
                    <p className="font-medium">{data.recipientName}</p>
                    <p className="text-sm text-muted-foreground">{data.bankName}</p>
                    {data.routingNumber && <p className="text-sm text-muted-foreground">Routing: ...{data.routingNumber.slice(-4)}</p>}
                    {data.accountNumber && <p className="text-sm text-muted-foreground">Account: ...{data.accountNumber.slice(-4)}</p>}
                </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer Amount</span>
                <span className="font-medium">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer Fee</span>
                <span className="font-medium">{transferFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Debit</span>
                <span className="text-xl font-bold">{totalDebit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </div>
            
            <Separator />

             <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Arrival</span>
                <span className="font-medium">
                    {data.transferType === 'scheduled' && data.scheduledDate
                        ? format(data.scheduledDate, 'PPP')
                        : 'Within 24 hours'}
                </span>
            </div>
             {data.description && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span className="font-medium text-right">{data.description}</span>
                </div>
            )}
        </div>
        <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onConfirm}>Confirm Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
