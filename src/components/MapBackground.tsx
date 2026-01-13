import React from 'react';

const MapBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--border))" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Road lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path 
          d="M 0 500 Q 250 400 500 500 T 1000 500" 
          fill="none" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth="2"
          strokeDasharray="10 5"
        />
        <path 
          d="M 0 600 Q 300 700 600 600 T 1000 650" 
          fill="none" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth="2"
          strokeDasharray="10 5"
        />
      </svg>
      
      {/* Moving car indicator */}
      <div className="absolute top-1/2 left-0 w-full overflow-hidden">
        <div className="animate-car-move">
          <div className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50" />
        </div>
      </div>
    </div>
  );
};

export default MapBackground;
