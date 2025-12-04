import { create } from "zustand";

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  name: string;
  price: string;
  bedrooms: number;
  type: string;
  featured?: boolean;
}

interface MapState {
  pins: MapPin[];
  hoveredPin: string | null;
  selectedPin: string | null;
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setPins: (pins: MapPin[]) => void;
  setHoveredPin: (id: string | null) => void;
  setSelectedPin: (id: string | null) => void;
  setViewport: (viewport: Partial<MapState["viewport"]>) => void;
  reset: () => void;
}

const initialViewport = {
  latitude: 30.0444,
  longitude: 31.2357,
  zoom: 10,
};

export const useMapStore = create<MapState>((set) => ({
  pins: [],
  hoveredPin: null,
  selectedPin: null,
  viewport: initialViewport,
  setPins: (pins) => set({ pins }),
  setHoveredPin: (id) => set({ hoveredPin: id }),
  setSelectedPin: (id) => set({ selectedPin: id }),
  setViewport: (viewport) =>
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    })),
  reset: () =>
    set({
      pins: [],
      hoveredPin: null,
      selectedPin: null,
      viewport: initialViewport,
    }),
}));
