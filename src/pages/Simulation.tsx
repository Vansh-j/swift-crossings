import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Ambulance, Clock, Car } from "lucide-react";
import TrafficIntersection from "@/components/TrafficIntersection";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  from: "north" | "south" | "east" | "west";
  to: "north" | "south" | "east" | "west";
  position: number;
  isAmbulance?: boolean;
  passed?: boolean;
}

const Simulation = () => {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [ambulanceActive, setAmbulanceActive] = useState(false);
  const [sharedVehicles, setSharedVehicles] = useState<Vehicle[]>([]);

  const handleAiToggle = (enabled: boolean) => {
    setAiEnabled(enabled);
    toast.success(enabled ? "AI Traffic Control Enabled" : "Traditional Control Enabled", {
      description: enabled 
        ? "Signals will now adapt based on traffic density" 
        : "Using fixed timing cycles"
    });
  };

  const handleAmbulanceSpawn = () => {
    setAmbulanceActive(true);
    toast.warning("Emergency Vehicle Detected!", {
      description: "Prioritizing ambulance route",
      icon: <Ambulance className="w-4 h-4 text-ambulance" />
    });
    
    setTimeout(() => {
      setAmbulanceActive(false);
      toast.success("Emergency Vehicle Cleared", {
        description: "Returning to normal traffic flow"
      });
    }, 8000);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Traffic Simulation</h1>
          <p className="text-muted-foreground">Experience AI-powered traffic optimization in real-time</p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                AI Control
              </CardTitle>
              <CardDescription>Toggle intelligent signal optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-medium">{aiEnabled ? "Enabled" : "Disabled"}</span>
                <Switch checked={aiEnabled} onCheckedChange={handleAiToggle} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ambulance className="w-4 h-4 text-ambulance" />
                Emergency Mode
              </CardTitle>
              <CardDescription>Spawn ambulance for priority routing</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAmbulanceSpawn}
                disabled={ambulanceActive}
                className="w-full bg-ambulance hover:bg-ambulance/90"
              >
                {ambulanceActive ? "Ambulance Active..." : "Spawn Ambulance"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Compare Mode</CardTitle>
              <CardDescription>View AI vs Traditional side-by-side</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setCompareMode(!compareMode)}
                variant={compareMode ? "default" : "secondary"}
                className="w-full"
              >
                {compareMode ? "Single View" : "Compare View"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Views */}
        {compareMode ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <h3 className="font-bold text-lg mb-1">Traditional Control</h3>
                <p className="text-sm text-muted-foreground">60s wait, 15s green</p>
              </div>
              <TrafficIntersection 
                aiEnabled={false} 
                ambulanceActive={ambulanceActive} 
                sharedVehicles={sharedVehicles}
              />
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
                <h3 className="font-bold text-lg mb-1">AI Control</h3>
                <p className="text-sm text-muted-foreground">Dynamic timing based on traffic</p>
              </div>
              <TrafficIntersection 
                aiEnabled={true} 
                ambulanceActive={ambulanceActive} 
                sharedVehicles={sharedVehicles}
                onVehiclesChange={setSharedVehicles}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`rounded-lg p-3 border ${aiEnabled ? 'bg-primary/10 border-primary/30' : 'bg-muted/50 border-border'}`}>
              <h3 className="font-bold text-lg mb-1">
                {aiEnabled ? "AI Control Active" : "Traditional Control"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {aiEnabled 
                  ? "Signals adapting to real-time traffic density" 
                  : "Using fixed timing cycles"}
              </p>
            </div>
            <TrafficIntersection 
              aiEnabled={aiEnabled} 
              ambulanceActive={ambulanceActive}
              onVehiclesChange={setSharedVehicles}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Vehicles Processed</p>
                  <p className="text-2xl font-bold">{aiEnabled ? "156" : "92"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-traffic-yellow" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold">{aiEnabled ? "32s" : "58s"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-traffic-green/20 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-traffic-green rounded-full" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                  <p className="text-2xl font-bold text-traffic-green">{aiEnabled ? "+67%" : "0%"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
