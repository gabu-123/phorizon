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
import { CheckCircle2, Copy, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';

type TransferData = {
    recipientName: string;
    amount: number;
};

interface TransferSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transactionId: string;
  data: TransferData;
  status: 'Completed' | 'Pending' | 'Failed';
}

export function TransferSuccessDialog({ isOpen, onOpenChange, transactionId, data, status }: TransferSuccessDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionId);
    toast({ title: 'Copied!', description: 'Transaction ID copied to clipboard.' });
  };

  const getTitle = () => {
    if (status === 'Completed') return 'Transfer Successful';
    if (status === 'Pending') return 'Transfer Pending';
    return 'Transfer Failed';
  };

  const getDescription = () => {
    if (status === 'Completed') {
        return (
            <>
                You have successfully sent{' '}
                <span className="font-bold text-foreground">
                {data.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>{' '}
                to <span className="font-bold text-foreground">{data.recipientName}</span>.
            </>
        )
    }
    if (status === 'Pending') {
        return (
            <>
                Your transfer of{' '}
                <span className="font-bold text-foreground">
                {data.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>{' '}
                to <span className="font-bold text-foreground">{data.recipientName}</span> is pending.
            </>
        )
    }
    return (
        <>
            Your transfer of{' '}
            <span className="font-bold text-foreground">
            {data.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>{' '}
            to <span className="font-bold text-foreground">{data.recipientName}</span> has failed.
        </>
    )
  };

  const getIcon = () => {
    if (status === 'Completed') return <CheckCircle2 className="h-16 w-16 text-green-500" />;
    if (status === 'Pending') return <Clock className="h-16 w-16 text-yellow-500 animate-pulse" />;
    return <AlertTriangle className="h-16 w-16 text-destructive" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center">
            {getIcon()}
          </div>
          <DialogTitle className="text-center text-2xl">{getTitle()}</DialogTitle>
          <DialogDescription className="text-center">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-center text-sm text-muted-foreground">Transaction Reference ID</p>
            <div className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-muted p-3 font-mono text-sm">
                <span>{transactionId}</span>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
