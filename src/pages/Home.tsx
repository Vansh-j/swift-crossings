import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2IoMCwxNDksMjU1KSIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-4 py-32 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Traffic Management</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              The Future of Urban Mobility
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Transform city traffic with intelligent AI that adapts in real-time, 
              reducing congestion by up to 40% and prioritizing emergency vehicles.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-primary/50 transition-shadow">
                  View Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/simulation">
                <Button size="lg" variant="secondary" className="gap-2">
                  Try Simulation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-traffic-green/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-traffic-green" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Optimization</h3>
              <p className="text-muted-foreground">
                Machine learning algorithms dynamically adjust signal timings based on real-time traffic density.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-ambulance/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-ambulance" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Emergency Priority</h3>
              <p className="text-muted-foreground">
                Instantly detect and prioritize ambulances, creating green corridors for emergency response.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Monitor traffic flow, wait times, and efficiency metrics with beautiful live dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-12 text-center border border-primary/20">
            <h2 className="text-4xl font-bold mb-4">Ready to See It in Action?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience how AI transforms traffic management in real-time
            </p>
            <Link to="/simulation">
              <Button size="lg" className="gap-2">
                Launch Simulation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
