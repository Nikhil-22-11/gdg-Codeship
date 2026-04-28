import { useState } from "react";
import { Shield, Activity, Zap, Heart, Bell, Database, Lock, Layout, Smartphone, ChevronRight, Plus, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { initialVolunteers } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Teams = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([
    { 
      name: "Tactical Alpha (Medics)", 
      desc: "Rapid trauma response and field triage units.",
      members: 12,
      active: 8,
      status: "On Mission",
      icon: Activity,
      color: "bg-red-500"
    },
    { 
      name: "Logistics Bravo", 
      desc: "Supply chain and heavy infrastructure clearance.",
      members: 24,
      active: 18,
      status: "Available",
      icon: Zap,
      color: "bg-[#2D6A4F]"
    },
    { 
      name: "Community Care Delta", 
      desc: "Shelter and psychological support coordination.",
      members: 40,
      active: 32,
      status: "On Mission",
      icon: Heart,
      color: "bg-pink-500"
    },
    { 
      name: "Engineering Sigma", 
      desc: "Structural assessments and housing repair.",
      members: 15,
      active: 5,
      status: "Available",
      icon: Shield,
      color: "bg-blue-500"
    },
  ]);

  const handleCreateTeam = () => {
    if (!teamName) {
        toast.error("Please enter a team name.");
        return;
    }
    if (selectedVolunteers.length === 0) {
        toast.error("Please select at least one volunteer.");
        return;
    }

    const newTeam = {
        name: teamName,
        desc: `Custom unit assembled with ${selectedVolunteers.length} specialized responders.`,
        members: selectedVolunteers.length,
        active: selectedVolunteers.length,
        status: "Available",
        icon: Users,
        color: "bg-[#2D6A4F]"
    };

    setTeams(prev => [newTeam, ...prev]);

    toast.success(`Team "${teamName}" created with ${selectedVolunteers.length} members!`, {
        description: "Deployment authorization pending command approval.",
        icon: <CheckCircle2 className="size-4 text-green-500" />
    });
    setIsCreateOpen(false);
    setTeamName("");
    setSelectedVolunteers([]);
  };

  const toggleVolunteer = (id: number) => {
    setSelectedVolunteers(prev => 
        prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Operational Teams</h1>
            <p className="text-muted-foreground text-sm mt-1">Global coordination of tactical response units.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#2D6A4F] text-white hover:bg-[#1B4332] rounded-full px-6">
                    <Plus className="mr-2 size-4" />
                    Create Team
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-border/40 bg-card p-0 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="h-2 w-full bg-gradient-to-r from-[#2D6A4F] to-[#40916C]" />
                <div className="p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Form New Tactical Unit</DialogTitle>
                        <p className="text-muted-foreground text-sm">Select verified responders to assemble a mission-ready team.</p>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Team Designation</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Rescue Squad Echo" 
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-border/40 bg-background text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Select Responders ({selectedVolunteers.length})</label>
                            <ScrollArea className="h-[280px] rounded-2xl border border-border/40 bg-background/50 p-2">
                                <div className="space-y-1">
                                    {initialVolunteers.map((v) => (
                                        <div 
                                            key={v.id} 
                                            onClick={() => toggleVolunteer(v.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                                selectedVolunteers.includes(v.id) 
                                                ? 'bg-[#2D6A4F]/10 border-[#2D6A4F]/30 border' 
                                                : 'hover:bg-secondary/50 border border-transparent'
                                            }`}
                                        >
                                            <div className="relative">
                                                <img src={v.image} alt={v.name} className="size-10 rounded-full object-cover border border-border/40" />
                                                {selectedVolunteers.includes(v.id) && (
                                                    <div className="absolute -top-1 -right-1 size-4 bg-[#2D6A4F] rounded-full flex items-center justify-center border-2 border-card">
                                                        <CheckCircle2 className="size-2.5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-foreground truncate">{v.name}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{v.occupation} • {v.experience}</p>
                                            </div>
                                            <Checkbox 
                                                checked={selectedVolunteers.includes(v.id)} 
                                                onCheckedChange={() => toggleVolunteer(v.id)}
                                                className="border-muted-foreground/30 data-[state=checked]:bg-[#2D6A4F] data-[state=checked]:border-[#2D6A4F]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button variant="ghost" className="rounded-xl h-11 px-6 font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button 
                            className="rounded-xl h-11 px-8 bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-lg shadow-[#2D6A4F]/20 font-bold"
                            onClick={handleCreateTeam}
                        >
                            Confirm Team Assembly
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teams.map((team) => (
          <article key={team.name} className="rounded-2xl border border-border/50 bg-card p-6 shadow-soft transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className={`grid size-10 place-items-center rounded-xl ${team.color} text-white shadow-lg`}>
                    <team.icon className="size-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${team.status === 'On Mission' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'}`}>
                    {team.status === 'On Mission' ? 'Active' : 'Standby'}
                </span>
            </div>
            <h2 className="text-sm font-bold text-foreground truncate">{team.name}</h2>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">{team.desc}</p>
            <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
                <div className="flex gap-4">
                    <div>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold">Size</p>
                        <p className="text-xs font-bold">{team.members}</p>
                    </div>
                    <div>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold">On-Site</p>
                        <p className="text-xs font-bold text-[#2D6A4F]">{team.active}</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[#2D6A4F] font-bold text-[10px] hover:bg-[#2D6A4F]/10" onClick={() => toast.info(`Viewing roster and status for ${team.name}...`)}>View</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export const Settings = () => (
  <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl pb-20">
    <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure operational environment and encryption keys.</p>
    </div>

    <div className="space-y-3">
        {[
            { label: "Notification Preferences", desc: "SMS, Email and Push alerts for high-urgency needs.", icon: Bell },
            { label: "Data & Synchronization", desc: "Manage offline cache and satellite frequency.", icon: Database },
            { label: "Security & Access", desc: "MFA and role-based permissions.", icon: Lock },
            { label: "Interface Customization", desc: "Themes and map defaults.", icon: Layout },
            { label: "Mobile Deployment", desc: "Handheld link and field forms.", icon: Smartphone },
        ].map((item) => (
            <button key={item.label} className="w-full text-left p-4 rounded-xl border border-border/40 bg-card hover:border-[#2D6A4F]/40 hover:bg-secondary/5 transition-all group shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="grid size-9 place-items-center rounded-lg bg-secondary/50 text-muted-foreground group-hover:bg-[#2D6A4F]/10 group-hover:text-[#2D6A4F] transition-colors">
                        <item.icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-[#2D6A4F] transition-colors" />
                </div>
            </button>
        ))}
    </div>

    <div className="pt-6">
        <Button className="w-full bg-[#2D6A4F] text-white hover:bg-[#1B4332] rounded-xl h-12 text-sm font-bold shadow-lg shadow-[#2D6A4F]/20" onClick={() => toast.success("System configurations updated successfully.")}>
            Apply Changes
        </Button>
    </div>
  </div>
);

export const About = () => null;
