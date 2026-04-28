import { useEffect, useMemo, useRef, useState } from "react";
import { 
  Siren, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Truck, 
  FileText,
  Rss,
  Sparkles,
  Check,
  MapPin,
  Navigation,
  Radio,
  Activity,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Zap,
  Info,
  Map as MapIcon,
  Globe,
  Layers
} from "lucide-react";
import { Marker } from "react-map-gl/maplibre";
import { Map, type MapRef } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { tacticalUnits, sosAlerts, initialVolunteers } from "@/data/mockData";
import { addAllocation, dispatchedVolunteerIds } from "@/data/allocationState";

type Need = {
  id: number;
  title: string;
  zone: string;
  score: number;
  reports: number;
  coordinates: [number, number];
  impacted: number;
  type: string;
};

const styles = {
  default: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

type StyleKey = keyof typeof styles;

const initialNeeds: Need[] = [
  { id: 8421, title: "Water Shortage — Ward 4", zone: "Dharavi Relief Grid", score: 9.2, reports: 257, coordinates: [72.8553, 19.038], impacted: 142, type: "Water" },
  { id: 8417, title: "Food Crisis — Transit Camp", zone: "Kurla Transit Camp", score: 9.3, reports: 209, coordinates: [72.8796, 19.0726], impacted: 118, type: "Food" },
  { id: 8398, title: "Medical Triage Needed", zone: "Sion Medical Line", score: 8.9, reports: 99, coordinates: [72.8611, 19.044], impacted: 76, type: "Healthcare" },
  { id: 8374, title: "Coastal Evacuation Block", zone: "Mahim Coastal Block", score: 9.1, reports: 39, coordinates: [72.8401, 19.0427], impacted: 64, type: "Logistics" },
  { id: 8350, title: "Power Failure — Sector 3", zone: "Chembur Grid", score: 8.5, reports: 156, coordinates: [72.89, 19.05], impacted: 90, type: "Utilities" },
  { id: 8320, title: "Bridge Collapse Risk", zone: "Vashi Bridge Path", score: 9.5, reports: 42, coordinates: [72.93, 19.04], impacted: 200, type: "Logistics" },
];

const stats = [
  { label: "Total Urgent Needs", value: "142", sub: "+12% vs last hr", icon: Siren, color: "destructive", accent: "bg-destructive" },
  { label: "Active Volunteers", value: "892", sub: "On-Site: 240", icon: Users, color: "primary", accent: "bg-[#2D6A4F]" },
  { label: "Tasks Completed", value: "3,120", sub: "94% Target", icon: CheckCircle2, color: "sky-500", accent: "bg-sky-500" },
  { label: "Data Accuracy Index", value: "98.4", sub: "Verified Logs", icon: ShieldCheck, color: "accent", accent: "bg-accent" },
];

const Overview = () => {
  const mapRef = useRef<MapRef>(null);
  const [currentNeeds, setCurrentNeeds] = useState(initialNeeds);
  const [selectedNeed, setSelectedNeed] = useState(initialNeeds[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeFeed, setActiveFeed] = useState<'priority' | 'sos'>('priority');
  const [isAllocating, setIsAllocating] = useState(false);
  const [mapStyle, setMapStyle] = useState<StyleKey>("default");
  const aiRoutine = useRef<any>(null);

  const selectedStyle = styles[mapStyle];
  const is3D = mapStyle === "openstreetmap3d";

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
  }, [is3D]);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const res = await fetch('/api/crises');
        if (res.ok) {
          const data = await res.json();
          const validData = data.filter((n: any) => n.coordinates && Array.isArray(n.coordinates) && n.coordinates.length === 2);
          if (validData && validData.length > 0) {
            setCurrentNeeds(validData);
            // Update selectedNeed if it doesn't exist in the fetched list
            setSelectedNeed((prev) => {
                if (!prev || !validData.find((n: Need) => n.id === prev.id)) return validData[0];
                return prev;
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch crises", err);
      }
    };
    fetchNeeds();
    const interval = setInterval(fetchNeeds, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveNeed = async (id: number | string) => {
    setCurrentNeeds(prev => prev.filter(n => n.id !== id));
    try {
        const res = await fetch(`/api/crises/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success("Location cleared successfully.");
        } else {
            throw new Error("Failed to clear.");
        }
    } catch (e) {
        toast.error("Failed to clear location on backend.");
    }
  };

  const executeAIAutoAllocation = async (isSilent = false) => {
    if (currentNeeds.length === 0) return;

    if (!isSilent) {
        setIsAllocating(true);
        toast.loading("AI Command: Connecting to backend for system-wide asset scan...", { id: "ai-alloc" });
    }

    try {
        // Try to call the actual backend we just built!
        const response = await fetch('/api/admin/trigger-auto-dispatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Backend not available or failed');
        }

        const data = await response.json();
        
        if (!isSilent) {
            toast.success("Backend Auto-Dispatch Complete.", { id: "ai-alloc" });
        }
        
        // Note: Real-time updates would come via onSnapshot listener from firebase here.
        // For the sake of the demo maintaining its local state, we will STILL run the local 
        // simulation below just to keep the UI visually updating if they haven't set up Firebase yet.

    } catch (error) {
        if (!isSilent) {
            toast.error("Backend unreachable. Falling back to local simulation logic...", { id: "ai-alloc-err" });
        }
    }

    const highPriorityNeeds = [...currentNeeds].sort((a, b) => b.score - a.score);
    
    // Pick one high priority need at random for the auto-loop
    const targetNeed = highPriorityNeeds[Math.floor(Math.random() * Math.min(3, highPriorityNeeds.length))];
    
    // FILTER: Find volunteers who ARE AVAILABLE and NOT ALREADY DISPATCHED
    const availablePool = initialVolunteers.filter(v => 
        v.status === "Available" && !dispatchedVolunteerIds.has(v.id)
    );
    
    let candidates = [];
    const occ = (v: any) => v.occupation.toLowerCase();
    
    if (targetNeed.type === "Healthcare") {
        candidates = availablePool.filter(v => 
            occ(v).includes("medic") || occ(v).includes("nurse") || 
            occ(v).includes("surgeon") || occ(v).includes("doctor") || 
            occ(v).includes("health") || occ(v).includes("psychologist")
        );
    } else if (targetNeed.type === "Water" || targetNeed.type === "Utilities") {
        candidates = availablePool.filter(v => 
            occ(v).includes("engineer") || occ(v).includes("plumber") || 
            occ(v).includes("electrician") || occ(v).includes("water") || 
            occ(v).includes("utility") || occ(v).includes("structural")
        );
    } else if (targetNeed.type === "Food" || targetNeed.type === "Logistics") {
        candidates = availablePool.filter(v => 
            occ(v).includes("logistics") || occ(v).includes("logistician") || 
            occ(v).includes("pilot") || occ(v).includes("ops") || 
            occ(v).includes("coordinator") || occ(v).includes("search") ||
            occ(v).includes("rescue") || occ(v).includes("nutrition")
        );
    }

    // Pick a random candidate from the matched pool for variety
    const match = candidates[Math.floor(Math.random() * candidates.length)];

    if (match) {
        // AI allocation no longer auto-clears the map marker

        addAllocation({
            id: Date.now(),
            volunteer: match,
            zone: targetNeed.zone,
            task: targetNeed.title,
            startTime: "Just now",
            status: "En-route",
            priority: targetNeed.score > 9 ? "Critical" : "High"
        });

        toast.success(`AI Auto-Dispatch: ${match.name} assigned to ${targetNeed.zone}`, {
            description: `Personnel ID: HR-${match.id} | Issue Resolved in Queue.`,
            icon: <Zap className="size-4 text-orange-500" />
        });
    }

    if (!isSilent) {
        setTimeout(() => {
            setIsAllocating(false);
            toast.success("Forced Allocation Sweep Complete.", { id: "ai-alloc" });
        }, 1500);
    }
  };

  aiRoutine.current = executeAIAutoAllocation;

  useEffect(() => {
    // Auto-allocation "Forever" loop (every 5 seconds for visibility)
    const interval = setInterval(() => {
        if (aiRoutine.current) {
            aiRoutine.current(true);
        }
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (selectedNeed && selectedNeed.coordinates) {
        mapRef.current?.easeTo({ center: selectedNeed.coordinates, zoom: 12.5, duration: 800 });
    }
  }, [selectedNeed]);

  const handleExportCSV = () => {
    toast.promise(new Promise(r => setTimeout(r, 1200)), {
        loading: 'Compiling mission data...',
        success: () => {
            const blob = new Blob(["id,title,zone,score\n8421,Water Shortage,Dharavi,9.2"], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'disaster_response_summary.csv';
            a.click();
            return 'Mission summary exported successfully.';
        },
        error: 'Export failed.',
    });
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    toast.loading("Running predictive impact simulations...", { id: "sim-toast" });
    setTimeout(() => {
        setIsSimulating(false);
        toast.success("Simulation Complete: Redirection reduces rescue latency by 22%.", { id: "sim-toast" });
    }, 2500);
  };

  const handleAuthorize = () => {
    setIsAuthorized(true);
    toast.success("Strategic redirection authorized.", {
        description: "Ground units Alpha-4 and Delta-2 have been rerouted.",
        icon: <ShieldCheck className="size-4 text-[#2D6A4F]" />
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operational Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time status of disaster response efforts across all sectors.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F]/10 flex items-center gap-2 h-9 px-4 font-bold"
            onClick={() => executeAIAutoAllocation(false)}
          >
            <BrainCircuit className="size-3.5" />
            Initiate AI Dispatch
          </Button>
          <Button variant="outline" className="rounded-full h-9 px-5" onClick={handleExportCSV}>Export CSV</Button>
          <Button className="rounded-full h-9 px-5 bg-[#2D6A4F] text-white hover:bg-[#1B4332]" onClick={() => toast.info("Comprehensive activity logs are synced every 30s.")}>View All Logs</Button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article 
            key={stat.label} 
            className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-md hover:-translate-y-1"
          >
            <span className={`absolute inset-y-0 left-0 w-1 ${stat.accent}`} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <span className={`text-[10px] font-medium ${stat.color === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`}>{stat.sub}</span>
              </p>
            </div>
            <div className={`grid size-10 place-items-center rounded-lg ${stat.color === 'destructive' ? 'bg-destructive/10 text-destructive' : stat.color === 'primary' ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]' : stat.color === 'sky-500' ? 'bg-sky-500/10 text-sky-600' : 'bg-accent/20 text-accent-foreground'}`}>
              <stat.icon className="size-5" />
            </div>
          </article>
        ))}
      </div>

      {/* MAP SECTION */}
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Tactical Map Layers:</p>
        <Button 
          variant={mapStyle === 'default' ? 'default' : 'outline'} 
          size="sm" 
          className={`h-8 rounded-xl text-[10px] font-bold gap-2 transition-all ${mapStyle === 'default' ? 'bg-[#2D6A4F] hover:bg-[#1B4332]' : ''}`}
          onClick={() => setMapStyle('default')}
        >
          <MapIcon className="size-3" />
          Carto High-Contrast
        </Button>
        <Button 
          variant={mapStyle === 'openstreetmap' ? 'default' : 'outline'} 
          size="sm" 
          className={`h-8 rounded-xl text-[10px] font-bold gap-2 transition-all ${mapStyle === 'openstreetmap' ? 'bg-[#2D6A4F] hover:bg-[#1B4332]' : ''}`}
          onClick={() => setMapStyle('openstreetmap')}
        >
          <Globe className="size-3" />
          OSM Standard
        </Button>
        <Button 
          variant={mapStyle === 'openstreetmap3d' ? 'default' : 'outline'} 
          size="sm" 
          className={`h-8 rounded-xl text-[10px] font-bold gap-2 transition-all ${mapStyle === 'openstreetmap3d' ? 'bg-[#2D6A4F] hover:bg-[#1B4332]' : ''}`}
          onClick={() => setMapStyle('openstreetmap3d')}
        >
          <Layers className="size-3" />
          3D Perspective
        </Button>
      </div>

      <section className="relative h-[480px] w-full rounded-[2rem] border border-border/50 bg-card shadow-soft overflow-hidden">
        <Map
          ref={mapRef}
          mapStyle={selectedStyle ? selectedStyle : undefined}
          initialViewState={{ longitude: 72.8656, latitude: 19.0607, zoom: 11 }}
          className="h-full w-full"
        >
          {/* NEEDS MARKERS */}
          {currentNeeds.map((need) => (
            <Marker key={need.id} longitude={need.coordinates[0]} latitude={need.coordinates[1]} anchor="bottom">
              <button onClick={() => setSelectedNeed(need)} className="group relative flex flex-col items-center">
                <div className="mb-1 rounded-full bg-[#2D6A4F] px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white/20 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  {need.reports} Reports
                </div>
                <span className={`relative grid size-10 place-items-center rounded-full text-white shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 ${selectedNeed.id === need.id ? 'bg-destructive' : 'bg-destructive/80'}`}>
                  <span className={`absolute inset-0 rounded-full bg-destructive/40 motion-safe-only animate-ping ${selectedNeed.id === need.id || need.score > 9 ? 'opacity-100' : 'opacity-0'}`} />
                  <MapPin className="relative size-5 fill-current" />
                </span>
              </button>
            </Marker>
          ))}

          {/* TACTICAL UNIT MARKERS */}
          {tacticalUnits.map((unit) => (
            <Marker key={unit.id} longitude={unit.coordinates[0]} latitude={unit.coordinates[1]} anchor="center">
              <div className="group relative flex flex-col items-center cursor-help">
                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xl uppercase tracking-tighter">
                    {unit.name} • {unit.status}
                </div>
                <div className="size-8 rounded-xl bg-blue-600 text-white shadow-lg flex items-center justify-center border-2 border-white/40 animate-in zoom-in-50 duration-500">
                    <Navigation className={`size-4 ${unit.status === 'Moving' ? 'animate-bounce' : ''}`} />
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-green-500 border-2 border-white" />
                </div>
              </div>
            </Marker>
          ))}
        </Map>

        {/* LEFT FLOATING PANEL - STRATEGIC FOCUS */}
        <div className="absolute left-6 top-6 w-56 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-border/40 bg-background/60 p-4 shadow-2xl backdrop-blur-xl">
                <div className="grid size-10 place-items-center rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F]">
                    <MapPin className="size-5" />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Strategic Focus</p>
                    <p className="text-xs font-bold text-foreground truncate max-w-[130px]">{selectedNeed?.zone || "None"}</p>
                </div>
                {selectedNeed && (
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="size-8 rounded-full text-green-500 hover:bg-green-500/20 hover:text-green-600 ml-auto"
                        onClick={() => handleResolveNeed(selectedNeed.id)}
                        title="Mark as resolved"
                    >
                        <Check className="size-4" />
                    </Button>
                )}
            </div>
        </div>

        {/* RIGHT FLOATING PANEL - CONSOLIDATED FEEDS */}
        <div className="absolute right-6 top-6 w-64 max-h-[380px] flex flex-col pointer-events-none">
            <div className="pointer-events-auto flex flex-col h-full rounded-[2rem] border border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="p-1 bg-muted/50 border-b border-border/40">
                    <div className="grid grid-cols-2 gap-1">
                        <button 
                            onClick={() => setActiveFeed('priority')}
                            className={`px-3 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                activeFeed === 'priority' ? 'bg-[#2D6A4F] text-white shadow-lg' : 'text-foreground/60 hover:bg-white/10'
                            }`}
                        >
                            Priorities
                        </button>
                        <button 
                            onClick={() => setActiveFeed('sos')}
                            className={`px-3 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                activeFeed === 'sos' ? 'bg-destructive text-white shadow-lg' : 'text-foreground/60 hover:bg-muted'
                            }`}
                        >
                            SOS Feed
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {activeFeed === 'priority' ? (
                        currentNeeds.map((need) => (
                            <button 
                                key={need.id}
                                onClick={() => setSelectedNeed(need)}
                                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 shadow-sm ${
                                    selectedNeed.id === need.id 
                                    ? 'border-[#2D6A4F] bg-accent/60 backdrop-blur-md scale-[1.02]' 
                                    : 'border-border/40 bg-background/40 hover:bg-accent/60'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <p className="text-[11px] font-black text-foreground leading-tight line-clamp-1 drop-shadow-sm">{need.title}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-destructive drop-shadow-sm">
                                            {need.score}
                                        </span>
                                        <div 
                                          className="grid size-5 place-items-center rounded-full bg-green-500/10 hover:bg-green-500/30 text-green-500 transition-colors z-10"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleResolveNeed(need.id);
                                          }}
                                          title="Mark as resolved"
                                        >
                                          <Check className="size-3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-foreground/70 drop-shadow-sm">
                                        <Rss className="size-2.5 text-[#2D6A4F]" />
                                        {need.reports}
                                    </div>
                                    <ChevronRight className={`size-2.5 transition-transform text-foreground/50 ${selectedNeed.id === need.id ? 'translate-x-1 text-[#2D6A4F]' : ''}`} />
                                </div>
                            </button>
                        ))
                    ) : (
                        sosAlerts.map((alert) => (
                            <div key={alert.id} className="p-3.5 rounded-2xl border border-border/40 bg-background/40 hover:bg-accent/60 transition-colors group cursor-default">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${
                                        alert.severity === 'Critical' ? 'bg-destructive text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                        {alert.severity}
                                    </span>
                                    <span className="text-[8px] text-foreground/60 font-black drop-shadow-sm">{alert.time}</span>
                                </div>
                                <p className="text-[10px] font-bold text-foreground leading-snug line-clamp-2 group-hover:line-clamp-none transition-all drop-shadow-sm">{alert.message}</p>
                                <div className="mt-2 flex items-center gap-2 text-[8px] text-foreground/50 uppercase font-black tracking-tighter">
                                    <Activity className="size-2.5 text-destructive" /> {alert.source}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* AI STRATEGIC RESPONSE REPORT */}
      <section className="relative rounded-[2.5rem] border border-border/50 bg-card overflow-hidden shadow-soft">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <BrainCircuit className="size-64" />
        </div>
        
        <div className="p-10">
            <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white shadow-lg shadow-[#2D6A4F]/20">
                        <Sparkles className="size-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Strategic Intelligence Report</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`size-2 rounded-full ${isAuthorized ? 'bg-blue-500' : 'bg-[#2D6A4F]'} animate-pulse`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isAuthorized ? 'text-blue-500' : 'text-[#2D6A4F]'}`}>
                                {isAuthorized ? 'Command Override Active' : 'Real-time Analysis Active'}
                            </span>
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-border/60 hover:bg-secondary" onClick={() => toast.info("Accessing Level 4 AI Model Heuristics...")}>
                    View Methodology
                </Button>
            </div>
            
            <div className="grid lg:grid-cols-[1.2fr_1px_0.8fr] gap-12 items-stretch">
                <div className="space-y-6">
                    <div className="bg-secondary/10 rounded-3xl p-8 border border-border/40 relative overflow-hidden group">
                        {isSimulating && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex items-center justify-center p-8">
                                <div className="w-full max-w-xs space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-center text-[#2D6A4F]">Computing Mission Scenarios...</p>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2D6A4F] animate-progress-fast" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUp className="size-16 text-[#2D6A4F]" />
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="size-3 text-[#2D6A4F]" />
                            Primary Deployment Recommendation
                        </p>
                        <p className="text-lg text-foreground leading-relaxed font-medium">
                            Synthesizing data from <span className="text-[#2D6A4F] font-bold underline decoration-2 underline-offset-4">Sector 7 Distress Cluster</span> and satellite soil moisture telemetry. 
                        </p>
                        <p className="text-muted-foreground mt-4 leading-relaxed">
                            Immediate redirection of <span className="font-bold text-foreground">Unit Alpha-4</span> to Dharavi West is critical. Delayed response beyond <span className="text-destructive font-bold">45 minutes</span> increases the probability of a level 4 resource collapse by 64%.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Button 
                                className={`flex-1 ${isAuthorized ? 'bg-blue-600' : 'bg-[#2D6A4F]'} text-white hover:opacity-90 rounded-2xl h-12 font-bold shadow-lg transition-all`}
                                onClick={handleAuthorize}
                                disabled={isAuthorized}
                            >
                                {isAuthorized ? 'Redirection Authorized' : 'Authorize Redirection'}
                            </Button>
                            <Button 
                                variant="outline" 
                                className="rounded-2xl h-12 px-6 border-border/60" 
                                onClick={handleSimulate}
                                disabled={isSimulating}
                            >
                                Simulate Outcome
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />

                <div className="flex flex-col justify-between py-2">
                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl border border-border/40 bg-card/50 hover:bg-card transition-all group cursor-default">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="size-4 text-orange-500" />
                                <p className="text-sm font-bold text-foreground">Coastal Surge Warning</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">82% probability of tide-induced flooding in Mahim. Evacuation protocols recommended for low-lying transit camps.</p>
                        </div>
                        
                        <div className="p-5 rounded-2xl border border-border/40 bg-card/50 hover:bg-card transition-all group cursor-default">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="size-4 text-green-500" />
                                <p className="text-sm font-bold text-foreground">Logistics Verification</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Medical supply chain to Central Hub verified via blockchain audit. 100% stock integrity confirmed for emergency meds.</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-border/40 flex flex-col gap-4">
                        <Button 
                            className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white hover:bg-[#1B4332] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#2D6A4F]/30 flex items-center justify-center gap-3 transition-all active:scale-95 group relative overflow-hidden"
                            onClick={() => executeAIAutoAllocation(false)}
                            disabled={isAllocating}
                        >
                            {isAllocating ? (
                                <>
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    <Sparkles className="size-4 animate-spin" />
                                    Synthesizing Deployment Vectors...
                                </>
                            ) : (
                                <>
                                    <BrainCircuit className="size-5 group-hover:rotate-12 transition-transform" />
                                    AI Command: Auto-Allocate Field Assets
                                    <Zap className="size-4 text-orange-400 fill-orange-400" />
                                </>
                            )}
                        </Button>
                        <div className="flex items-center justify-between px-2">
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Model Precision</p>
                                <p className="text-lg font-extrabold text-[#2D6A4F]">98.4%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Decision Latency</p>
                                <p className="text-lg font-extrabold text-foreground">14ms</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
