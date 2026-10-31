import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Compass } from 'lucide-react';

// Fix leaflet default marker icons in Vite
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

// Bangalore (Bengaluru) Geographic Bounds
export const BANGALORE_CENTER = [12.9716, 77.5946];

// Bounding box restricting view strictly to Greater Bangalore (BBMP) area
export const BANGALORE_BOUNDS = [
  [12.7200, 77.3600], // Southwest coordinate (Electronic City / Bannerghatta / Kengeri boundary)
  [13.2000, 77.8200]  // Northeast coordinate (Yelahanka / Devanahalli / Whitefield boundary)
];

// Helper component to handle map animations and strict bounds enforcement
function MapController({ selectedWard }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(BANGALORE_BOUNDS);
    map.setMinZoom(10);
  }, [map]);

  useEffect(() => {
    if (selectedWard && selectedWard.lat && selectedWard.lng) {
      map.flyTo([selectedWard.lat, selectedWard.lng], 13, {
        duration: 1.2,
      });
    }
  }, [selectedWard, map]);

  return null;
}

export default function WardMap({ wards = [], selectedWard, onSelectWard }) {
  return (
    <div className="relative w-full h-[560px] rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
      <MapContainer
        center={BANGALORE_CENTER}
        zoom={11}
        minZoom={10}
        maxZoom={18}
        maxBounds={BANGALORE_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController selectedWard={selectedWard} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          bounds={BANGALORE_BOUNDS}
        />

        {wards.map((ward) => {
          const isSelected = selectedWard?.id === ward.id;
          const isHighDemand = ward.predictedDemand > 200;

          return (
            <React.Fragment key={ward.id}>
              {/* Demand Radius visualization */}
              <Circle
                center={[ward.lat, ward.lng]}
                radius={ward.predictedDemand * 6}
                pathOptions={{
                  color: isHighDemand ? '#ef4444' : '#f59e0b',
                  fillColor: isHighDemand ? '#ef4444' : '#f59e0b',
                  fillOpacity: isSelected ? 0.45 : 0.22,
                  weight: isSelected ? 3 : 1.5,
                }}
              />

              {/* Marker with Popup */}
              <Marker
                position={[ward.lat, ward.lng]}
                eventHandlers={{
                  click: () => onSelectWard && onSelectWard(ward),
                }}
              >
                <Tooltip direction="top" offset={[0, -32]} opacity={0.95}>
                  <div className="text-xs font-semibold">
                    <span className="text-slate-900 font-bold">{ward.name}</span>
                    <span className="text-slate-500 block text-[10px]">{ward.zone} Zone</span>
                    <span className="text-amber-600 font-bold">Est. Demand: {ward.predictedDemand}</span>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-1 min-w-[200px] text-slate-900 font-sans">
                    <div className="flex items-center justify-between border-b pb-1 mb-2">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{ward.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">BBMP Ward #{ward.wardNo} · {ward.zone}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        ward.history.includes('None') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ward.history}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Predicted Complaints:</span>
                        <span className="font-bold text-indigo-700">{ward.predictedDemand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Confidence:</span>
                        <span className="font-semibold text-emerald-600">{ward.confidence}</span>
                      </div>
                      <div className="pt-1.5 border-t text-[11px] text-slate-500 grid grid-cols-2 gap-1">
                        <span>Roads: {ward.roads}</span>
                        <span>Garbage: {ward.garbage}</span>
                        <span>Water: {ward.water}</span>
                        <span>Lights: {ward.streetlights}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Strict Bounds Notice Badge (Top Left) */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 shadow-md flex items-center gap-2 pointer-events-auto">
        <Compass className="h-3.5 w-3.5 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Restricted Area: <strong className="text-white">Bengaluru (BBMP)</strong> only</span>
      </div>

      {/* Floating Map Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs text-slate-200 shadow-lg space-y-1.5 pointer-events-auto">
        <div className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider mb-1">OSM Demand Layer</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span>High Demand (&gt;200 complaints)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span>Moderate Demand (100–200)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-700">
          <span>📍 BBMP Bangalore Limits Locked</span>
        </div>
      </div>
    </div>
  );
}
