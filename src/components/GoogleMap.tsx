import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';

interface GoogleMapProps {
  pickup?: string;
  destination?: string;
  showRoute?: boolean;
  onMapReady?: () => void;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  pickup = 'Current Location', 
  destination,
  showRoute = false,
  onMapReady 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      initializeMap();
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key not configured');
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => initializeMap();
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup markers
      pickupMarkerRef.current?.setMap(null);
      destinationMarkerRef.current?.setMap(null);
      directionsRendererRef.current?.setMap(null);
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.0060 }, // Default: NYC
      zoom: 14,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c54' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#474787' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f0f23' }] },
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(mapInstance);
    setIsLoading(false);
    onMapReady?.();

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.setCenter(userLocation);
          
          // Add pickup marker at current location
          if (pickup === 'Current Location') {
            pickupMarkerRef.current = new window.google.maps.Marker({
              position: userLocation,
              map: mapInstance,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#6366f1',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              },
              title: 'Your Location',
            });
          }
        },
        (error) => {
          console.log('Geolocation error:', error.message);
        }
      );
    }
  };

  // Update route when destination changes
  useEffect(() => {
    if (!map || !destination || !showRoute) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#6366f1',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
    }

    // Get current position for pickup
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              directionsRendererRef.current?.setDirections(result);

              // Add custom markers
              const route = result.routes[0];
              const leg = route.legs[0];

              // Remove old markers
              pickupMarkerRef.current?.setMap(null);
              destinationMarkerRef.current?.setMap(null);

              // Pickup marker (blue)
              pickupMarkerRef.current = new window.google.maps.Marker({
                position: leg.start_location,
                map,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: '#6366f1',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3,
                },
                title: 'Pickup',
              });

              // Destination marker (green)
              destinationMarkerRef.current = new window.google.maps.Marker({
                position: leg.end_location,
                map,
                icon: {
                  path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 6,
                  fillColor: '#22c55e',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                  rotation: 0,
                },
                title: 'Destination',
              });

              // Fit bounds to show entire route
              const bounds = new window.google.maps.LatLngBounds();
              bounds.extend(leg.start_location);
              bounds.extend(leg.end_location);
              map.fitBounds(bounds);
            }
          }
        );
      });
    }
  }, [map, destination, showRoute]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary/50 rounded-2xl">
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 z-10">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GoogleMap;
