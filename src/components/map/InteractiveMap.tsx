"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "@/stores/mapStore";
import { MapPin, Plus, Minus, Compass, Maximize2 } from "lucide-react";

interface InteractiveMapProps {
  onPinHover?: (pinId: string | null) => void;
  onPinClick?: (pinId: string) => void;
}

export function InteractiveMap({ onPinHover, onPinClick }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { pins, viewport, hoveredPin, setViewport } = useMapStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const apiKey = process.env.NEXT_PUBLIC_MAPLIBRE_API_KEY;
    
    // Use MapTiler style if API key available, otherwise use OSM
    const style = apiKey
      ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`
      : {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: style as any,
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    map.current.on("move", () => {
      if (!map.current) return;
      const { lng, lat } = map.current.getCenter();
      setViewport({
        latitude: lat,
        longitude: lng,
        zoom: map.current.getZoom(),
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add markers when pins change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    const markers = document.querySelectorAll(".maplibregl-marker");
    markers.forEach((marker) => marker.remove());

    // Add new markers
    pins.forEach((pin) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "48px";
      el.style.height = "48px";
      el.style.cursor = "pointer";
      el.innerHTML = `
        <div style="
          width: 48px;
          height: 48px;
          background: ${pin.featured ? "linear-gradient(135deg, #DC2626, #B91C1C)" : "#DC2626"};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
          transition: all 0.2s;
          position: relative;
        " class="pin-body">
          ${pin.featured ? `<div style="position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; background: #D97706; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); border: 2px solid white;">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="3">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>` : ""}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" style="transform: rotate(45deg)">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;

      el.addEventListener("mouseenter", () => {
        onPinHover?.(pin.id);
        const pinBody = el.querySelector(".pin-body") as HTMLElement;
        if (pinBody) {
          pinBody.style.transform = "rotate(-45deg) scale(1.15)";
          pinBody.style.boxShadow = "0 8px 20px rgba(220, 38, 38, 0.5)";
        }
      });

      el.addEventListener("mouseleave", () => {
        onPinHover?.(null);
        const pinBody = el.querySelector(".pin-body") as HTMLElement;
        if (pinBody) {
          pinBody.style.transform = "rotate(-45deg) scale(1)";
          pinBody.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.4)";
        }
      });

      el.addEventListener("click", () => {
        onPinClick?.(pin.id);
      });

      new maplibregl.Marker({ element: el })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map.current!);
    });
  }, [pins, mapLoaded, onPinHover, onPinClick]);

  // Map controls
  const zoomIn = () => {
    map.current?.zoomIn();
  };

  const zoomOut = () => {
    map.current?.zoomOut();
  };

  const resetView = () => {
    map.current?.flyTo({
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
    });
  };

  const fullscreen = () => {
    if (!mapContainer.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      mapContainer.current.requestFullscreen();
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Map Controls */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.375rem",
          zIndex: 10,
        }}
      >
        {[
          { icon: Plus, onClick: zoomIn, label: "Zoom in" },
          { icon: Minus, onClick: zoomOut, label: "Zoom out" },
          { icon: Compass, onClick: resetView, label: "Reset view" },
          { icon: Maximize2, onClick: fullscreen, label: "Fullscreen" },
        ].map((control, idx) => (
          <button
            key={idx}
            onClick={control.onClick}
            title={control.label}
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid #E5E0D8",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#D97706";
              const svg = e.currentTarget.querySelector("svg");
              if (svg) svg.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.95)";
              const svg = e.currentTarget.querySelector("svg");
              if (svg) svg.style.color = "#5C574E";
            }}
          >
            <control.icon size={16} color="#5C574E" strokeWidth={2} />
          </button>
        ))}
      </div>

      {/* Attribution */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          padding: "0.5rem 0.75rem",
          borderRadius: "8px",
          fontSize: "0.6875rem",
          color: "#8A8680",
          fontWeight: "600",
          border: "1px solid #E5E0D8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
        }}
      >
        <Compass size={12} color="#D97706" />
        <span>{process.env.NEXT_PUBLIC_MAPLIBRE_API_KEY ? "MapTiler" : "OpenStreetMap"}</span>
      </div>
    </div>
  );
}
