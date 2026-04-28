import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  ClipboardList,
  DatabaseZap,
  FileText,
  HandHeart,
  LayoutDashboard,
  MapPin,
  RefreshCw,
  Rss,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  Truck,
  User,
  Users,
  Waves,
  AlertCircle,
} from "lucide-react";
import { Marker } from "react-map-gl/maplibre";

import { Button } from "@/components/ui/button";
import { Map, type MapRef } from "@/components/ui/map";
import Testimonials from "@/components/Testimonials";
import ThemeToggle from "@/components/ThemeToggle";
import aishaImg from "@/assets/volunteer-aisha.jpg";
import danielImg from "@/assets/volunteer-daniel.jpg";
import josephImg from "@/assets/volunteer-joseph.jpg";
import meeraImg from "@/assets/volunteer-meera.jpg";

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

const needs: Need[] = [
  { id: 8421, title: "Water Shortage — Ward 4", zone: "Dharavi Relief Grid", score: 9.2, reports: 257, coordinates: [72.8553, 19.038], impacted: 142, type: "Water" },
  { id: 8417, title: "Food Crisis — Transit Camp", zone: "Kurla Transit Camp", score: 9.3, reports: 209, coordinates: [72.8796, 19.0726], impacted: 118, type: "Food" },
  { id: 8398, title: "Medical Triage Needed", zone: "Sion Medical Line", score: 8.9, reports: 99, coordinates: [72.8611, 19.044], impacted: 76, type: "Healthcare" },
  { id: 8374, title: "Coastal Evacuation Block", zone: "Mahim Coastal Block", score: 9.1, reports: 39, coordinates: [72.8401, 19.0427], impacted: 64, type: "Logistics" },
];

const volunteers = [
  { name: "Dr. Jane Doe", occupation: "Field Medic", experience: "5+ Years", distance: "1.2 km away", match: 96, image: aishaImg },
  { name: "Dr. Aisha Rahman", occupation: "Community Nurse", experience: "6+ Years", distance: "1.8 km away", match: 94, image: danielImg },
  { name: "Dr. Meera Patel", occupation: "Logistics Lead", experience: "5+ Years", distance: "2.4 km away", match: 91, image: meeraImg },
  { name: "Dr. Joseph Kamau", occupation: "Rescue Paramedic", experience: "7+ Years", distance: "3.1 km away", match: 88, image: josephImg },
];

const navTop = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Needs Map", icon: MapPin, active: true },
  { label: "Volunteer Directory", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Needs Handling", icon: ClipboardList },
  { label: "Finance", icon: DatabaseZap },
  { label: "Teams", icon: HandHeart },
];

const fieldReports = [
  {
    id: 1,
    source: "SMS Gateway #421",
    statement: "Critical water shortage in Sector 7. Immediate tanker support required for 200+ families.",
    severity: "Critical",
    tone: "destructive",
    time: "2m ago",
    icon: AlertCircle,
  },
  {
    id: 2,
    source: "Field Unit Alpha",
    statement: "Logistics route blocked by fallen debris at Highway Intersection 4. Detour needed.",
    severity: "Moderate",
    tone: "accent",
    time: "14m ago",
    icon: Truck,
  },
  {
    id: 3,
    source: "Gov Satellite Feed",
    statement: "Power restoration confirmed in Northeast quadrant. Communication towers active.",
    severity: "Recovered",
    tone: "success",
    time: "32m ago",
    icon: CheckCircle2,
  },
  {
    id: 4,
    source: "Paper Survey — Zone A",
    statement: "Digitized intake: 38 households reporting medical triage needs near Cité Soleil shelter.",
    severity: "Critical",
    tone: "destructive",
    time: "47m ago",
    icon: FileText,
  },
];

