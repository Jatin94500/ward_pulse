import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';

// Bangalore (Bengaluru) coordinates
const BANGALORE_CENTER = [12.9888, 77.6221];

// Bounding box restricting view strictly to Greater Bangalore (BBMP) area
const BANGALORE_BOUNDS = [
  [12.7500, 77.4000], // Southwest coordinate
  [13.2200, 77.8500]  // Northeast coordinate
];

function MapController({ geojsonData, selectedWard }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(BANGALORE_BOUNDS);
    map.setMinZoom(10);
  }, [map]);

  return null;
}

export default function Map({ selectedWard, onSelectWard }) {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch wards.geojson from the public directory
    fetch('/wards.geojson')
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

  // Styling for ward polygons: light elegant color, thin borders
  const wardStyle = (feature) => {
    const isSelected = selectedWard?.ward_id === feature.properties.ward_id;
    return {
      fillColor: isSelected ? '#f97316' : '#38bdf8', // Soft sky blue or orange when selected
      fillOpacity: isSelected ? 0.45 : 0.16,         // Light transparent color to highlight area
      color: isSelected ? '#ea580c' : '#0284c7',       // Thin border
      weight: isSelected ? 2.5 : 1,
      dashArray: isSelected ? '' : '1',
    };
  };

  // Interactions per ward polygon (tooltip & click)
  const onEachWard = (feature, layer) => {
    const wardId = feature.properties.ward_id;
    
    layer.bindTooltip(
      `<div><span class="font-bold text-gray-900">BBMP Ward #${wardId}</span></div>`,
      {
        sticky: true,
        direction: 'top',
        className: 'bg-white px-2 py-1 rounded shadow-md border border-gray-200 text-xs font-sans',
      }
    );

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.4,
          weight: 2,
          color: '#0284c7',
        });
      },
      mouseout: (e) => {
        const l = e.target;
        const isSelected = selectedWard?.ward_id === wardId;
        l.setStyle({
          fillColor: isSelected ? '#f97316' : '#38bdf8',
          fillOpacity: isSelected ? 0.45 : 0.16,
          color: isSelected ? '#ea580c' : '#0284c7',
          weight: isSelected ? 2.5 : 1,
        });
      },
      click: () => {
        if (onSelectWard) {
          onSelectWard({ ward_id: wardId, name: `BBMP Ward #${wardId}` });
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
        <MapController geojsonData={geoData} selectedWard={selectedWard} />

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

      {/* Floating Bangalore Lock Badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
        <span>Bangalore BBMP: <strong>198 Wards Polygons</strong></span>
      </div>
    </div>
  );
}
