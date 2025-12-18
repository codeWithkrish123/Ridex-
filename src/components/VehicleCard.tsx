import React from 'react';
import { Car, Zap, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Vehicle {
  id: string;
  name: string;
  type: 'economy' | 'comfort' | 'premium' | 'xl';
  price: number;
  time: string;
  capacity: number;
  description: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: () => void;
}

const vehicleIcons = {
  economy: Car,
  comfort: Car,
  premium: Zap,
  xl: Users,
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, isSelected, onSelect }) => {
  const Icon = vehicleIcons[vehicle.type];

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left group",
        isSelected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
          : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Vehicle icon */}
        <div className={cn(
          "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300",
          isSelected 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-muted-foreground group-hover:text-foreground"
        )}>
          <Icon className="w-8 h-8" />
        </div>
        
        {/* Vehicle info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
            <span className="text-lg font-bold text-foreground">${vehicle.price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{vehicle.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {vehicle.time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {vehicle.capacity}
            </span>
          </div>
        </div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-primary/30">
          <div className="flex items-center gap-2 text-sm text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Selected</span>
          </div>
        </div>
      )}
    </button>
  );
};

export default VehicleCard;
