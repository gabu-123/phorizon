'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UpdateLimitDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export function UpdateLimitDialog({ isOpen, onOpenChange, onSuccess }: UpdateLimitDialogProps) {
  const [otp, setOtp] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (otp === '349770') {
        onSuccess();
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid Code',
          description: 'The 2FA code is incorrect. Please try again.',
        });
        setOtp('');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  React.useEffect(() => {
    if(!isOpen) {
      setOtp('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Security Code</DialogTitle>
          <DialogDescription>
            To protect your account, please enter the 6-digit code sent to your device.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              type="button"
              onClick={handleVerify}
              className="w-full"
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Verifying...' : 'Confirm & Update'}
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  );
}
