import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected?: boolean;
  onSelect?: () => void;
}

const brandColors: Record<string, string> = {
  visa: 'text-blue-500',
  mastercard: 'text-orange-500',
  amex: 'text-blue-600',
  discover: 'text-orange-400',
};

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border transition-all ${
        isSelected 
          ? 'border-primary bg-primary/10' 
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${brandColors[method.brand] || 'text-muted-foreground'}`}>
          <CreditCard className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-foreground capitalize">
            {method.brand} •••• {method.last4}
          </p>
          {method.expMonth && method.expYear && (
            <p className="text-sm text-muted-foreground">
              Expires {method.expMonth}/{method.expYear}
            </p>
          )}
        </div>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};

export default PaymentMethodCard;
