import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, TrendingUp, Car, AlertCircle, CheckCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const Dashboard = () => {
  const trafficData = [
    { time: "00:00", vehicles: 120, waitTime: 45 },
    { time: "04:00", vehicles: 80, waitTime: 30 },
    { time: "08:00", vehicles: 450, waitTime: 120 },
    { time: "12:00", vehicles: 380, waitTime: 90 },
    { time: "16:00", vehicles: 520, waitTime: 150 },
    { time: "20:00", vehicles: 340, waitTime: 85 },
    { time: "24:00", vehicles: 180, waitTime: 55 },
  ];

  const efficiencyData = [
    { intersection: "A", traditional: 85, ai: 142 },
    { intersection: "B", traditional: 92, ai: 156 },
    { intersection: "C", traditional: 78, ai: 135 },
    { intersection: "D", traditional: 88, ai: 148 },
  ];

  const stats = [
    { 
      title: "Total Vehicles Today", 
      value: "12,847", 
      change: "+12.5%", 
      icon: Car, 
      color: "text-primary" 
    },
    { 
      title: "Avg Wait Time", 
      value: "42s", 
      change: "-28.3%", 
      icon: Clock, 
      color: "text-traffic-green" 
    },
    { 
      title: "Flow Efficiency", 
      value: "87%", 
      change: "+15.2%", 
      icon: TrendingUp, 
      color: "text-traffic-yellow" 
    },
    { 
      title: "Active Signals", 
      value: "24/24", 
      change: "100%", 
      icon: Activity, 
      color: "text-traffic-green" 
    },
  ];

  const recentEvents = [
    { type: "success", message: "AI optimization improved flow at Junction 4", time: "2m ago" },
    { type: "alert", message: "Emergency vehicle priority activated - Route 7", time: "5m ago" },
    { type: "success", message: "Peak hour congestion reduced by 18%", time: "12m ago" },
    { type: "success", message: "Signal synchronization completed", time: "25m ago" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Traffic Control Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-border hover:border-primary/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-traffic-green' : 'text-traffic-red'}`}>
                    {stat.change} from yesterday
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Traffic Flow (24h)</CardTitle>
              <CardDescription>Vehicle count and average wait time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  vehicles: {
                    label: "Vehicles",
                    color: "hsl(var(--primary))",
                  },
                  waitTime: {
                    label: "Wait Time (s)",
                    color: "hsl(var(--traffic-yellow))",
                  },
                }}
                className="h-[300px]"
              >
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="vehicles" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="waitTime" stroke="hsl(var(--traffic-yellow))" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>AI vs Traditional Efficiency</CardTitle>
              <CardDescription>Vehicles processed per hour</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  traditional: {
                    label: "Traditional",
                    color: "hsl(var(--muted))",
                  },
                  ai: {
                    label: "AI System",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="intersection" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="traditional" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="ai" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Live system updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  {event.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-traffic-green mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-ambulance mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{event.message}</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
