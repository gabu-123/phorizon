'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccounts } from "@/contexts/accounts-context";
import { useToast } from "@/hooks/use-toast";

export function SecuritySettings() {
    const { transferCount, resetTransferCount } = useAccounts();
    const { toast } = useToast();

    const handleReset = () => {
        resetTransferCount();
        toast({
            title: "Transfer Count Reset",
            description: "The transfer counter has been successfully reset to 0.",
        });
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                        <p className="font-medium">Reset Transfer Counter</p>
                        <p className="text-sm text-muted-foreground">
                            Your account will be locked after 3 transfer attempts. Your current count is {transferCount}.
                        </p>
                    </div>
                    <Button onClick={handleReset} variant="outline">
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
