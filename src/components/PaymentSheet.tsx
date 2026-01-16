import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import PaymentMethodCard from './PaymentMethodCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
}

interface PaymentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  rideDetails: {
    pickup: string;
    destination: string;
    vehicleType: string;
  };
  onPaymentComplete: () => void;
}

const PaymentSheet: React.FC<PaymentSheetProps> = ({
  open,
  onOpenChange,
  amount,
  rideDetails,
  onPaymentComplete,
}) => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingMethods, setFetchingMethods] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPaymentMethods();
    }
  }, [open]);

  const fetchPaymentMethods = async () => {
    setFetchingMethods(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-methods');
      if (error) throw error;
      setPaymentMethods(data.paymentMethods || []);
      if (data.paymentMethods?.length > 0) {
        setSelectedMethod(data.paymentMethods[0].id);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setFetchingMethods(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-payment-method');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to add payment method',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount, rideDetails },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
        onPaymentComplete();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: 'Payment failed',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Payment</SheetTitle>
          <SheetDescription>
            Complete your ride payment
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Ride Summary */}
          <div className="p-4 rounded-xl bg-secondary/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">{rideDetails.vehicleType}</span>
              <span className="text-2xl font-bold text-foreground">${amount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {rideDetails.pickup} → {rideDetails.destination}
            </p>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Payment Method</h3>
            {fetchingMethods ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedMethod === method.id}
                    onSelect={() => setSelectedMethod(method.id)}
                  />
                ))}
                <button
                  onClick={handleAddPaymentMethod}
                  disabled={loading}
                  className="w-full p-4 rounded-xl border border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add payment method</span>
                </button>
              </div>
            )}
          </div>

          {/* Pay Button */}
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PaymentSheet;
