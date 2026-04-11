'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Camera, Loader2 } from 'lucide-react';

interface FacialVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFailure: () => void;
}

export function FacialVerificationDialog({
  isOpen,
  onOpenChange,
  onFailure,
}: FacialVerificationDialogProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let stream: MediaStream | null = null;
    let timeoutId: NodeJS.Timeout;
    
    const getCameraPermission = async () => {
      if (!isOpen) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Auto-fail after 3 seconds
        timeoutId = setTimeout(() => {
            onFailure();
        }, 3000);

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        // Trigger failure immediately if camera access is denied
        onFailure();
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
       if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen, onFailure]);
  
  React.useEffect(() => {
    if (!isOpen) {
      setHasCameraPermission(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Facial Verification</DialogTitle>
          <DialogDescription>
            Please position your face in the camera frame for verification.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
                    <Camera className="h-10 w-10" />
                    <p className="text-sm font-medium">Camera access denied</p>
                </div>
            )}
             {hasCameraPermission === null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Requesting camera...</p>
                </div>
            )}
          </div>
          {hasCameraPermission !== false && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Verifying...</p>
            </div>
          )}
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Camera access is required for verification.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
