import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface TrafficIntersectionProps {
  aiEnabled: boolean;
  ambulanceActive: boolean;
}

type Direction = "north" | "south" | "east" | "west";
type SignalState = "red" | "yellow" | "green";

interface Vehicle {
  id: string;
  direction: Direction;
  position: number;
  isAmbulance?: boolean;
}

const TrafficIntersection = ({ aiEnabled, ambulanceActive }: TrafficIntersectionProps) => {
  const [signals, setSignals] = useState<Record<Direction, SignalState>>({
    north: "red",
    south: "red",
    east: "green",
    west: "green",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trafficDensity, setTrafficDensity] = useState<Record<Direction, number>>({
    north: 5,
    south: 3,
    east: 7,
    west: 4,
  });

  // Simulate traffic density changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficDensity({
        north: Math.floor(Math.random() * 10) + 2,
        south: Math.floor(Math.random() * 10) + 2,
        east: Math.floor(Math.random() * 10) + 2,
        west: Math.floor(Math.random() * 10) + 2,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Spawn vehicles
  useEffect(() => {
    const interval = setInterval(() => {
      const directions: Direction[] = ["north", "south", "east", "west"];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      
      setVehicles(prev => [
        ...prev.slice(-20), // Keep max 20 vehicles
        {
          id: Math.random().toString(),
          direction: randomDir,
          position: 0,
          isAmbulance: ambulanceActive && prev.length === 0,
        }
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, [ambulanceActive]);

  // Signal logic
  useEffect(() => {
    const hasAmbulance = vehicles.some(v => v.isAmbulance);
    
    if (hasAmbulance && ambulanceActive) {
      const ambulance = vehicles.find(v => v.isAmbulance);
      if (ambulance) {
        // Give green to ambulance direction
        setSignals({
          north: ambulance.direction === "north" || ambulance.direction === "south" ? "green" : "red",
          south: ambulance.direction === "north" || ambulance.direction === "south" ? "green" : "red",
          east: ambulance.direction === "east" || ambulance.direction === "west" ? "green" : "red",
          west: ambulance.direction === "east" || ambulance.direction === "west" ? "green" : "red",
        });
      }
      return;
    }

    const cycleTime = aiEnabled ? 4000 : 6000;
    
    const interval = setInterval(() => {
      setSignals(prev => {
        if (aiEnabled) {
          // AI logic: prioritize direction with most traffic
          const nsTraffic = trafficDensity.north + trafficDensity.south;
          const ewTraffic = trafficDensity.east + trafficDensity.west;
          
          if (prev.north === "green") {
            return { north: "yellow", south: "yellow", east: "red", west: "red" };
          } else if (prev.north === "yellow") {
            return { north: "red", south: "red", east: "green", west: "green" };
          } else if (prev.east === "green") {
            return { north: "red", south: "red", east: "yellow", west: "yellow" };
          } else {
            return { north: "green", south: "green", east: "red", west: "red" };
          }
        } else {
          // Traditional fixed timing
          if (prev.north === "green") {
            return { north: "yellow", south: "yellow", east: "red", west: "red" };
          } else if (prev.north === "yellow") {
            return { north: "red", south: "red", east: "green", west: "green" };
          } else if (prev.east === "green") {
            return { north: "red", south: "red", east: "yellow", west: "yellow" };
          } else {
            return { north: "green", south: "green", east: "red", west: "red" };
          }
        }
      });
    }, cycleTime);

    return () => clearInterval(interval);
  }, [aiEnabled, trafficDensity, vehicles, ambulanceActive]);

  const getSignalColor = (state: SignalState) => {
    switch (state) {
      case "green": return "bg-traffic-green shadow-lg shadow-traffic-green/50";
      case "yellow": return "bg-traffic-yellow shadow-lg shadow-traffic-yellow/50";
      case "red": return "bg-traffic-red shadow-lg shadow-traffic-red/50";
    }
  };

  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="p-8">
        <div className="relative w-full aspect-square max-w-2xl mx-auto bg-secondary/30 rounded-xl">
          {/* Intersection center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/3 h-1/3 bg-muted border-4 border-dashed border-border rounded-lg" />
          </div>

          {/* Roads */}
          <div className="absolute left-1/2 top-0 w-24 h-full -translate-x-1/2 bg-muted/50" />
          <div className="absolute top-1/2 left-0 h-24 w-full -translate-y-1/2 bg-muted/50" />

          {/* Traffic Lights */}
          {(["north", "south", "east", "west"] as Direction[]).map((dir) => {
            const positions = {
              north: "top-4 left-1/2 -translate-x-1/2",
              south: "bottom-4 left-1/2 -translate-x-1/2",
              east: "right-4 top-1/2 -translate-y-1/2",
              west: "left-4 top-1/2 -translate-y-1/2",
            };

            return (
              <div key={dir} className={cn("absolute flex gap-1 p-2 bg-card rounded-lg border border-border", positions[dir])}>
                <div className={cn("w-3 h-3 rounded-full transition-all", signals[dir] === "red" ? getSignalColor("red") : "bg-muted")} />
                <div className={cn("w-3 h-3 rounded-full transition-all", signals[dir] === "yellow" ? getSignalColor("yellow") : "bg-muted")} />
                <div className={cn("w-3 h-3 rounded-full transition-all", signals[dir] === "green" ? getSignalColor("green") : "bg-muted")} />
              </div>
            );
          })}

          {/* Traffic Density Indicators */}
          {(["north", "south", "east", "west"] as Direction[]).map((dir) => {
            const positions = {
              north: "top-16 left-1/2 -translate-x-1/2",
              south: "bottom-16 left-1/2 -translate-x-1/2",
              east: "right-16 top-1/2 -translate-y-1/2",
              west: "left-16 top-1/2 -translate-y-1/2",
            };

            return (
              <div key={`density-${dir}`} className={cn("absolute bg-card/80 backdrop-blur px-2 py-1 rounded text-xs font-bold border border-border", positions[dir])}>
                {trafficDensity[dir]} 🚗
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-traffic-red" />
            <span className="text-muted-foreground">Stop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-traffic-yellow" />
            <span className="text-muted-foreground">Caution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-traffic-green" />
            <span className="text-muted-foreground">Go</span>
          </div>
          {ambulanceActive && (
            <div className="flex items-center gap-2 px-3 py-1 bg-ambulance/20 rounded-full border border-ambulance/30">
              <div className="w-3 h-3 rounded-full bg-ambulance animate-pulse" />
              <span className="font-bold text-ambulance">Emergency Active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficIntersection;
