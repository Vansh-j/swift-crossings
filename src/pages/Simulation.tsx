import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, VideoOff, Activity } from "lucide-react";
import { toast } from "sonner";

const Simulation = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          toast.success("Camera Connected", {
            description: "North Road camera stream is live",
            icon: <Video className="w-4 h-4" />
          });
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError(true);
        toast.error("Camera Access Denied", {
          description: "Please allow camera access to view the stream"
        });
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cameraFeeds = [
    { id: 1, name: "North Road", active: true },
    { id: 2, name: "South Road", active: false },
    { id: 3, name: "East Road", active: false },
    { id: 4, name: "West Road", active: false },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Video className="w-10 h-10 text-primary" />
            Camera Streams
          </h1>
          <p className="text-muted-foreground">Real-time monitoring of traffic at all intersection points</p>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cameraFeeds.map((feed, index) => (
            <Card 
              key={feed.id} 
              className="border-border overflow-hidden animate-fade-in bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {feed.active ? (
                      <>
                        <div className="relative">
                          <div className="w-2 h-2 bg-traffic-green rounded-full animate-pulse" />
                          <div className="absolute inset-0 w-2 h-2 bg-traffic-green rounded-full animate-ping" />
                        </div>
                        {feed.name}
                      </>
                    ) : (
                      <>
                        <VideoOff className="w-4 h-4 text-muted-foreground" />
                        {feed.name}
                      </>
                    )}
                  </span>
                  {feed.active && (
                    <span className="text-xs font-normal text-traffic-green flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      LIVE
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-secondary/50">
                  {feed.active && index === 0 ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {cameraActive && (
                        <div className="absolute top-3 right-3 bg-traffic-green/20 border border-traffic-green/50 rounded-full px-3 py-1 text-xs font-medium text-traffic-green flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-traffic-green rounded-full animate-pulse" />
                          RECORDING
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Camera ID: CAM-N001</span>
                          <span>{currentTime}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <VideoOff className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-1">Stream Not Available</p>
                      <p className="text-sm opacity-75">Camera {feed.id} is offline</p>
                      <div className="mt-4 px-4 py-2 rounded-full bg-secondary/50 border border-border text-xs">
                        Attempting to reconnect...
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-traffic-green/20 flex items-center justify-center">
                  <Video className="w-5 h-5 text-traffic-green" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Cameras</p>
                  <p className="text-2xl font-bold">1/4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stream Quality</p>
                  <p className="text-2xl font-bold">720p</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-traffic-yellow/20 flex items-center justify-center">
                  <VideoOff className="w-5 h-5 text-traffic-yellow" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Offline Cameras</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold text-accent">Active</p>
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
