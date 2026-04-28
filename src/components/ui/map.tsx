import "maplibre-gl/dist/maplibre-gl.css";

import * as React from "react";
import MapGL, { type MapRef, type MapProps } from "react-map-gl/maplibre";

import { cn } from "@/lib/utils";

const DEFAULT_STYLE = "https://tiles.openfreemap.org/styles/bright";

type AppMapProps = MapProps & { className?: string };

const Map = React.forwardRef<MapRef, AppMapProps>(({ className, mapStyle, ...props }, ref) => {
  return (
    <div className={cn("h-full w-full", className)}>
      <MapGL ref={ref} mapStyle={mapStyle ?? DEFAULT_STYLE} attributionControl={false} {...props} />
    </div>
  );
});

Map.displayName = "Map";

export { Map, type MapRef };