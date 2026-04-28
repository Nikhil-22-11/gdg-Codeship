import { Shield, Globe, Zap, Target, Award, ArrowRight, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Testimonials from "@/components/Testimonials";

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#2D6A4F] selection:text-white overflow-x-hidden">
      {/* NAVIGATION */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 h-20 flex items-center justify-between max-w-7xl mx-auto rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-lg shadow-[#2D6A4F]/20">
            <Globe className="size-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Disaster Response OS</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-muted-foreground hover:text-[#2D6A4F] transition-colors">Features</button>
          <button className="text-sm font-medium text-muted-foreground hover:text-[#2D6A4F] transition-colors">Testimonials</button>
          <Button 
            className="rounded-full px-8 bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-lg shadow-[#2D6A4F]/20"
            onClick={onLogin}
          >
            Access Mission Control
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 size-[600px] bg-[#2D6A4F]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/40 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F] animate-in fade-in slide-in-from-top-4 duration-700">
                <Sparkles className="size-3" />
                V4.2.0 • Unified Command Protocol Active
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700">
                Data-Driven <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D6A4F] to-[#40916C]">Resilience.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
                The world's most advanced operational intelligence platform for humanitarian response. 
                Integrating satellite telemetry with real-time ground coordination.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
                <Button 
                    size="lg" 
                    className="h-14 px-10 rounded-2xl bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-xl shadow-[#2D6A4F]/20 text-base font-bold group"
                    onClick={onLogin}
                >
                    Launch Command Center
                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-10 rounded-2xl border-border/60 text-base font-bold backdrop-blur-sm"
                >
                    View System Specs
                </Button>
            </div>
        </div>
      </header>

      {/* MISSION & FEATURES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { 
                    title: "The Mission", 
                    desc: "Bridging the gap between data and action. Our platform integrates satellite telemetry and ground reports for global NGOs.",
                    icon: Target,
                    color: "bg-blue-500/10 text-blue-500"
                },
                { 
                    title: "Security First", 
                    desc: "Military-grade encryption (AES-256) and compliance with international humanitarian data standards.",
                    icon: Shield,
                    color: "bg-orange-500/10 text-orange-500"
                },
                { 
                    title: "Operational Excellence", 
                    desc: "Real-time resource tracking and AI-driven allocation logic designed for high-intensity coordination.",
                    icon: Award,
                    color: "bg-[#2D6A4F]/10 text-[#2D6A4F]"
                }
            ].map((feature, i) => (
                <div key={feature.title} className="p-8 rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-[#2D6A4F]/30 transition-all group">
                    <div className={`size-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="size-7" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-4">{feature.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* PERFORMANCE BANNER */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="rounded-[3rem] bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] p-12 text-white text-center shadow-2xl shadow-[#2D6A4F]/30 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 p-12 opacity-[0.05] transition-transform group-hover:rotate-12 pointer-events-none">
                <Zap className="size-96" />
            </div>
            <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest">
                    Operational Benchmark
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Extreme Durability by Design</h2>
                <p className="text-white/80 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                    Engineered for high-stress environments. From handheld tablets in hurricane zones 
                    to global command centers, Disaster OS adapts instantly to provide 
                    critical operational intelligence.
                </p>
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
                    <div className="space-y-1">
                        <p className="text-4xl font-black italic tracking-tighter">14ms</p>
                        <p className="text-[11px] uppercase font-bold text-white/50 tracking-widest">Latency</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black italic tracking-tighter">99.9%</p>
                        <p className="text-[11px] uppercase font-bold text-white/50 tracking-widest">Uptime</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black italic tracking-tighter">AES-256</p>
                        <p className="text-[11px] uppercase font-bold text-white/50 tracking-widest">Security</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <div className="py-24">
        <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Trusted by Field Agents</h2>
            <p className="text-muted-foreground">Hear from the responders using Disaster OS on the frontlines.</p>
        </div>
        <Testimonials />
      </div>

      {/* FOOTER */}
      <footer className="py-20 border-t border-border/40 bg-secondary/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
                <Globe className="size-6 text-[#2D6A4F]" />
                <span className="font-bold tracking-tight">Disaster Response OS</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
                <a href="#" className="hover:text-[#2D6A4F]">Privacy Protocol</a>
                <a href="#" className="hover:text-[#2D6A4F]">Terms of Deployment</a>
                <a href="#" className="hover:text-[#2D6A4F]">Support</a>
            </div>
            <p className="text-xs text-muted-foreground/60">
                © 2026 Unified Humanitarian Command. All Rights Reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
