import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Clock, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialTasks = [
  { id: 1, title: "Deliver Water Tankers", zone: "Dharavi", priority: "High", status: "Unassigned", time: "12m ago" },
  { id: 2, title: "Medical Kit Refill", zone: "Kurla", priority: "Medium", status: "Unassigned", time: "45m ago" },
  { id: 3, title: "Evacuate Block 4", zone: "Mahim", priority: "Critical", status: "In Progress", time: "1h ago" },
  { id: 4, title: "Power Line Repair", zone: "Sion", priority: "Medium", status: "In Progress", time: "2h ago" },
  { id: 5, title: "Food Distribution", zone: "Sector 7", priority: "High", status: "In Progress", time: "3h ago" },
  { id: 6, title: "Route Clearance", zone: "Highway 4", priority: "Low", status: "Completed", time: "5h ago" },
];

const NeedsHandling = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", zone: "", priority: "Medium" });

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      // Map 'stage' from backend to 'status' for frontend backwards compatibility
      setTasks(data.map((t: any) => ({ ...t, status: t.stage || 'Unassigned', time: "Just now" })));
    } catch (e) {
      console.error(e);
      setTasks(initialTasks); // Fallback
    }
  };

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 5000); // Poll for real-time feel
    return () => clearInterval(interval);
  }, []);

  const moveTask = async (id: string | number, newStatus: string) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await fetch(`/api/tasks/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStatus })
      });
      toast.success(`Task moved to ${newStatus}`);
    } catch (e) {
      toast.error("Failed to sync move with backend");
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.zone) {
        toast.error("Please fill all fields.");
        return;
    }
    const taskData = {
        ...newTask,
        stage: "Unassigned",
        requiredSkills: []
    };
    
    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        const savedTask = await res.json();
        setTasks(prev => [{...savedTask, status: savedTask.stage, time: "Just now"}, ...prev]);
        toast.success("New task initialized in command queue.");
    } catch (e) {
        toast.error("Failed to create task on backend.");
    }
    
    setIsCreateOpen(false);
    setNewTask({ title: "", zone: "", priority: "Medium" });
  };

  const columns = ["Unassigned", "In Progress", "Completed"];

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Needs Handling</h1>
          <p className="text-muted-foreground text-sm mt-1">Orchestrate field tasks and manage response workflows.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1B4332]">
                    <Plus className="mr-2 size-4" />
                    Create New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-border/40 bg-card p-6 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-foreground">Initialize Tactical Task</DialogTitle>
                    <p className="text-xs text-muted-foreground">Assign a new objective to the humanitarian queue.</p>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Task Title</Label>
                        <Input 
                            id="title" 
                            placeholder="e.g., Medical Resupply" 
                            className="h-11 rounded-xl border-border/40 focus:ring-[#2D6A4F]/20" 
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="zone" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Deployment Zone</Label>
                        <Input 
                            id="zone" 
                            placeholder="e.g., Sector 9 Relief Center" 
                            className="h-11 rounded-xl border-border/40 focus:ring-[#2D6A4F]/20" 
                            value={newTask.zone}
                            onChange={(e) => setNewTask({...newTask, zone: e.target.value})}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="priority" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Priority Level</Label>
                        <Select 
                            value={newTask.priority} 
                            onValueChange={(v) => setNewTask({...newTask, priority: v})}
                        >
                            <SelectTrigger className="h-11 rounded-xl border-border/40">
                                <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        className="w-full h-11 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1B4332] font-bold shadow-lg shadow-[#2D6A4F]/20"
                        onClick={handleCreateTask}
                    >
                        Confirm Task Creation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 min-h-0 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((col) => (
          <div key={col} className="flex-1 min-w-[320px] flex flex-col bg-secondary/10 rounded-2xl border border-border/40 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-border/40 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-foreground">{col}</h2>
                    <span className="flex items-center justify-center size-5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">
                        {tasks.filter(t => t.status === col).length}
                    </span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => toast.info(`Managing ${col} column...`)}>
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => toast.info(`Optimizing ${col} workflow...`)}>Optimize Column</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Exporting ${col} tasks...`)}>Export Tasks</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => toast.error(`Archiving all tasks in ${col}...`)}>Archive All</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {tasks.filter(t => t.status === col).map((task) => (
                    <article 
                        key={task.id} 
                        className="p-4 rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#2D6A4F]/30"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                task.priority === 'Critical' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                task.priority === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                            }`}>
                                {task.priority}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Clock className="size-3" />
                                {task.time}
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-foreground mb-3">{task.title}</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <MapPin className="size-3" />
                                {task.zone}
                            </div>
                            <div className="flex gap-1">
                                {col !== "Completed" && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="size-7 rounded-lg hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]"
                                        onClick={() => moveTask(task.id, col === "Unassigned" ? "In Progress" : "Completed")}
                                    >
                                        <ArrowRight className="size-3.5" />
                                    </Button>
                                )}
                                {col === "Completed" && (
                                    <CheckCircle className="size-4 text-green-500" />
                                )}
                            </div>
                        </div>
                    </article>
                ))}
                {tasks.filter(t => t.status === col).length === 0 && (
                    <div className="h-32 flex items-center justify-center rounded-xl border border-dashed border-border/60">
                        <p className="text-xs text-muted-foreground">No tasks in this stage.</p>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeedsHandling;
