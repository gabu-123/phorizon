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
      <AlertDialogContent>
        <AlertDialogHeader>
            <div className="flex justify-center">
                <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          <AlertDialogTitle className="text-center text-2xl">ACCOUNT RESTRICTED</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-3 py-2 text-center text-sm">
                <p>
                    We’ve detected unusual activity on your account from this device. For your protection, access has been temporarily restricted.
                </p>
                <p>
                    To restore full access, please visit your nearest branch or complete the verification process through your secure dashboard.
                </p>
                <div className="space-y-1 rounded-md border bg-muted p-3 text-left text-xs">
                    <p className="font-mono">Reference Code: SEC-48291</p>
                    <p><span className="font-semibold">Action Required:</span> In-person verification or identity confirmation</p>
                </div>
                <p>
                    If this was you, no further action may be needed after verification. If this was not you, please contact support immediately.
                </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm} className="w-full">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
