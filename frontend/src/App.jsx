import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import Filter from './components/Filter';
import Charts from './components/Charts';
import { Layers, Sparkles } from 'lucide-react';

const BANGALORE_WARDS = [
  {
    id: 'BBMP-80',
    wardNo: 80,
    name: 'Indiranagar',
    zone: 'East',
    lat: 12.9784,
    lng: 77.6408,
    predictedDemand: 195,
    confidence: '92%',
    history: 'Active',
    roads: 65,
    garbage: 80,
    water: 32,
    streetlights: 18
  },
  {
    id: 'BBMP-151',
    wardNo: 151,
    name: 'Koramangala',
    zone: 'South',
    lat: 12.9352,
    lng: 77.6245,
    predictedDemand: 245,
    confidence: '95%',
    history: 'Active',
    roads: 92,
    garbage: 95,
    water: 38,
    streetlights: 20
  },
  {
    id: 'BBMP-84',
    wardNo: 84,
    name: 'Whitefield',
    zone: 'Mahadevapura',
    lat: 12.9698,
    lng: 77.7500,
    predictedDemand: 312,
    confidence: '89%',
    history: 'None (New Expansion)',
    roads: 125,
    garbage: 105,
    water: 54,
    streetlights: 28
  },
  {
    id: 'BBMP-150',
    wardNo: 150,
    name: 'Bellandur',
    zone: 'Mahadevapura',
    lat: 12.9260,
    lng: 77.6762,
    predictedDemand: 285,
    confidence: '88%',
    history: 'None (Unrecorded)',
    roads: 110,
    garbage: 98,
    water: 52,
    streetlights: 25
  },
  {
    id: 'BBMP-45',
    wardNo: 45,
    name: 'Malleshwaram',
    zone: 'West',
    lat: 13.0031,
    lng: 77.5643,
    predictedDemand: 160,
    confidence: '96%',
    history: 'Active',
    roads: 48,
    garbage: 62,
    water: 32,
    streetlights: 18
  },
  {
    id: 'BBMP-174',
    wardNo: 174,
    name: 'HSR Layout',
    zone: 'Bommanahalli',
    lat: 12.9121,
    lng: 77.6446,
    predictedDemand: 215,
    confidence: '93%',
    history: 'Active',
    roads: 78,
    garbage: 75,
    water: 40,
    streetlights: 22
  },
  {
    id: 'BBMP-153',
    wardNo: 153,
    name: 'Jayanagar',
    zone: 'South',
    lat: 12.9308,
    lng: 77.5838,
    predictedDemand: 170,
    confidence: '94%',
    history: 'Active',
    roads: 55,
    garbage: 68,
    water: 28,
    streetlights: 19
  },
  {
    id: 'BBMP-04',
    wardNo: 4,
    name: 'Yelahanka Satellite Town',
    zone: 'Yelahanka',
    lat: 13.1007,
    lng: 77.5963,
    predictedDemand: 220,
    confidence: '90%',
    history: 'None (New Expansion)',
    roads: 85,
    garbage: 72,
    water: 41,
    streetlights: 22
  },
  {
    id: 'BBMP-108',
    wardNo: 108,
    name: 'Rajajinagar',
    zone: 'West',
    lat: 12.9982,
    lng: 77.5530,
    predictedDemand: 175,
    confidence: '93%',
    history: 'Active',
    roads: 54,
    garbage: 70,
    water: 31,
    streetlights: 20
  },
  {
    id: 'BBMP-192',
    wardNo: 192,
    name: 'Electronic City Corridor',
    zone: 'South Outskirts',
    lat: 12.8399,
    lng: 77.6770,
    predictedDemand: 265,
    confidence: '87%',
    history: 'None (Unrecorded)',
    roads: 105,
    garbage: 85,
    water: 48,
    streetlights: 27
  },
];

const ALL_ZONES = ['East', 'South', 'West', 'Mahadevapura', 'Bommanahalli', 'Yelahanka'];

function App() {
  const [selectedWard, setSelectedWard] = useState(BANGALORE_WARDS[2]); // Default Whitefield
  const [selectedZone, setSelectedZone] = useState('All');
  const [zeroHistoryOnly, setZeroHistoryOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered wards based on search, zone, and zero-history
  const filteredWards = useMemo(() => {
    return BANGALORE_WARDS.filter((ward) => {
      const matchesSearch = ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ward.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesZone = selectedZone === 'All' || ward.zone === selectedZone;
      const matchesHistory = !zeroHistoryOnly || ward.history.includes('None');
      return matchesSearch && matchesZone && matchesHistory;
    });
  }, [searchQuery, selectedZone, zeroHistoryOnly]);

  const handleResetFilters = () => {
    setSelectedZone('All');
    setZeroHistoryOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      {/* Space for Header at the Top */}
      <Header />

      {/* Main 70% Left / 30% Right Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch h-[calc(100vh-120px)] min-h-[700px]">

          {/* Left Side: 70% Card with Bangalore Map */}
          <section className="w-full lg:w-[70%] flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col h-full">
              {/* Card Title & Info Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 m-0">Bangalore Geospatial Map</h2>
                    <p className="text-xs text-gray-500">
                      Showing {filteredWards.length} wards in Bengaluru (BBMP)
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Click a marker to inspect details
                </div>
              </div>

              {/* Map Component */}
              <div className="flex-1 w-full h-full min-h-[500px]">
                <Map
                  wards={filteredWards}
                  selectedWard={selectedWard}
                  onSelectWard={(ward) => setSelectedWard(ward)}
                />
              </div>
            </div>
          </section>

          {/* Right Side: 30% Column for other things (Filters, Charts, and custom modules) */}
          <aside className="w-full lg:w-[30%] flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Filter Component */}
            <Filter
              zones={ALL_ZONES}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              zeroHistoryOnly={zeroHistoryOnly}
              onToggleZeroHistory={setZeroHistoryOnly}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onReset={handleResetFilters}
            />

            {/* Charts Component */}
            <Charts
              wards={filteredWards}
              selectedWard={selectedWard}
            />

          </aside>

        </div>
      </main>
    </div>
  );
}

export default App;
