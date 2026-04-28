import { useEffect, useState } from "react";
import { UserCheck, MapPin, Clock, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllocations } from "@/data/allocationState";

const Allocations = () => {
  const { currentAllocations, subscribe } = useAllocations();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Subscribe to global allocation updates
    const unsubscribe = subscribe(() => forceUpdate({}));
    return () => unsubscribe();
  }, [subscribe]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Active Deployments</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time tracking of AI-allocated personnel and field assets.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20">
            <div className="size-2 rounded-full bg-[#2D6A4F] animate-pulse" />
            <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">AI Core Synchronized</span>
        </div>
      </div>

      <div className="grid gap-4">
        {currentAllocations.map((d: any) => (
          <div key={d.id} className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-soft transition-all hover:shadow-lg hover:border-[#2D6A4F]/30 animate-in slide-in-from-right-4 duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <UserCheck className="size-32" />
            </div>

            <div className="grid md:grid-cols-[1fr_1.5fr_1fr] gap-8 items-center">
                {/* VOLUNTEER INFO */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img src={d.volunteer.image} alt={d.volunteer.name} className="size-16 rounded-2xl object-cover border-2 border-background shadow-md" />
                        <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-green-500 border-4 border-card flex items-center justify-center">
                            <div className="size-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">{d.volunteer.name}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{d.volunteer.occupation}</p>
                    </div>
                </div>

                {/* MISSION INFO */}
                <div className="space-y-4">
                    <div className="flex items-center gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                <MapPin className="size-3" /> Deployment Zone
                            </p>
                            <p className="text-sm font-bold text-foreground">{d.zone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                <Clock className="size-3" /> Time Active
                            </p>
                            <p className="text-sm font-bold text-foreground">{d.startTime}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                <AlertTriangle className="size-3" /> Priority
                            </p>
                            <p className={`text-sm font-bold ${d.priority === 'Critical' ? 'text-destructive' : 'text-orange-500'}`}>{d.priority}</p>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/30 border border-border/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Current Objective</p>
                        <p className="text-xs font-bold text-foreground">{d.task}</p>
                    </div>
                </div>

                {/* ACTIONS & STATUS */}
                <div className="flex flex-col items-end gap-3">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        d.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        d.status === 'En-route' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }`}>
                        {d.status}
                    </div>
                    <div className="flex gap-2 w-full">
                        <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-bold border-border/60 hover:bg-secondary">
                            Comms Line
                        </Button>
                        <Button className="h-10 w-10 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground">
                            <ExternalLink className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {currentAllocations.length === 0 && (
        <div className="h-64 flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border/40 bg-secondary/5">
            <UserCheck className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-sm font-bold text-muted-foreground">No active deployments detected.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Initiate AI Auto-Allocation to dispatch personnel.</p>
        </div>
      )}
    </div>
  );
};

export default Allocations;
