import React, { useState, useEffect } from 'react';
import { MOCK_RESOURCES, MOCK_HELPERS, MOCK_EMERGENCY_ALERTS, TN_EMERGENCY_NUMBERS } from '../../services/mockData';
import { ResourceItem } from '../../types/resource';
import { HelperProfile } from '../../types/helper';
import { EmergencyAlert } from '../../types/emergency';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import {
  MapPin,
  Navigation,
  Crosshair,
  Phone,
  AlertTriangle,
  LifeBuoy,
  HeartHandshake,
  CheckCircle2,
  Compass,
  LocateFixed
} from 'lucide-react';

interface EmergencyMapProps {
  initialCenter?: { lat: number; lng: number };
  highlightRequestId?: string;
  onSelectResource?: (resource: ResourceItem) => void;
  onSelectHelper?: (helper: HelperProfile) => void;
  heightClass?: string;
}

type MapFilter = 'ALL' | 'EMERGENCIES' | 'AMBULANCE' | 'HOSPITAL' | 'SHELTER' | 'RESCUE' | 'HELPERS';

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  highlightRequestId,
  onSelectResource,
  onSelectHelper,
  heightClass = 'h-[440px]'
}) => {
  const [filter, setFilter] = useState<MapFilter>('ALL');
  const [selectedPin, setSelectedPin] = useState<{
    type: 'alert' | 'resource' | 'helper' | 'citizen';
    data: any;
  } | null>(null);

  const [userLocation, setUserLocation] = useState({
    lat: 13.0827,
    lng: 80.2707,
    title: 'Your Location (Tamil Nadu Emergency Grid)',
    address: 'Velachery / Chennai Central, Tamil Nadu',
    isLiveGPS: false
  });

  const [gpsStatus, setGpsStatus] = useState<string>('Default (Chennai Center)');
  const [isLocating, setIsLocating] = useState(false);

  // Request actual live device GPS location
  const handleEnableLiveLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({
            lat,
            lng,
            title: 'Your Live GPS Coordinates',
            address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Accuracy ±${Math.round(position.coords.accuracy)}m)`,
            isLiveGPS: true
          });
          setGpsStatus(`🟢 Live GPS Active (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
          setIsLocating(false);
          setSelectedPin({
            type: 'citizen',
            data: {
              address: `Live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Accuracy: ±${Math.round(position.coords.accuracy)}m)`,
              lat,
              lng
            }
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setUserLocation(prev => ({ ...prev, isLiveGPS: true }));
          setGpsStatus('📍 Tamil Nadu State Grid (Chennai 13.0827, 80.2707)');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const alerts = MOCK_EMERGENCY_ALERTS.filter(a => a.isActive);
  const resources = MOCK_RESOURCES;
  const helpers = MOCK_HELPERS;

  const filteredResources = resources.filter(r => {
    if (filter === 'ALL') return true;
    if (filter === 'AMBULANCE' && r.category === 'Ambulance') return true;
    if (filter === 'HOSPITAL' && r.category === 'Hospital') return true;
    if (filter === 'SHELTER' && r.category === 'Shelter') return true;
    if (filter === 'RESCUE' && (r.category === 'Rescue Team' || r.category === 'Fire & Rescue')) return true;
    return false;
  });

  const showEmergencies = filter === 'ALL' || filter === 'EMERGENCIES';
  const showHelpers = filter === 'ALL' || filter === 'HELPERS';

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl flex flex-col">
      {/* Top GPS Enable & Filter Controls Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Units
          </button>

          <button
            onClick={() => setFilter('EMERGENCIES')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filter === 'EMERGENCIES'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Hazard ({alerts.length})</span>
          </button>

          <button
            onClick={() => setFilter('AMBULANCE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filter === 'AMBULANCE'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🚑 108 EMS
          </button>

          <button
            onClick={() => setFilter('RESCUE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filter === 'RESCUE'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🛟 Rescue
          </button>

          <button
            onClick={() => setFilter('SHELTER')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filter === 'SHELTER'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🏠 Shelters
          </button>
        </div>

        {/* Live GPS Enable Button */}
        <button
          onClick={handleEnableLiveLocation}
          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/30 shrink-0 transition-all active:scale-95"
          title="Enable Live GPS"
        >
          <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Enable GPS'}</span>
        </button>
      </div>

      {/* GPS Status Info Bar */}
      <div className="bg-slate-950 px-3 py-1 text-[10px] text-emerald-400 border-b border-slate-800/80 flex items-center justify-between font-mono">
        <span>{gpsStatus}</span>
        <span className="text-slate-400">Tamil Nadu Zone</span>
      </div>

      {/* Interactive Map Viewport with OpenStreetMap live tiles */}
      <div className={`relative w-full ${heightClass} bg-slate-950 overflow-hidden select-none`}>
        {/* OpenStreetMap Tile Layer Iframe / Live Visualizer */}
        <iframe
          title="Tamil Nadu Emergency Map"
          className="absolute inset-0 w-full h-full border-0 pointer-events-auto opacity-75"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.08}%2C${userLocation.lat - 0.06}%2C${userLocation.lng + 0.08}%2C${userLocation.lat + 0.06}&layer=mapnik&marker=${userLocation.lat}%2C${userLocation.lng}`}
        />

        {/* Overlay Interactive Unit Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* User Location Pin */}
          <div
            onClick={() => setSelectedPin({ type: 'citizen', data: userLocation })}
            className="absolute cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 z-20 group"
            style={{ top: '50%', left: '50%' }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-12 h-12 rounded-full bg-rose-500/40 animate-ping" />
              <div className="w-9 h-9 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black group-hover:scale-110 transition-transform">
                📍
              </div>
            </div>
            <span className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 shadow-md">
              You (Live)
            </span>
          </div>

          {/* Hazard Alert Pin */}
          {showEmergencies && alerts.length > 0 && (
            <div
              onClick={() => setSelectedPin({ type: 'alert', data: alerts[0] })}
              className="absolute cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 z-20 group"
              style={{ top: '35%', left: '42%' }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-14 h-14 rounded-full bg-red-600/40 animate-pulse" />
                <div className="w-9 h-9 rounded-2xl bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5 text-white animate-bounce-subtle" />
                </div>
              </div>
              <span className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-950/90 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-700 shadow-md">
                🚨 Cyclone Hazard
              </span>
            </div>
          )}

          {/* Resources Pins */}
          {filteredResources.map((res, idx) => {
            const topPos = idx === 0 ? '60%' : idx === 1 ? '38%' : idx === 2 ? '68%' : '42%';
            const leftPos = idx === 0 ? '62%' : idx === 1 ? '70%' : idx === 2 ? '32%' : '26%';
            const icon =
              res.category === 'Ambulance'
                ? '🚑'
                : res.category === 'Hospital'
                ? '🏥'
                : res.category === 'Rescue Team'
                ? '🛟'
                : res.category === 'Shelter'
                ? '🏠'
                : '🚒';

            return (
              <div
                key={res.id}
                onClick={() => setSelectedPin({ type: 'resource', data: res })}
                className="absolute cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 z-15 group"
                style={{ top: topPos, left: leftPos }}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 border-2 border-blue-400 shadow-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  {icon}
                </div>
              </div>
            );
          })}

          {/* Helper Pin */}
          {showHelpers && helpers.length > 0 && (
            <div
              onClick={() => setSelectedPin({ type: 'helper', data: helpers[0] })}
              className="absolute cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 z-15 group"
              style={{ top: '56%', left: '68%' }}
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 z-10 border border-slate-900" />
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
                  <img src={helpers[0].avatar} alt={helpers[0].name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Pin Bottom Sheet */}
      {selectedPin && (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0 animate-fadeIn">
          {selectedPin.type === 'citizen' && (
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Your Active GPS Location
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedPin.data.address}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setSelectedPin(null)}>
                Dismiss
              </Button>
            </div>
          )}

          {selectedPin.type === 'alert' && (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <StatusBadge status={selectedPin.data.severity} variant="severity" size="sm" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {selectedPin.data.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedPin.data.headline}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {selectedPin.type === 'resource' && (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {selectedPin.data.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedPin.data.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedPin.data.location.address}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${selectedPin.data.contactPhone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedPin.data.contactPhone}</span>
                </a>
              </div>
            </div>
          )}

          {selectedPin.type === 'helper' && (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedPin.data.avatar}
                    alt={selectedPin.data.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {selectedPin.data.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedPin.data.verificationBadge}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${selectedPin.data.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Volunteer ({selectedPin.data.phone})</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
