import { ReactNode } from "react";
import {
  Bell,
  Search,
  User,
  Waves,
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  DatabaseZap,
  HandHeart,
  Settings,
  LogOut,
  UserCheck
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";

export type TabId = 
  | "Overview" 
  | "Volunteer Directory" 
  | "Reports" 
  | "Needs Handling" 
  | "Finance" 
  | "Allocations"
  | "Teams" 
  | "About" 
  | "Settings";

interface NavItem {
  label: TabId;
  icon: any;
}

const navTop: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Volunteer Directory", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Needs Handling", icon: ClipboardList },
  { label: "Finance", icon: DatabaseZap },
  { label: "Allocations", icon: UserCheck },
  { label: "Teams", icon: HandHeart },
];

const navBottom: NavItem[] = [
  { label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onLogout: () => void;
  children: ReactNode;
}

const DashboardLayout = ({ activeTab, setActiveTab, onLogout, children }: DashboardLayoutProps) => {
  return (
    <main className="min-h-screen bg-background text-foreground font-inter transition-colors duration-300">
      <div className="grid min-h-screen grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* SIDEBAR */}
        <aside className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-border bg-card px-3 py-5 xl:px-4">
          <div className="mb-7 flex items-center justify-center gap-3 xl:justify-start cursor-pointer" onClick={() => setActiveTab("Overview")}>
            <div className="flex size-10 items-center justify-center rounded-md bg-[#2D6A4F] text-white">
              <Waves className="size-5" />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-semibold leading-tight">The Human Company</p>
              <p className="text-[11px] text-muted-foreground">Disaster response OS</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {navTop.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex h-10 w-full items-center justify-center gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200 xl:justify-start ${
                  activeTab === item.label
                    ? "bg-[#2D6A4F] text-white shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:scale-[1.02]"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="hidden truncate xl:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="space-y-1 border-t border-border pt-3">
            {navBottom.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex h-10 w-full items-center justify-center gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200 xl:justify-start ${
                  activeTab === item.label
                    ? "bg-[#2D6A4F] text-white shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:scale-[1.02]"
                }`}
              >
                <item.icon className="size-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            ))}
            <button
                onClick={onLogout}
                className="flex h-10 w-full items-center justify-center gap-3 rounded-md px-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 xl:justify-start"
            >
                <LogOut className="size-4" />
                <span className="hidden xl:inline">Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex flex-col h-screen overflow-hidden">
          {/* Header Bar */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4 flex-1">
              <label className="flex max-w-md flex-1 items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 transition-focus-within focus-within:bg-card focus-within:shadow-sm">
                <Search className="size-4 text-muted-foreground" />
                <input
                  placeholder="Search resources, units, or needs..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative rounded-full border border-border/60 bg-card/50 p-2 transition-all hover:bg-card hover:shadow-sm active:scale-95" onClick={() => toast.info("No new alerts since last mission sync.")}>
                <Bell className="size-4" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive border-2 border-white dark:border-slate-900" />
              </button>
              <div className="h-4 w-px bg-border/60 mx-1" />
              <ThemeToggle />
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 p-1 pr-3 transition-all hover:bg-card hover:shadow-sm active:scale-95"
              >
                <div className="grid size-8 place-items-center rounded-full bg-[#2D6A4F] text-white">
                  <User className="size-4" />
                </div>
                <span className="hidden text-sm font-semibold sm:inline">Command HQ</span>
              </button>
            </div>
          </header>

          {/* Dynamic Area */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-background">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardLayout;
