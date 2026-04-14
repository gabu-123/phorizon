'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('angelinajolie50@outlook.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const { toast } = useToast();
  const [correctPassword, setCorrectPassword] = useState('Jolie50pass50.');

  useEffect(() => {
    // Check if a new password has been set due to a security lockout.
    const newPassword = localStorage.getItem('horizon-bank-password');
    if (newPassword) {
      setCorrectPassword(newPassword);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'angelinajolie50@outlook.com' && password === correctPassword) {
      setLoginError('');
      setIsOtpOpen(true);
    } else {
      setLoginError('You have entered an incorrect password.');
    }
  };

  const handleOtpVerify = () => {
    if (otp === '349770') {
      toast({
        title: 'Sign In Successful',
        description: 'Welcome back!',
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Code',
        description: 'The verification code is incorrect. Please try again.',
      });
      setOtp('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-12 flex justify-center">
            <div className="flex flex-col items-center font-sans">
                <div className="relative">
                    <h1 className="text-5xl font-bold" style={{'letterSpacing': '0.1em', color: '#3a3a3a'}}>HORIZON</h1>
                    <svg width="220" height="20" className="absolute -bottom-2 -left-2">
                        <path d="M 0 15 Q 110 -15, 220 15" stroke="hsl(var(--primary))" fill="transparent" strokeWidth="4"/>
                    </svg>
                </div>
                <p className="text-xl font-semibold" style={{'letterSpacing': '0.22em', color: '#3a3a3a'}}>BANK</p>
            </div>
        </div>

        {loginError && (
          <Alert variant="destructive" className="mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="ml-2">
              {loginError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-gray-700">Login ID</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-12 border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-semibold text-gray-600 hover:text-gray-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <div className="flex flex-col gap-4 pt-2">
              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Log In
              </Button>
              <Link
                href="#"
                className="text-center text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
          </div>
        </form>
      </div>

      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter OTP Code</DialogTitle>
            <DialogDescription>
              We have sent an OTP code to your email. Please enter the code
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
              onClick={handleOtpVerify}
              className="w-full"
              disabled={otp.length !== 6}
            >
              Verify & Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
