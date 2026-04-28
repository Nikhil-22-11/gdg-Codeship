import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout, { TabId } from "@/components/DashboardLayout";
import { toast } from "sonner";
import { ShieldCheck, LogOut } from "lucide-react";

// Pages
import LandingPage from "./pages/LandingPage";
import Overview from "./pages/Overview";
import VolunteerDirectory from "./pages/VolunteerDirectory";
import Reports from "./pages/Reports";
import NeedsHandling from "./pages/NeedsHandling";
import Finance from "./pages/Finance";
import Allocations from "./pages/Allocations";
import { Teams, About, Settings } from "./pages/Placeholders";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("Overview");

  const handleLogin = () => {
    toast.promise(new Promise(r => setTimeout(r, 1000)), {
        loading: 'Authenticating credentials...',
        success: () => {
            setIsAuthenticated(true);
            return 'Command Center Access Granted.';
        },
        error: 'Authentication failed.',
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast("Session Terminated", {
        description: "You have been securely logged out.",
        icon: <LogOut className="size-4 text-orange-500" />
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview": return <Overview />;
      case "Volunteer Directory": return <VolunteerDirectory />;
      case "Reports": return <Reports />;
      case "Needs Handling": return <NeedsHandling />;
      case "Finance": return <Finance />;
      case "Allocations": return <Allocations />;
      case "Teams": return <Teams />;
      case "About": return <About />;
      case "Settings": return <Settings />;
      default: return <Overview />;
    }
  };

  if (!isAuthenticated) {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Sonner position="top-center" />
                <LandingPage onLogin={handleLogin} />
            </TooltipProvider>
        </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DashboardLayout 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
        >
          {renderContent()}
        </DashboardLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
