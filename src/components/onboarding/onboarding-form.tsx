'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dob: z.string().refine((dob) => new Date(dob).toString() !== 'Invalid Date', 'Invalid date of birth'),
});

const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const securitySchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const formSchemas = [personalInfoSchema, contactInfoSchema, securitySchema];
type FormData = z.infer<typeof personalInfoSchema> & z.infer<typeof contactInfoSchema> & z.infer<typeof securitySchema>;

const steps = [
  { title: 'Personal Information', description: "Let's get to know you." },
  { title: 'Contact Information', description: 'How can we reach you?' },
  { title: 'Set Your Password', description: 'Secure your new account.' },
  { title: 'Verify Your Identity', description: 'For your security, please enter the 6-digit code sent to your device.' },
  { title: 'All Set!', description: 'Your account is ready.' },
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchemas[currentStep] || z.object({})),
    mode: 'onChange',
  });

  const processStep = async (data: Partial<FormData>) => {
    const result = formSchemas[currentStep].safeParse(data);
    if (!result.success) return;
    
    setCurrentStep(currentStep + 1);
  };
  
  const handleOtpVerify = () => {
    if (otp === '349770') {
      console.log('Onboarding data:', form.getValues());
      toast({
        title: 'Account Created!',
        description: 'Welcome to Horizon Bank.',
      });
      setCurrentStep(currentStep + 1);
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Code',
        description: 'The verification code is incorrect. Please try again.',
      });
      setOtp('');
    }
  };

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const renderFormStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <FormField name="firstName" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="lastName" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="dob" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="john.doe@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <FormField name="password" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center gap-4 pt-4">
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
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <CheckCircle className="h-24 w-24 text-green-500" />
            </motion.div>
            <p className="mt-4 text-lg font-medium">Redirecting to your new dashboard...</p>
          </div>
        )
      default:
        return null;
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Progress value={progress} className="mb-4" />
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processStep)}>
          <CardContent className="min-h-[250px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderFormStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          {currentStep < 3 && (
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack} disabled={currentStep === 0}>
                Back
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Next
              </Button>
            </CardFooter>
          )}
        </form>
        {currentStep === 3 && (
          <CardFooter className="flex justify-between">
             <Button type="button" variant="outline" onClick={onBack} disabled={currentStep === 0}>
              Back
            </Button>
            <Button
              type="button"
              onClick={handleOtpVerify}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={otp.length !== 6}
            >
              Verify & Create Account
            </Button>
          </CardFooter>
        )}
      </Form>
    </Card>
  );
}