const Index = () => {
  const mapRef = useRef<MapRef>(null);
  const [selectedNeed, setSelectedNeed] = useState(needs[0]);
  const [mapStyle, setMapStyle] = useState<"default" | "openstreetmap" | "openstreetmap3d">("openstreetmap");
  const styles = useMemo(
    () => ({
      default: undefined,
      openstreetmap: "https://tiles.openfreemap.org/styles/bright",
      openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
    }),
    [],
  );

  useEffect(() => {
    mapRef.current?.easeTo({ center: selectedNeed.coordinates, zoom: 11.8, pitch: mapStyle === "openstreetmap3d" ? 60 : 0, duration: 500 });
  }, [selectedNeed, mapStyle]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* SIDEBAR — fixed, non-scrollable */}
        <aside className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-border bg-card px-3 py-5 xl:px-4">
          <div className="mb-7 flex items-center justify-center gap-3 xl:justify-start">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Waves className="size-5" />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-semibold leading-tight">The Human Company</p>
              <p className="text-[11px] text-muted-foreground">Disaster response OS</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-hidden">
            {navTop.map((item) => (
              <button
                key={item.label}
                className={`flex h-10 w-full items-center justify-center gap-3 rounded-md px-3 text-sm font-medium transition xl:justify-start ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="hidden truncate xl:inline">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="space-y-1 border-t border-border pt-3">
            {[
              { label: "About", Icon: ShieldCheck },
              { label: "Settings", Icon: Settings },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                className="flex h-10 w-full items-center justify-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary xl:justify-start"
              >
                <Icon className="size-4" />
                <span className="hidden xl:inline">{label}</span>
              </button>
            ))}
            <Button variant="command" className="mt-3 h-10 w-full rounded-md px-0 xl:px-4">
              <Siren className="size-4" />
              <span className="hidden xl:inline">Deploy Responders</span>
            </Button>
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 p-4 xl:p-6">
          {/* Top bar */}
          <header className="mb-5 flex flex-col gap-3 rounded-md border border-border bg-card p-2.5 shadow-soft xl:flex-row xl:items-center xl:justify-between">
            <nav className="flex flex-wrap gap-1 text-sm font-medium">
              {["Community Pulse", "Analytics", "Active Projects", "Resource Allocation"].map((label, index) => (
                <button
                  key={label}
                  className={`rounded-md px-3 py-1.5 transition ${
                    index === 0 ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 sm:min-w-64">
                <Search className="size-4 text-muted-foreground" />
                <input
                  aria-label="Search coordinates"
                  placeholder="Search coordinates"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button className="relative rounded-md border border-border bg-background p-2">
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
              </button>
              <ThemeToggle />
              <button
                type="button"
                aria-label="Profile"
                className="flex items-center gap-2 rounded-md border border-border bg-background p-1.5 pr-3 transition hover:bg-secondary"
              >
                <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
                  <User className="size-4" />
                </span>
                <span className="hidden text-sm font-semibold sm:inline">Profile</span>
              </button>
            </div>
          </header>

          {/* QUICK STATS — 4 white cards w/ left accent stripe */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Card 1 — Total Urgent Needs (red accent) */}
            <article className="relative flex items-center justify-between overflow-hidden rounded-md border border-border bg-card p-4 pl-5 shadow-soft">
              <span className="absolute inset-y-0 left-0 w-1 bg-destructive" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Urgent Needs</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground">142</span>
                  <span className="text-xs font-medium text-destructive">+12% vs last hr</span>
                </p>
              </div>
              <div className="grid size-9 place-items-center rounded-md bg-destructive/10 text-destructive">
                <Siren className="size-4" />
              </div>
            </article>

            {/* Card 2 — Active Volunteers (green accent) */}
            <article className="relative flex items-center justify-between overflow-hidden rounded-md border border-border bg-card p-4 pl-5 shadow-soft">
              <span className="absolute inset-y-0 left-0 w-1 bg-primary" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Volunteers</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground">892</span>
                  <span className="text-xs font-medium text-muted-foreground">On-Site: 240</span>
                </p>
              </div>
              <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                <Users className="size-4" />
              </div>
            </article>

            {/* Card 3 — Tasks Completed (blue accent) */}
            <article className="relative flex items-center justify-between overflow-hidden rounded-md border border-border bg-card p-4 pl-5 shadow-soft">
              <span className="absolute inset-y-0 left-0 w-1 bg-sky-500" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tasks Completed</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground">3,120</span>
                  <span className="text-xs font-medium text-muted-foreground">94% Target</span>
                </p>
              </div>
              <div className="grid size-9 place-items-center rounded-md bg-sky-500/10 text-sky-600">
                <CheckCircle2 className="size-4" />
              </div>
            </article>

            {/* Card 4 — Data Accuracy Index (mustard accent) */}
            <article className="relative flex items-center justify-between overflow-hidden rounded-md border border-border bg-card p-4 pl-5 shadow-soft">
              <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Data Accuracy Index</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground">98.4</span>
                  <span className="text-xs font-medium text-muted-foreground">Verified Logs</span>
                </p>
              </div>
              <div className="grid size-9 place-items-center rounded-md bg-accent/20 text-accent-foreground">
                <ShieldCheck className="size-4" />
              </div>
            </article>
          </div>

          {/* CENTRAL ZONE — Map + Priority Feed (side-by-side) */}
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* MAP — smaller */}
            <section className="overflow-hidden rounded-md border border-border bg-card shadow-soft">
              <div className="relative h-[460px] min-h-[400px]">
                <Map
                  ref={mapRef}
                  mapStyle={styles[mapStyle]}
                  initialViewState={{ longitude: 72.8656, latitude: 19.0607, zoom: 10.7 }}
                >
                  {needs.map((need) => (
                    <Marker key={need.id} longitude={need.coordinates[0]} latitude={need.coordinates[1]} anchor="bottom">
                      <button onClick={() => setSelectedNeed(need)} className="group relative flex flex-col items-center">
                        <span className="mb-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground shadow-soft">
                          {need.reports}
                        </span>
                        <span className="relative grid size-9 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-soft transition group-hover:-translate-y-1">
                          <span className="absolute inset-0 rounded-full bg-destructive/40 motion-safe-only animate-pulse-ring" />
                          <MapPin className="relative size-5 fill-current" />
                        </span>
                      </button>
                    </Marker>
                  ))}
                </Map>
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-border bg-card/95 px-3 py-2 shadow-soft backdrop-blur">
                  <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
                    <MapPin className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">Live Humanitarian Heatmap</p>
                    <p className="text-[11px] text-muted-foreground">Active: {selectedNeed.zone}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-card/95 px-3 py-1.5 text-[11px] shadow-soft backdrop-blur">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> Critical</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" /> Moderate</span>
                </div>
                <div className="absolute right-4 top-4 flex flex-wrap gap-1 rounded-full border border-border bg-card/95 p-1 shadow-soft backdrop-blur">
                  {(Object.keys(styles) as Array<keyof typeof styles>).map((style) => (
                    <button
                      key={style}
                      onClick={() => setMapStyle(style)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        mapStyle === style ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {style === "openstreetmap3d" ? "3D" : style === "openstreetmap" ? "OSM" : "Default"}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* PRIORITY FEED */}
            <section className="rounded-md border border-border bg-card p-3.5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Priority Feed</h2>
                <AlertCircle className="size-4 text-destructive" />
              </div>
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {needs.map((need) => (
                  <article
                    key={need.id}
                    className={`rounded-md border p-2.5 transition cursor-pointer ${
                      selectedNeed.id === need.id
                        ? "border-destructive/40 bg-destructive/5 shadow-[0_0_18px_hsl(var(--destructive)/0.18)]"
                        : "border-border bg-background hover:border-destructive/30"
                    }`}
                    onClick={() => setSelectedNeed(need)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">Needs Detail & Match</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                          #{need.id} · {need.zone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-destructive">URGENCY</p>
                        <p className="text-base font-bold leading-none text-destructive">{need.score}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-[11px] text-muted-foreground">{need.impacted}+ impacted</p>
                      <Button variant="command" size="sm" className="h-7 rounded-md px-3 text-xs">
                        Assign
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
          </section>
          </div>

          {/* SMART MATCH — AI volunteer suggestions (full width, horizontal cards) */}
          <section className="mt-5 rounded-md border border-border bg-card p-3.5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                <span className="grid size-5 place-items-center rounded-md bg-primary/10 text-primary">
                  <Sparkles className="size-3" />
                </span>
                Smart Match
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                AI Optimized
              </span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {volunteers.map((v) => (
                <article
                  key={v.name}
                  className="rounded-md border border-border bg-background p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative shrink-0">
                      <img
                        src={v.image}
                        alt={v.name}
                        loading="lazy"
                        className="size-10 rounded-full object-cover"
                      />
                      <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-2.5" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{v.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{v.occupation}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                      {v.match}%
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {v.distance}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                      {v.experience}
                    </span>
                  </div>
                  <Button variant="command" size="sm" className="mt-2 h-7 w-full rounded-md text-xs">
                    Assign
                  </Button>
                </article>
              ))}
            </div>
          </section>

          {/* BOTTOM — Live Field Reports Feed */}
          <section className="mt-5 rounded-md border border-border bg-card p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
                  <Rss className="size-3.5" />
                </span>
                Live Field Reports Feed
              </h2>
              <div className="flex gap-1 rounded-md border border-border bg-background p-0.5 text-xs">
                <button className="rounded-sm px-2.5 py-1 font-medium text-muted-foreground hover:bg-secondary">All Sources</button>
                <button className="rounded-sm bg-card px-2.5 py-1 font-semibold shadow-soft">SMS Only</button>
              </div>
            </div>
            <div className="space-y-2">
              {fieldReports.map((r) => (
                <article
                  key={r.id}
                  className="grid grid-cols-[auto_minmax(0,180px)_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 transition hover:border-primary/30"
                >
                  <span
                    className="grid size-9 place-items-center rounded-md"
                    style={{ background: `hsl(var(--${r.tone}) / 0.12)`, color: `hsl(var(--${r.tone}))` }}
                  >
                    <r.icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Source</p>
                    <p className="truncate text-sm font-semibold">{r.source}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Problem Statement</p>
                    <p className="truncate text-sm">{r.statement}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                      style={{ background: `hsl(var(--${r.tone}))` }}
                    >
                      {r.severity}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{r.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <footer className="mt-5 flex items-center justify-between">
            <Button variant="quiet" className="rounded-md">
              <Settings className="size-4" />
              Settings
            </Button>
            <Button variant="command" className="rounded-md">
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </footer>

          <Testimonials />
        </section>
      </div>
    </main>
  );
};

export default Index;
