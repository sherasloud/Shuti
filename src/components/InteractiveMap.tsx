import React, { useState, useEffect, useRef } from 'react';
import { LocationPoint, Language, VehicleType, RideStatus } from '../types';
import { 
  Navigation, 
  MapPin, 
  Layers, 
  Crosshair, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface InteractiveMapProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  onSelectMapLocation: (location: LocationPoint) => void;
  language: Language;
  rideStatus: RideStatus;
  driverLat?: number;
  driverLng?: number;
  vehicleType?: VehicleType;
  selectedCity: 'Dhaka' | 'Chittagong' | 'CoxsBazar' | 'Sylhet';
  onCityChange: (city: 'Dhaka' | 'Chittagong' | 'CoxsBazar' | 'Sylhet') => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickup,
  dropoff,
  onSelectMapLocation,
  language,
  rideStatus,
  driverLat,
  driverLng,
  vehicleType = 'cng',
  selectedCity,
  onCityChange
}) => {
  const [showTrafficHeatmap, setShowTrafficHeatmap] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState<'standard' | 'night' | 'satellite'>('standard');
  const [clickMode, setClickMode] = useState<'pickup' | 'dropoff'>('dropoff');

  // Animated background vehicles
  const [trafficVehicles, setTrafficVehicles] = useState<Array<{ id: number; x: number; y: number; dx: number; dy: number; type: string }>>([]);

  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize random background traffic for city atmosphere
  useEffect(() => {
    const initialVehicles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      type: ['🛺', '🏍️', '🚗', '🚲'][Math.floor(Math.random() * 4)]
    }));
    setTrafficVehicles(initialVehicles);

    const interval = setInterval(() => {
      setTrafficVehicles((prev) =>
        prev.map((v) => {
          let nextX = v.x + v.dx;
          let nextY = v.y + v.dy;
          if (nextX < 5 || nextX > 95) v.dx = -v.dx;
          if (nextY < 5 || nextY > 95) v.dy = -v.dy;
          return { ...v, x: nextX, y: nextY };
        })
      );
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Handle map click to place custom pickup or dropoff point
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Approximate BDT lat/lng based on city
    const cityBaseLat = selectedCity === 'Dhaka' ? 23.78 : selectedCity === 'Chittagong' ? 22.35 : selectedCity === 'CoxsBazar' ? 21.43 : 24.89;
    const cityBaseLng = selectedCity === 'Dhaka' ? 90.40 : selectedCity === 'Chittagong' ? 91.82 : selectedCity === 'CoxsBazar' ? 91.98 : 91.86;

    const clickedLat = cityBaseLat + (0.5 - yRatio) * 0.1;
    const clickedLng = cityBaseLng + (xRatio - 0.5) * 0.1;

    const customPoint: LocationPoint = {
      id: `custom-${Date.now()}`,
      name: `${clickMode === 'pickup' ? 'Selected Pickup' : 'Selected Dropoff'} (${(xRatio * 100).toFixed(0)}%, ${(yRatio * 100).toFixed(0)}%)`,
      nameBn: `${clickMode === 'pickup' ? 'পিকআপ স্থান' : 'গন্তব্য স্থান'}`,
      address: `Road ${Math.floor(xRatio * 30)}, Block ${String.fromCharCode(65 + Math.floor(yRatio * 8))}, ${selectedCity}`,
      addressBn: `রোড ${Math.floor(xRatio * 30)}, ব্লগ ${String.fromCharCode(65 + Math.floor(yRatio * 8))}, ${selectedCity}`,
      city: selectedCity,
      lat: clickedLat,
      lng: clickedLng
    };

    onSelectMapLocation(customPoint);
  };

  // Convert lat/lng to percentage coordinates on the map view
  const getCoordinates = (loc: LocationPoint | null) => {
    if (!loc) return { x: 50, y: 50 };
    // Map scaling relative to city base
    const cityBaseLat = selectedCity === 'Dhaka' ? 23.78 : selectedCity === 'Chittagong' ? 22.35 : selectedCity === 'CoxsBazar' ? 21.43 : 24.89;
    const cityBaseLng = selectedCity === 'Dhaka' ? 90.40 : selectedCity === 'Chittagong' ? 91.82 : selectedCity === 'CoxsBazar' ? 91.98 : 91.86;

    const x = 50 + (loc.lng - cityBaseLng) * 800;
    const y = 50 - (loc.lat - cityBaseLat) * 800;

    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y))
    };
  };

  const pPos = getCoordinates(pickup);
  const dPos = getCoordinates(dropoff);

  // Driver animated position calculation during trip
  const getDriverPos = () => {
    if (driverLat && driverLng) {
      const cityBaseLat = selectedCity === 'Dhaka' ? 23.78 : selectedCity === 'Chittagong' ? 22.35 : selectedCity === 'CoxsBazar' ? 21.43 : 24.89;
      const cityBaseLng = selectedCity === 'Dhaka' ? 90.40 : selectedCity === 'Chittagong' ? 91.82 : selectedCity === 'CoxsBazar' ? 91.98 : 91.86;
      const x = 50 + (driverLng - cityBaseLng) * 800;
      const y = 50 - (driverLat - cityBaseLat) * 800;
      return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
    }
    // Default interpolate halfway if ride active
    if (rideStatus === 'in_transit') {
      return { x: (pPos.x + dPos.x) / 2, y: (pPos.y + dPos.y) / 2 };
    }
    return { x: pPos.x - 5, y: pPos.y - 5 };
  };

  const driverPos = getDriverPos();

  const vehicleIconMap: Record<VehicleType, string> = {
    cng: '🛺',
    bike: '🏍️',
    car: '🚗',
    rickshaw: '🚲',
    microbus: '🚐'
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50 select-none">
      
      {/* City Switcher & Mode Header */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg">
          {(['Dhaka', 'Chittagong', 'CoxsBazar', 'Sylhet'] as const).map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedCity === city
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {city === 'Dhaka' ? (language === 'bn' ? 'ঢাকা' : 'Dhaka') :
               city === 'Chittagong' ? (language === 'bn' ? 'চট্টগ্রাম' : 'Chittagong') :
               city === 'CoxsBazar' ? (language === 'bn' ? 'কক্সবাজার' : 'Cox’s Bazar') :
               (language === 'bn' ? 'সিলেট' : 'Sylhet')}
            </button>
          ))}
        </div>

        {/* Map Click Mode Toggle (Pickup vs Dropoff) */}
        <div className="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-semibold">
          <span className="text-[11px] text-slate-500 px-1">
            {language === 'bn' ? 'ম্যাপ ট্যাপ:' : 'Tap map for:'}
          </span>
          <button
            onClick={() => setClickMode('pickup')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              clickMode === 'pickup'
                ? 'bg-emerald-500 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'পিকআপ' : 'Pickup'}
          </button>
          <button
            onClick={() => setClickMode('dropoff')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              clickMode === 'dropoff'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'গন্তব্য' : 'Dropoff'}
          </button>
        </div>
      </div>

      {/* Dynamic Map Canvas / SVG Layer */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        className="w-full h-full relative cursor-crosshair overflow-hidden transition-transform duration-300"
        style={{
          transform: `scale(${zoomLevel})`,
          backgroundColor: mapMode === 'night' ? '#0f172a' : mapMode === 'satellite' ? '#1e293b' : '#f8fafc'
        }}
      >
        {/* SVG Grid Roads & Rivers */}
        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="roadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapMode === 'standard' ? '#e2e8f0' : '#1e293b'} strokeWidth="1" />
            </pattern>
            {/* Pulsating Glow Effect for Route */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#roadGrid)" />

          {/* Rivers Representation (Buriganga / Karnaphuli / Surma) */}
          {selectedCity === 'Dhaka' && (
            <path
              d="M 0 320 Q 200 290 400 350 T 800 310"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="28"
              opacity="0.5"
            />
          )}
          {selectedCity === 'Chittagong' && (
            <path
              d="M 0 100 Q 300 250 800 400"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="35"
              opacity="0.5"
            />
          )}
          {selectedCity === 'CoxsBazar' && (
            <path
              d="M 0 0 Q 250 200 500 500"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="120"
              opacity="0.4"
            />
          )}

          {/* Main Highway Expressways (Dhaka Elevated, Hanif Flyover, etc.) */}
          <path d="M 100 0 L 100 500" stroke={mapMode === 'standard' ? '#cbd5e1' : '#334155'} strokeWidth="8" />
          <path d="M 0 200 L 800 200" stroke={mapMode === 'standard' ? '#cbd5e1' : '#334155'} strokeWidth="8" />
          <path d="M 0 100 L 800 400" stroke={mapMode === 'standard' ? '#cbd5e1' : '#475569'} strokeWidth="6" strokeDasharray="6,6" />
          <path d="M 300 0 L 300 500" stroke={mapMode === 'standard' ? '#cbd5e1' : '#334155'} strokeWidth="6" />

          {/* Flyover Yellow Express Corridor */}
          <path d="M 50 50 Q 250 150 450 300 T 750 400" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8,4" opacity="0.4" />

          {/* Traffic Heatmap Congestion Zones */}
          {showTrafficHeatmap && (
            <>
              <circle cx="40%" cy="30%" r="60" fill="#ef4444" opacity="0.15" />
              <circle cx="65%" cy="50%" r="75" fill="#f59e0b" opacity="0.15" />
              <circle cx="25%" cy="70%" r="50" fill="#ef4444" opacity="0.2" />
            </>
          )}

        {/* Active Trip Polyline Route */}
        {pickup && dropoff && (
          <g>
            {/* Outer Shadow Route */}
            <line
              x1={`${pPos.x}%`}
              y1={`${pPos.y}%`}
              x2={`${dPos.x}%`}
              y2={`${dPos.y}%`}
              stroke={mapMode === 'standard' ? '#cbd5e1' : '#0f172a'}
              strokeWidth="10"
              strokeLinecap="round"
            />
              {/* Gradient Animated Route Line */}
              <line
                x1={`${pPos.x}%`}
                y1={`${pPos.y}%`}
                x2={`${dPos.x}%`}
                y2={`${dPos.y}%`}
                stroke="url(#routeGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="10,6"
                className="animate-pulse"
              />
            </g>
          )}
        </svg>

        {/* Ambient Moving Traffic Vehicles */}
        {trafficVehicles.map((v) => (
          <div
            key={v.id}
            className="absolute text-sm pointer-events-none transition-all duration-300 opacity-60 hover:opacity-100"
            style={{ top: `${v.y}%`, left: `${v.x}%` }}
          >
            {v.type}
          </div>
        ))}

        {/* Pickup Pin Marker */}
        {pickup && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-none"
            style={{ top: `${pPos.y}%`, left: `${pPos.x}%` }}
          >
            <div className="relative flex flex-col items-center group">
              <div className="px-2 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg shadow-lg whitespace-nowrap mb-1 border border-emerald-400">
                📍 {pickup.nameBn || pickup.name}
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center animate-ping absolute" />
              <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
            </div>
          </div>
        )}

        {/* Dropoff Pin Marker */}
        {dropoff && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-none"
            style={{ top: `${dPos.y}%`, left: `${dPos.x}%` }}
          >
            <div className="relative flex flex-col items-center">
              <div className="px-2 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg shadow-lg whitespace-nowrap mb-1 border border-rose-400">
                🏁 {dropoff.nameBn || dropoff.name}
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-500/30 border-2 border-rose-400 flex items-center justify-center animate-pulse absolute" />
              <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
                <Navigation className="w-4 h-4 fill-white rotate-45" />
              </div>
            </div>
          </div>
        )}

        {/* Active Driver Icon Moving on Map */}
        {(rideStatus === 'driver_assigned' || rideStatus === 'driver_arriving' || rideStatus === 'in_transit') && (
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 pointer-events-none"
            style={{ top: `${driverPos.y}%`, left: `${driverPos.x}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full shadow-md whitespace-nowrap animate-bounce">
                {vehicleIconMap[vehicleType]} Shuti Driver
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center text-2xl shadow-2xl ring-4 ring-amber-500/40">
                {vehicleIconMap[vehicleType]}
              </div>
            </div>
          </div>
        )}

        {/* Map Watermark & Info */}
        <div className="absolute bottom-3 left-3 z-10 text-[10px] text-slate-500 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200">
          Shuti Live Vector Map • {selectedCity} Traffic Engine
        </div>
      </div>

      {/* Map Control Tools Sidebar */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => setShowTrafficHeatmap(!showTrafficHeatmap)}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-lg text-xs flex items-center gap-1.5 font-bold ${
            showTrafficHeatmap
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:text-slate-900'
          }`}
          title="Toggle Dhaka Traffic Congestion Heatmap"
        >
          <Zap className="w-4 h-4" />
          <span className="hidden sm:inline">
            {showTrafficHeatmap ? (language === 'bn' ? 'ট্রাফিক জ্যাম অন' : 'Traffic ON') : (language === 'bn' ? 'ট্রাফিক অফ' : 'Traffic OFF')}
          </span>
        </button>

        <button
          onClick={() => setMapMode(mapMode === 'standard' ? 'night' : mapMode === 'night' ? 'satellite' : 'standard')}
          className="p-2.5 rounded-xl bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 backdrop-blur-md transition-all shadow-lg text-xs flex items-center gap-1.5 font-bold"
          title="Switch Map Theme"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline capitalize">{mapMode}</span>
        </button>

        <div className="flex flex-col rounded-xl bg-white/90 border border-slate-200 overflow-hidden shadow-lg backdrop-blur-md">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b border-slate-200 text-sm font-bold"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-bold"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};
