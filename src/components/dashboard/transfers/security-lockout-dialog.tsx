'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface SecurityLockoutDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function SecurityLockoutDialog({ isOpen, onConfirm }: SecurityLockoutDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
            <div className="flex justify-center mb-2">
                <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">ACCOUNT RESTRICTED</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 py-2 text-center text-foreground">
                <p className="text-sm font-medium">
                    We’ve detected unusual activity on your account from this device. For your protection, access has been temporarily restricted.
                </p>
                <p className="text-sm">
                    To restore full access, please visit your nearest branch or complete the verification process through your secure dashboard.
                </p>
                <div className="space-y-1 rounded-md border bg-muted p-4 text-left text-xs font-mono">
                    <p className="font-bold">Reference Code: SEC-48291</p>
                    <p><span className="font-semibold">Action Required:</span> In-person verification or identity confirmation</p>
                </div>
                <p className="text-sm text-muted-foreground italic">
                    If this was you, no further action may be needed after verification. If this was not you, please contact support immediately.
                </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={onConfirm} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
