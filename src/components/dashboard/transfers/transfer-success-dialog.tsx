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
import { Separator } from '@/components/ui/separator';

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
    if (status === 'Completed') return `Your transfer to ${data.recipientName} has been completed.`;
    if (status === 'Pending') return `Your transfer to ${data.recipientName} is being processed.`;
    return `Your transfer to ${data.recipientName} could not be completed.`;
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
            {getDescription().split(data.recipientName).map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="font-bold text-foreground">{data.recipientName}</span>}
              </React.Fragment>
            ))}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="text-center">
                 <p className="text-sm text-muted-foreground">Amount Transferred</p>
                 <p className="text-3xl font-bold text-foreground">
                    {data.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>
            <Separator />
            <div>
                <p className="text-center text-sm text-muted-foreground">Transaction Reference ID</p>
                <div className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-muted p-3 font-mono text-sm">
                    <span>{transactionId}</span>
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
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
import * as React from 'react';
