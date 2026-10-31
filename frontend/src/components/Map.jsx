import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet default marker icons in Vite
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

// Bangalore (Bengaluru) coordinates
export const BANGALORE_CENTER = [12.9716, 77.5946];

// Bounding box restricting view strictly to Greater Bangalore (BBMP) area
export const BANGALORE_BOUNDS = [
  [12.7200, 77.3600], // Southwest coordinate
  [13.2000, 77.8200]  // Northeast coordinate
];

function MapController({ selectedWard }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(BANGALORE_BOUNDS);
    map.setMinZoom(10);
  }, [map]);

  useEffect(() => {
    if (selectedWard?.lat && selectedWard?.lng) {
      map.flyTo([selectedWard.lat, selectedWard.lng], 13, { duration: 1 });
    }
  }, [selectedWard, map]);

  return null;
}

export default function Map({ wards = [], selectedWard, onSelectWard }) {
  return (
    <div className="w-full h-full min-h-[560px] relative rounded-xl overflow-hidden border border-gray-200">
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
          const isHighDemand = (ward.predictedDemand || 0) > 200;

          return (
            <React.Fragment key={ward.id}>
              {/* Radius overlay */}
              <Circle
                center={[ward.lat, ward.lng]}
                radius={(ward.predictedDemand || 50) * 6}
                pathOptions={{
                  color: isHighDemand ? '#ef4444' : '#f59e0b',
                  fillColor: isHighDemand ? '#ef4444' : '#f59e0b',
                  fillOpacity: isSelected ? 0.45 : 0.22,
                  weight: isSelected ? 3 : 1.5,
                }}
              />

              {/* Pin Marker */}
              <Marker
                position={[ward.lat, ward.lng]}
                eventHandlers={{
                  click: () => onSelectWard && onSelectWard(ward),
                }}
              >
                <Tooltip direction="top" offset={[0, -32]} opacity={0.95}>
                  <div className="text-xs font-semibold text-gray-900">
                    <div>{ward.name}</div>
                    <div className="text-orange-600 font-bold">Demand: {ward.predictedDemand}</div>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-1 min-w-[180px] font-sans">
                    <div className="font-bold text-sm text-gray-900 border-b pb-1 mb-2">
                      {ward.name}
                    </div>
                    <div className="text-xs space-y-1 text-gray-600">
                      <div>Zone: <span className="font-semibold text-gray-800">{ward.zone}</span></div>
                      <div>Estimated Demand: <span className="font-bold text-orange-600">{ward.predictedDemand}</span></div>
                      <div>Confidence: <span className="font-semibold text-emerald-600">{ward.confidence || '90%'}</span></div>
                      <div>History: <span className="font-medium text-gray-700">{ward.history}</span></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Bangalore Lock Badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
        📍 <span className="font-semibold text-gray-900">Bengaluru Area Only</span>
      </div>
    </div>
  );
}
