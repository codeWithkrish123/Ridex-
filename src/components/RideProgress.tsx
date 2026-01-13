import React from 'react';
import { Check, MapPin, Navigation, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RideProgressProps {
  status: 'searching' | 'matched' | 'arriving' | 'inProgress' | 'completed';
  pickup: string;
  destination: string;
}

const statuses = [
  { key: 'searching', label: 'Finding driver' },
  { key: 'matched', label: 'Driver assigned' },
  { key: 'arriving', label: 'Driver arriving' },
  { key: 'inProgress', label: 'In ride' },
  { key: 'completed', label: 'Arrived' },
];

const RideProgress: React.FC<RideProgressProps> = ({ status, pickup, destination }) => {
  const currentIndex = statuses.findIndex(s => s.key === status);

  return (
    <div className="card-3d p-6">
      {/* Status timeline */}
      <div className="flex items-center justify-between mb-8">
        {statuses.map((s, index) => (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                index < currentIndex 
                  ? "bg-primary text-primary-foreground"
                  : index === currentIndex 
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                    : "bg-secondary text-muted-foreground"
              )}>
                {index < currentIndex ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-xs mt-2 text-center max-w-[60px]",
                index <= currentIndex ? "text-foreground" : "text-muted-foreground"
              )}>
                {s.label}
              </span>
            </div>
            {index < statuses.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-1",
                index < currentIndex ? "bg-primary" : "bg-border"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current status message */}
      {status === 'searching' && (
        <div className="text-center py-6">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Navigation className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Looking for drivers nearby</h3>
          <p className="text-muted-foreground">This usually takes less than a minute</p>
        </div>
      )}
      
      {/* Route info */}
      <div className="border-t border-border pt-6 mt-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-muted-foreground" />
            <div className="w-3 h-3 rounded-full border-2 border-foreground" />
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pickup</p>
              <p className="font-medium text-foreground">{pickup}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Drop-off</p>
              <p className="font-medium text-foreground">{destination}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideProgress;
