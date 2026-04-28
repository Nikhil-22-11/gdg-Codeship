import { DatabaseZap, ArrowUpRight, ArrowDownLeft, Wallet, PieChart, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

const transactions = [
  { id: 1, desc: "Procurement of Medical Supplies", category: "Healthcare", amount: -42000, date: "Apr 22, 2026", status: "Completed" },
  { id: 2, desc: "Emergency Grant - Sector 4", category: "Grants", amount: 150000, date: "Apr 21, 2026", status: "Pending" },
  { id: 3, desc: "Logistics Fuel Subsidy", category: "Logistics", amount: -12500, date: "Apr 20, 2026", status: "Completed" },
  { id: 4, desc: "NGO Donation Pool", category: "Donations", amount: 85000, date: "Apr 19, 2026", status: "Completed" },
  { id: 5, desc: "Water Tanker Leasing", category: "Infrastructure", amount: -28000, date: "Apr 18, 2026", status: "Completed" },
  { id: 6, desc: "Satellite Bandwidth Lease", category: "Telecom", amount: -15000, date: "Apr 17, 2026", status: "Completed" },
  { id: 7, desc: "Regional Hub Maintenance", category: "Infrastructure", amount: -62000, date: "Apr 16, 2026", status: "Completed" },
  { id: 8, desc: "Disaster Bond Yield", category: "Investment", amount: 12000, date: "Apr 15, 2026", status: "Completed" },
];

const Finance = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Financial Ledger</h1>
        <p className="text-muted-foreground text-sm">Monitor budget allocation and operational spending across missions.</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-[#2D6A4F] p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="grid size-10 place-items-center rounded-xl bg-white/20">
                    <Wallet className="size-5" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Total Balance</div>
            </div>
            <p className="text-3xl font-bold">₹1,248,500.00</p>
            <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                <ArrowUpRight className="size-3" />
                +12.4% from last month
            </p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="grid size-10 place-items-center rounded-xl bg-orange-100/10 text-orange-500">
                    <PieChart className="size-5" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Allocated</div>
            </div>
            <p className="text-3xl font-bold text-foreground">₹842,000.00</p>
            <div className="w-full h-1.5 bg-secondary/20 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '68%' }} />
            </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="grid size-10 place-items-center rounded-xl bg-blue-100/10 text-blue-500">
                    <Landmark className="size-5" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Operational Spend</div>
            </div>
            <p className="text-3xl font-bold text-foreground">₹312,400.00</p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <ArrowDownLeft className="size-3 text-blue-600" />
                Under budget by 4%
            </p>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <section className="rounded-2xl border border-border/50 bg-card shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Recent Transactions</h2>
            
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs">View Full Ledger</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] rounded-[2rem] border-border/40 bg-card p-0 overflow-hidden shadow-2xl">
                    <div className="h-2 w-full bg-[#2D6A4F]" />
                    <div className="p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-foreground">Comprehensive Audit Ledger</DialogTitle>
                            <p className="text-sm text-muted-foreground">Full financial history and grant distribution records.</p>
                        </DialogHeader>
                        
                        <div className="mt-8 rounded-xl border border-border/40 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-secondary/10">
                                        <th className="px-4 py-3 text-[9px] font-bold uppercase text-muted-foreground">Date</th>
                                        <th className="px-4 py-3 text-[9px] font-bold uppercase text-muted-foreground">Description</th>
                                        <th className="px-4 py-3 text-[9px] font-bold uppercase text-muted-foreground text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="text-[11px] hover:bg-secondary/5">
                                            <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                                            <td className="px-4 py-3 font-medium text-foreground">{t.desc}</td>
                                            <td className={`px-4 py-3 font-bold text-right ${t.amount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                                                ₹{Math.abs(t.amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <Button className="bg-[#2D6A4F] text-white hover:bg-[#1B4332] rounded-xl px-6 h-11 font-bold shadow-lg shadow-[#2D6A4F]/20" onClick={() => toast.success("Ledger exported as encrypted PDF.")}>Export Audit PDF</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-secondary/10">
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Description</th>
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Amount</th>
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-secondary/5 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-foreground">{t.desc}</td>
                            <td className="px-6 py-4 text-xs text-muted-foreground">{t.category}</td>
                            <td className="px-6 py-4 text-xs text-muted-foreground">{t.date}</td>
                            <td className={`px-6 py-4 text-sm font-bold text-right ${t.amount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                                {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                    {t.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
};

export default Finance;
