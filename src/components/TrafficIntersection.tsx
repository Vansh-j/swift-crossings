import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface TrafficIntersectionProps {
  aiEnabled: boolean;
  ambulanceActive: boolean;
  sharedVehicles?: Vehicle[];
  onVehiclesChange?: (vehicles: Vehicle[]) => void;
}

type Direction = "north" | "south" | "east" | "west";
type SignalState = "red" | "yellow" | "green";

interface Vehicle {
  id: string;
  from: Direction;
  to: Direction;
  position: number;
  isAmbulance?: boolean;
  passed?: boolean;
}

const SIGNAL_STOP_POSITION = 45;
const INTERSECTION_START = 40;
const INTERSECTION_END = 60;
const MAX_POSITION = 100;

const TrafficIntersection = ({ aiEnabled, ambulanceActive, sharedVehicles, onVehiclesChange }: TrafficIntersectionProps) => {
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

  const [greenTimer, setGreenTimer] = useState<Record<Direction, number>>({
    north: 0,
    south: 0,
    east: 15,
    west: 15,
  });

  const signalPhaseRef = useRef<'ns' | 'ew'>('ew');
  const phaseTimerRef = useRef<number>(0);

  // Use shared vehicles if in compare mode
  useEffect(() => {
    if (sharedVehicles) {
      setVehicles(sharedVehicles);
    }
  }, [sharedVehicles]);

  // Update traffic density based on actual vehicles
  useEffect(() => {
    const density = vehicles.reduce((acc, v) => {
      if (!v.passed && v.position < INTERSECTION_START) {
        acc[v.from] = (acc[v.from] || 0) + 1;
      }
      return acc;
    }, { north: 0, south: 0, east: 0, west: 0 } as Record<Direction, number>);
    
    setTrafficDensity(density);
  }, [vehicles]);

  // Spawn vehicles (only if not using shared vehicles)
  useEffect(() => {
    if (sharedVehicles) return;

    const interval = setInterval(() => {
      const directions: Direction[] = ["north", "south", "east", "west"];
      const from = directions[Math.floor(Math.random() * directions.length)];
      const possibleTo = directions.filter(d => d !== from);
      const to = possibleTo[Math.floor(Math.random() * possibleTo.length)];
      
      const newVehicle: Vehicle = {
        id: Math.random().toString(),
        from,
        to,
        position: 0,
        isAmbulance: ambulanceActive && Math.random() < 0.3,
        passed: false,
      };

      setVehicles(prev => {
        const updated = [...prev, newVehicle].filter(v => v.position < MAX_POSITION).slice(-30);
        onVehiclesChange?.(updated);
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [ambulanceActive, sharedVehicles, onVehiclesChange]);

  // Signal logic
  useEffect(() => {
    // Check for ambulance
    const ambulance = vehicles.find(v => v.isAmbulance && !v.passed && v.position < INTERSECTION_END);
    
    if (ambulance && ambulanceActive) {
      const isNS = ambulance.from === "north" || ambulance.from === "south";
      setSignals({
        north: isNS ? "green" : "red",
        south: isNS ? "green" : "red",
        east: isNS ? "red" : "green",
        west: isNS ? "red" : "green",
      });
      setGreenTimer({
        north: isNS ? 15 : 0,
        south: isNS ? 15 : 0,
        east: isNS ? 0 : 15,
        west: isNS ? 0 : 15,
      });
      return;
    }

    const interval = setInterval(() => {
      phaseTimerRef.current += 1;

      if (aiEnabled) {
        // AI Logic: Dynamic timing based on traffic density
        const nsTraffic = trafficDensity.north + trafficDensity.south;
        const ewTraffic = trafficDensity.east + trafficDensity.west;
        
        const currentPhase = signalPhaseRef.current;
        const currentGreen = currentPhase === 'ns' ? (signals.north === 'green' || signals.north === 'yellow') : (signals.east === 'green' || signals.east === 'yellow');
        
        // Calculate green time based on traffic (min 5s, max 20s)
        const nsTime = Math.max(5, Math.min(20, nsTraffic * 2));
        const ewTime = Math.max(5, Math.min(20, ewTraffic * 2));
        
        if (currentPhase === 'ns') {
          if (signals.north === 'green') {
            setGreenTimer(prev => ({ ...prev, north: Math.max(0, prev.north - 1), south: Math.max(0, prev.south - 1) }));
            if (phaseTimerRef.current >= nsTime) {
              setSignals({ north: "yellow", south: "yellow", east: "red", west: "red" });
              phaseTimerRef.current = 0;
            }
          } else if (signals.north === 'yellow' && phaseTimerRef.current >= 3) {
            setSignals({ north: "red", south: "red", east: "green", west: "green" });
            setGreenTimer({ north: 0, south: 0, east: ewTime, west: ewTime });
            signalPhaseRef.current = 'ew';
            phaseTimerRef.current = 0;
          }
        } else {
          if (signals.east === 'green') {
            setGreenTimer(prev => ({ ...prev, east: Math.max(0, prev.east - 1), west: Math.max(0, prev.west - 1) }));
            if (phaseTimerRef.current >= ewTime) {
              setSignals({ north: "red", south: "red", east: "yellow", west: "yellow" });
              phaseTimerRef.current = 0;
            }
          } else if (signals.east === 'yellow' && phaseTimerRef.current >= 3) {
            setSignals({ north: "green", south: "green", east: "red", west: "red" });
            setGreenTimer({ north: nsTime, south: nsTime, east: 0, west: 0 });
            signalPhaseRef.current = 'ns';
            phaseTimerRef.current = 0;
          }
        }
      } else {
        // Static timing: 60s wait, 15s green
        const currentPhase = signalPhaseRef.current;
        
        if (currentPhase === 'ns') {
          if (signals.north === 'green') {
            setGreenTimer(prev => ({ ...prev, north: Math.max(0, prev.north - 1), south: Math.max(0, prev.south - 1) }));
            if (phaseTimerRef.current >= 15) {
              setSignals({ north: "yellow", south: "yellow", east: "red", west: "red" });
              phaseTimerRef.current = 0;
            }
          } else if (signals.north === 'yellow' && phaseTimerRef.current >= 3) {
            setSignals({ north: "red", south: "red", east: "green", west: "green" });
            setGreenTimer({ north: 0, south: 0, east: 15, west: 15 });
            signalPhaseRef.current = 'ew';
            phaseTimerRef.current = 0;
          }
        } else {
          if (signals.east === 'green') {
            setGreenTimer(prev => ({ ...prev, east: Math.max(0, prev.east - 1), west: Math.max(0, prev.west - 1) }));
            if (phaseTimerRef.current >= 15) {
              setSignals({ north: "red", south: "red", east: "yellow", west: "yellow" });
              phaseTimerRef.current = 0;
            }
          } else if (signals.east === 'yellow' && phaseTimerRef.current >= 3) {
            setSignals({ north: "green", south: "green", east: "red", west: "red" });
            setGreenTimer({ north: 15, south: 15, east: 0, west: 0 });
            signalPhaseRef.current = 'ns';
            phaseTimerRef.current = 0;
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [aiEnabled, trafficDensity, vehicles, ambulanceActive, signals]);

  // Move vehicles
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => {
        const updated = prev.map(v => {
          if (v.passed || v.position >= MAX_POSITION) return v;

          const signal = signals[v.from];
          const canMove = v.position < SIGNAL_STOP_POSITION || 
                         v.position > INTERSECTION_START || 
                         signal === 'green' || 
                         signal === 'yellow' ||
                         v.isAmbulance;

          if (canMove) {
            const speed = v.isAmbulance ? 3 : 2;
            const newPosition = v.position + speed;
            return {
              ...v,
              position: newPosition,
              passed: newPosition >= INTERSECTION_END,
            };
          }

          return v;
        }).filter(v => v.position < MAX_POSITION);

        if (!sharedVehicles) {
          onVehiclesChange?.(updated);
        }
        return updated;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [signals, sharedVehicles, onVehiclesChange]);

  const getSignalColor = (state: SignalState) => {
    switch (state) {
      case "green": return "bg-traffic-green shadow-lg shadow-traffic-green/50";
      case "yellow": return "bg-traffic-yellow shadow-lg shadow-traffic-yellow/50";
      case "red": return "bg-traffic-red shadow-lg shadow-traffic-red/50";
    }
  };

  const getVehiclePosition = (v: Vehicle) => {
    const basePos = v.position;
    
    switch (v.from) {
      case "north":
        return { top: `${basePos}%`, left: "50%", transform: "translate(-50%, -50%)" };
      case "south":
        return { bottom: `${basePos}%`, left: "50%", transform: "translate(-50%, 50%)" };
      case "east":
        return { right: `${basePos}%`, top: "50%", transform: "translate(50%, -50%)" };
      case "west":
        return { left: `${basePos}%`, top: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="p-8">
        <div className="relative w-full aspect-square max-w-2xl mx-auto bg-secondary/30 rounded-xl overflow-hidden">
          {/* Intersection center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/3 h-1/3 bg-muted border-4 border-dashed border-border rounded-lg" />
          </div>

          {/* Roads */}
          <div className="absolute left-1/2 top-0 w-24 h-full -translate-x-1/2 bg-muted/50" />
          <div className="absolute top-1/2 left-0 h-24 w-full -translate-y-1/2 bg-muted/50" />

          {/* Vehicles */}
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={cn(
                "absolute transition-all duration-200 z-10",
                v.isAmbulance ? "text-2xl" : "text-lg"
              )}
              style={getVehiclePosition(v)}
            >
              {v.isAmbulance ? "🚑" : "🚗"}
            </div>
          ))}

          {/* Traffic Lights */}
          {(["north", "south", "east", "west"] as Direction[]).map((dir) => {
            const positions = {
              north: "top-4 left-1/2 -translate-x-1/2",
              south: "bottom-4 left-1/2 -translate-x-1/2",
              east: "right-4 top-1/2 -translate-y-1/2",
              west: "left-4 top-1/2 -translate-y-1/2",
            };

            return (
              <div key={dir} className={cn("absolute z-20", positions[dir])}>
                <div className="flex gap-1 p-2 bg-card rounded-lg border border-border">
                  <div className={cn("w-3 h-3 rounded-full transition-all", signals[dir] === "red" ? getSignalColor("red") : "bg-muted")} />
                  <div className={cn("w-3 h-3 rounded-full transition-all", signals[dir] === "yellow" ? getSignalColor("yellow") : "bg-muted")} />
                  <div className={cn("w-3 h-3 rounded-full transition-all", signals[dir] === "green" ? getSignalColor("green") : "bg-muted")} />
                </div>
                {signals[dir] === 'green' && (
                  <div className="text-center text-xs font-bold text-primary mt-1">
                    {greenTimer[dir]}s
                  </div>
                )}
              </div>
            );
          })}

          {/* Traffic Density Indicators */}
          {(["north", "south", "east", "west"] as Direction[]).map((dir) => {
            const positions = {
              north: "top-20 left-1/2 -translate-x-1/2",
              south: "bottom-20 left-1/2 -translate-x-1/2",
              east: "right-20 top-1/2 -translate-y-1/2",
              west: "left-20 top-1/2 -translate-y-1/2",
            };

            return (
              <div key={`density-${dir}`} className={cn("absolute bg-card/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold border border-border z-20", positions[dir])}>
                <div className="flex items-center gap-1">
                  <span className="text-primary">{trafficDensity[dir]}</span>
                  <span>🚗</span>
                </div>
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
