import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MapBackground from '@/components/MapBackground';
import LocationInput from '@/components/LocationInput';
import VehicleCard, { Vehicle } from '@/components/VehicleCard';
import DriverCard, { Driver } from '@/components/DriverCard';
import RideProgress from '@/components/RideProgress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type RideStatus = 'idle' | 'selectVehicle' | 'searching' | 'matched' | 'arriving' | 'inProgress' | 'completed';

const vehicles: Vehicle[] = [
  { id: '1', name: 'RideX Go', type: 'economy', price: 12.50, time: '3 min', capacity: 4, description: 'Affordable rides, everyday comfort' },
  { id: '2', name: 'RideX Comfort', type: 'comfort', price: 18.75, time: '5 min', capacity: 4, description: 'Newer cars with extra legroom' },
  { id: '3', name: 'RideX Black', type: 'premium', price: 32.00, time: '8 min', capacity: 4, description: 'Premium rides in luxury cars' },
  { id: '4', name: 'RideX XL', type: 'xl', price: 24.50, time: '6 min', capacity: 6, description: 'Spacious rides for groups' },
];

const mockDriver: Driver = {
  id: '1',
  name: 'Michael Chen',
  photo: '',
  rating: 4.92,
  trips: 2847,
  car: 'Tesla Model 3 • Black',
  plate: 'ABC 1234',
  eta: 3,
};

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [pickup, setPickup] = useState('Current Location');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatus>('idle');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSearch = () => {
    if (!destination) {
      toast({
        title: "Enter destination",
        description: "Please enter where you want to go",
        variant: "destructive",
      });
      return;
    }
    setRideStatus('selectVehicle');
  };

  const handleRequestRide = () => {
    if (!selectedVehicle) {
      toast({
        title: "Select a ride",
        description: "Please choose a vehicle type",
        variant: "destructive",
      });
      return;
    }
    setRideStatus('searching');
    
    // Simulate finding driver
    setTimeout(() => {
      setRideStatus('matched');
      toast({
        title: "Driver found!",
        description: `${mockDriver.name} is on the way`,
      });
    }, 3000);
    
    // Simulate driver arriving
    setTimeout(() => {
      setRideStatus('arriving');
    }, 6000);
  };

  const handleCancelRide = () => {
    setRideStatus('idle');
    setSelectedVehicle(null);
    toast({
      title: "Ride cancelled",
      description: "Your ride has been cancelled",
    });
  };

  const handleStartRide = () => {
    setRideStatus('inProgress');
    toast({
      title: "Ride started",
      description: "Enjoy your trip!",
    });
    
    // Simulate ride completion
    setTimeout(() => {
      setRideStatus('completed');
    }, 5000);
  };

  const handleCompleteRide = async () => {
    // Save ride to history
    if (user && selectedVehicle) {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      try {
        await supabase.from('rides').insert({
          user_id: user.id,
          pickup_location: pickup,
          destination: destination,
          vehicle_type: vehicle?.name || 'RideX Go',
          driver_name: mockDriver.name,
          driver_rating: mockDriver.rating,
          fare: vehicle?.price || 12.50,
          status: 'completed',
          started_at: new Date(Date.now() - 300000).toISOString(),
          completed_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error saving ride:', error);
      }
    }
    
    setRideStatus('idle');
    setDestination('');
    setSelectedVehicle(null);
    toast({
      title: "Thanks for riding!",
      description: "Your ride has been saved to history",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      <MapBackground />
      <Header 
        showBack={rideStatus !== 'idle'} 
        onBack={() => rideStatus === 'selectVehicle' ? setRideStatus('idle') : handleCancelRide()}
      />
      
      <main className="relative z-10 pt-24 pb-8 px-4 max-w-lg mx-auto">
        {/* Hero section - only show when idle */}
        {rideStatus === 'idle' && (
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">Your ride, your way</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Where to <span className="text-gradient">today?</span>
            </h1>
            <p className="text-muted-foreground">
              Request a ride and get picked up in minutes
            </p>
          </div>
        )}
        
        {/* Location Input */}
        {(rideStatus === 'idle' || rideStatus === 'selectVehicle') && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <LocationInput
              pickup={pickup}
              destination={destination}
              onPickupChange={setPickup}
              onDestinationChange={setDestination}
            />
          </div>
        )}
        
        {/* Search button - idle state */}
        {rideStatus === 'idle' && destination && (
          <div className="mt-6 animate-fade-in">
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full"
              onClick={handleSearch}
            >
              See prices
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
        
        {/* Vehicle selection */}
        {rideStatus === 'selectVehicle' && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Choose a ride</h2>
            <div className="space-y-3">
              {vehicles.map((vehicle, index) => (
                <div 
                  key={vehicle.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    isSelected={selectedVehicle === vehicle.id}
                    onSelect={() => setSelectedVehicle(vehicle.id)}
                  />
                </div>
              ))}
            </div>
            
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full mt-6"
              onClick={handleRequestRide}
              disabled={!selectedVehicle}
            >
              Request {vehicles.find(v => v.id === selectedVehicle)?.name || 'Ride'}
            </Button>
          </div>
        )}
        
        {/* Ride progress */}
        {(rideStatus === 'searching' || rideStatus === 'matched' || rideStatus === 'arriving' || rideStatus === 'inProgress') && (
          <div className="space-y-6 animate-fade-in">
            <RideProgress 
              status={rideStatus} 
              pickup={pickup}
              destination={destination}
            />
            
            {(rideStatus === 'matched' || rideStatus === 'arriving') && (
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <DriverCard 
                  driver={mockDriver}
                  onCall={() => toast({ title: "Calling driver...", description: mockDriver.name })}
                  onMessage={() => toast({ title: "Opening chat...", description: `Chat with ${mockDriver.name}` })}
                />
              </div>
            )}
            
            {rideStatus === 'arriving' && (
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full"
                onClick={handleStartRide}
              >
                I'm in the car
              </Button>
            )}
            
            {rideStatus === 'searching' && (
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={handleCancelRide}
              >
                Cancel search
              </Button>
            )}
          </div>
        )}
        
        {/* Ride completed */}
        {rideStatus === 'completed' && (
          <div className="card-3d p-8 text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">You've arrived!</h2>
            <p className="text-muted-foreground mb-6">Thanks for riding with RideX</p>
            
            {/* Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  className="w-12 h-12 rounded-xl bg-secondary hover:bg-primary/20 transition-colors flex items-center justify-center group"
                >
                  <svg 
                    className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={() => toast({ title: "Tip added!", description: "Thanks for the tip!" })}
              >
                Add tip
              </Button>
              <Button 
                variant="hero" 
                size="lg" 
                className="flex-1"
                onClick={handleCompleteRide}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
