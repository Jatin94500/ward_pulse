import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';

// Bangalore (Bengaluru) coordinates
const BANGALORE_CENTER = [12.9888, 77.6221];

// Bounding box restricting view strictly to Greater Bangalore (BBMP) area
const BANGALORE_BOUNDS = [
  [12.7500, 77.4000], // Southwest coordinate
  [13.2200, 77.8500]  // Northeast coordinate
];

function MapController({ selectedWard, geoData }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(BANGALORE_BOUNDS);
    map.setMinZoom(10);
  }, [map]);

  // When a ward is selected, if its bounds or feature exists, fly smoothly to it
  useEffect(() => {
    if (!selectedWard || !geoData) return;
    const targetFeature = geoData.features?.find(
      (f) => f.properties?.ward_id === selectedWard.ward_id
    );
    if (targetFeature && window.L) {
      try {
        const layer = window.L.geoJSON(targetFeature);
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { maxZoom: 14, duration: 0.8 });
        }
      } catch (e) {
        // Fallback silently if bounds calculation fails
      }
    }
  }, [selectedWard, geoData, map]);

  return null;
}

export default function WardMap({ wards = [], selectedWard, onSelectWard }) {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Map of ward_id -> ward object for instant lookup using global window.Map
  const wardMap = React.useMemo(() => {
    const lookup = typeof window !== 'undefined' && window.Map ? new window.Map() : new globalThis.Map();
    if (Array.isArray(wards)) {
      wards.forEach((w) => {
        if (w && w.ward_id) {
          lookup.set(w.ward_id, w);
        }
      });
    }
    return lookup;
  }, [wards]);

  useEffect(() => {
    // Fetch wards.geojson
    fetch('/wards.geojson?v=' + Date.now(), { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load wards.geojson');
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading GeoJSON:', err);
        setLoading(false);
      });
  }, []);

  // Styling for ward polygons
  const wardStyle = (feature) => {
    const wardId = feature.properties.ward_id;
    const isSelected = selectedWard?.ward_id === wardId;
    const wardInfo = wardMap.get(wardId);
    const isZeroHistory = wardInfo ? !wardInfo.has_history : false;

    // Distinct styling for zero-history target wards vs historical wards
    let fillColor = '#38bdf8'; // Soft sky blue default
    let borderColor = '#0284c7';

    if (isZeroHistory) {
      fillColor = '#fbbf24'; // Warm amber for zero-history wards
      borderColor = '#d97706';
    }

    if (isSelected) {
      fillColor = '#f97316'; // Bright orange for selected ward
      borderColor = '#c2410c';
    }

    return {
      fillColor,
      fillOpacity: isSelected ? 0.55 : (isZeroHistory ? 0.28 : 0.16),
      color: borderColor,
      weight: isSelected ? 2.5 : 1,
      dashArray: isSelected ? '' : (isZeroHistory ? '3 3' : '1'),
    };
  };

  // Interactions per ward polygon (tooltip & click)
  const onEachWard = (feature, layer) => {
    const wardId = feature.properties.ward_id;
    const wardInfo = wardMap.get(wardId) || {
      name: `Ward ${wardId}`,
      zone: 'BBMP',
      predictedDemand: 0,
      has_history: true
    };
    
    layer.bindTooltip(
      `
      <div style="font-family: inherit; font-size: 11px;">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">
          #${wardId} ${wardInfo.name}
        </div>
        <div style="color: #64748b; font-size: 10px;">
          ${wardInfo.zone} Zone · <span style="font-weight: 600; color: ${wardInfo.has_history ? '#16a34a' : '#d97706'}">
            ${wardInfo.has_history ? 'Historical' : 'Zero History'}
          </span>
        </div>
        <div style="margin-top: 3px; font-weight: 700; color: #ea580c;">
          Est. Demand: ${wardInfo.predictedDemand || Math.round(wardInfo.totalDemand || 0)} req
        </div>
      </div>
      `,
      {
        sticky: true,
        direction: 'top',
        className: 'bg-white px-2.5 py-1.5 rounded-lg shadow-lg border border-gray-200 text-xs font-sans',
      }
    );

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.5,
          weight: 2,
        });
      },
      mouseout: (e) => {
        const l = e.target;
        const isSelected = selectedWard?.ward_id === wardId;
        const wardInfo = wardMap.get(wardId);
        const isZeroHistory = wardInfo ? !wardInfo.has_history : false;

        let fillColor = '#38bdf8';
        let borderColor = '#0284c7';
        if (isZeroHistory) {
          fillColor = '#fbbf24';
          borderColor = '#d97706';
        }
        if (isSelected) {
          fillColor = '#f97316';
          borderColor = '#c2410c';
        }

        l.setStyle({
          fillColor,
          fillOpacity: isSelected ? 0.55 : (isZeroHistory ? 0.28 : 0.16),
          color: borderColor,
          weight: isSelected ? 2.5 : 1,
        });
      },
      click: () => {
        if (onSelectWard) {
          onSelectWard(wardInfo);
        }
      },
    });
  };

  return (
    <div className="w-full h-full min-h-[560px] relative rounded-xl overflow-hidden border border-gray-200 bg-slate-50">
      {loading && (
        <div className="absolute inset-0 z-[500] bg-white/80 backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping"></span>
            Loading Bangalore 198 BBMP Wards GeoJSON...
          </div>
        </div>
      )}

      <MapContainer
        center={BANGALORE_CENTER}
        zoom={11}
        minZoom={10}
        maxZoom={17}
        maxBounds={BANGALORE_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController geoData={geoData} selectedWard={selectedWard} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          bounds={BANGALORE_BOUNDS}
        />

        {geoData && (
          <GeoJSON
            key={selectedWard?.ward_id ? `ward-${selectedWard.ward_id}` : 'wards-all'}
            data={geoData}
            style={wardStyle}
            onEachFeature={onEachWard}
          />
        )}
      </MapContainer>

      {/* Floating Bangalore Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-200 text-[11px] font-medium text-gray-700 shadow-sm space-y-1">
        <div className="font-semibold text-gray-900 border-b border-gray-100 pb-1 text-[10px] uppercase tracking-wider">
          BBMP 198 Wards
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-400 border border-amber-500 inline-block"></span>
          <span>Zero-History Wards (40 Target Wards)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-sky-400 border border-sky-500 inline-block"></span>
          <span>Historical Complaint Wards (156)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-orange-500 border border-orange-600 inline-block"></span>
          <span>Selected Active Ward</span>
        </div>
      </div>
    </div>
  );
}
