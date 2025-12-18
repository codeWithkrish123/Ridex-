import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface LocationInputProps {
  pickup: string;
  destination: string;
  onPickupChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  pickup,
  destination,
  onPickupChange,
  onDestinationChange,
}) => {
  const recentLocations = [
    { name: 'Home', address: '123 Main Street' },
    { name: 'Work', address: '456 Business Ave' },
  ];

  return (
    <div className="card-3d p-6 space-y-4">
      {/* Route visualization */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
          <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-muted-foreground" />
          <div className="w-3 h-3 rounded-full border-2 border-foreground bg-background" />
        </div>
        
        <div className="flex-1 space-y-4">
          {/* Pickup input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <input
              type="text"
              value={pickup}
              onChange={(e) => onPickupChange(e.target.value)}
              placeholder="Enter pickup location"
              className="w-full h-14 pl-12 pr-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-secondary transition-all"
            />
          </div>
          
          {/* Destination input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              placeholder="Where to?"
              className="w-full h-14 pl-12 pr-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-secondary transition-all"
            />
          </div>
        </div>
      </div>
      
      {/* Recent locations */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Recent</span>
        </div>
        <div className="space-y-2">
          {recentLocations.map((loc, index) => (
            <button
              key={index}
              onClick={() => onDestinationChange(loc.address)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{loc.name}</p>
                <p className="text-sm text-muted-foreground">{loc.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
