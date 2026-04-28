import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { FileText, Download, TrendingUp, TrendingDown, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const data = [
  { time: "08:00", value: 45, trend: 12 },
  { time: "10:00", value: 52, trend: 15 },
  { time: "12:00", value: 48, trend: 10 },
  { time: "14:00", value: 61, trend: 22 },
  { time: "16:00", value: 55, trend: 18 },
  { time: "18:00", value: 67, trend: 25 },
  { time: "20:00", value: 72, trend: 30 },
];

const impactMetrics = [
  { label: "Resource Efficiency", value: "84%", change: "+4.2%", positive: true, icon: TrendingUp },
  { label: "Response Time (Avg)", value: "14.2m", change: "-2.1m", positive: true, icon: Clock },
  { label: "Target Reach", value: "92.1%", change: "+1.5%", positive: true, icon: Target },
  { label: "Active Incidents", value: "32", change: "+5", positive: false, icon: TrendingDown },
];

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    toast.loading("Aggregating mission data and trends...", { id: "report-toast" });
    
    setTimeout(() => {
        toast.loading("Analyzing resource distribution efficiency...", { id: "report-toast" });
    }, 1500);

    setTimeout(() => {
        setIsGenerating(false);
        toast.success("Analytical Report Generated Successfully.", {
            id: "report-toast",
            description: "PDF summary has been compiled and encrypted.",
            icon: <FileText className="size-4 text-[#2D6A4F]" />
        });
    }, 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Impact & Trends</h1>
          <p className="text-muted-foreground text-sm mt-1">Analyzing resource distribution efficiency and mission success rates.</p>
        </div>
        <Button 
            className="rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1B4332] h-11 px-6 shadow-lg shadow-[#2D6A4F]/20" 
            onClick={handleGenerateReport}
            disabled={isGenerating}
        >
            <Download className="mr-2 size-4" />
            {isGenerating ? "Compiling..." : "Generate Full Report"}
        </Button>
      </div>

      {isGenerating && (
        <div className="rounded-2xl border border-[#2D6A4F]/30 bg-[#2D6A4F]/5 p-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">Report Compilation in Progress</p>
                <p className="text-xs font-bold text-[#2D6A4F]">Optimizing Data Points...</p>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-[#2D6A4F] animate-progress-slow" />
            </div>
        </div>
      )}

      {/* METRICS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {impactMetrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border/50 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
                <div className="grid size-9 place-items-center rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F]">
                    <m.icon className="size-4" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${m.positive ? 'text-green-500' : 'text-destructive'}`}>
                    {m.change}
                    {m.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-foreground">Resource Deployment Trend</h2>
            <div className="text-[10px] font-bold text-muted-foreground uppercase">Last 24 Hours</div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: 'hsl(var(--muted-foreground))'}}
                    dy={10}
                />
                <YAxis 
                    hide 
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2D6A4F" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-foreground">Response Precision Index</h2>
            <div className="text-[10px] font-bold text-muted-foreground uppercase">Live Accuracy</div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: 'hsl(var(--muted-foreground))'}}
                    dy={10}
                />
                <YAxis hide />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                    type="stepAfter" 
                    dataKey="trend" 
                    stroke="#FF9F1C" 
                    strokeWidth={3}
                    dot={{ fill: '#FF9F1C', r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* DETAILED CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        {["Logistics Efficiency", "Medical Reach", "Food Security"].map((title, i) => (
            <div key={title} className="p-4 rounded-xl border border-border/40 bg-card shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{title}</span>
                    <FileText className="size-4 text-[#2D6A4F]/60" />
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-foreground">{88 + i * 3}%</span>
                    <span className="text-[10px] font-bold text-green-500 mb-1">+2.4%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2D6A4F]" style={{ width: `${88 + i * 3}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                    Current resource flow exceeds baseline optimization by 14% this week.
                </p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
