import React from 'react';
import { Star, Phone, MessageSquare, Shield } from 'lucide-react';
import { Button } from './ui/button';

export interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  trips: number;
  car: string;
  plate: string;
  eta: number;
}

interface DriverCardProps {
  driver: Driver;
  onCall: () => void;
  onMessage: () => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, onCall, onMessage }) => {
  return (
    <div className="card-3d p-6">
      <div className="flex items-start gap-4 mb-6">
        {/* Driver photo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary">
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {driver.name.charAt(0)}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        
        {/* Driver info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-1">{driver.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 text-primary">
              <Star className="w-4 h-4 fill-primary" />
              <span className="font-semibold">{driver.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{driver.trips} trips</span>
          </div>
          <p className="text-sm text-muted-foreground">{driver.car}</p>
          <p className="text-lg font-mono font-bold text-foreground mt-1">{driver.plate}</p>
        </div>
      </div>
      
      {/* ETA */}
      <div className="bg-secondary/50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Arriving in</span>
          <span className="text-2xl font-bold text-primary">{driver.eta} min</span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full animate-pulse"
            style={{ width: '60%' }}
          />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1"
          onClick={onCall}
        >
          <Phone className="w-5 h-5 mr-2" />
          Call
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1"
          onClick={onMessage}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Message
        </Button>
      </div>
    </div>
  );
};

export default DriverCard;
