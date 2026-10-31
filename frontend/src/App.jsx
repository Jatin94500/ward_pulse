import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import Filter from './components/Filter';
import Charts from './components/Charts';
import { Layers } from 'lucide-react';

export default function App() {
  const [allWards, setAllWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedZone, setSelectedZone] = useState('All');
  const [zeroHistoryOnly, setZeroHistoryOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real Bangalore wards dataset with model predictions
  useEffect(() => {
    fetch('/bangalore_wards_data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load wards data');
        return res.json();
      })
      .then((data) => {
        setAllWards(data);
        // Default to first zero-history target ward (e.g. Ward 5 - Jakkuru)
        const defaultWard = data.find((w) => !w.has_history) || data[0];
        setSelectedWard(defaultWard);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading Bangalore wards data:', err);
        setLoading(false);
      });
  }, []);

  // Extract all unique real BBMP zones
  const zones = useMemo(() => {
    const set = new Set();
    allWards.forEach((w) => {
      if (w.zone) set.add(w.zone);
    });
    return Array.from(set).sort();
  }, [allWards]);

  // Filtered wards based on search, zone, and zero-history toggle
  const filteredWards = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    return allWards.filter((ward) => {
      const matchesSearch = 
        !q ||
        ward.name.toLowerCase().includes(q) ||
        (ward.zone && ward.zone.toLowerCase().includes(q)) ||
        String(ward.ward_id).includes(q);

      const matchesZone = selectedZone === 'All' || ward.zone === selectedZone;
      const matchesHistory = !zeroHistoryOnly || !ward.has_history;

      return matchesSearch && matchesZone && matchesHistory;
    });
  }, [allWards, searchQuery, selectedZone, zeroHistoryOnly]);

  const handleSelectWard = (ward) => {
    // If partial object passed, find full ward from allWards
    const fullWard = allWards.find((w) => w.ward_id === ward.ward_id) || ward;
    setSelectedWard(fullWard);
  };

  const handleResetFilters = () => {
    setSelectedZone('All');
    setZeroHistoryOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      {/* Header with requested Playfair Display & Zeyada fonts */}
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
                    <h2 className="text-base font-bold text-gray-900 m-0">Bangalore BBMP Wards Map</h2>
                    <p className="text-xs text-gray-500">
                      {loading 
                        ? 'Loading 198 wards...' 
                        : `Showing ${filteredWards.length} of ${allWards.length} BBMP Wards (${allWards.filter(w => !w.has_history).length} Target Zero-History)`}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-400 hidden sm:block">
                  Click any ward area on map to inspect
                </div>
              </div>

              {/* Map Component */}
              <div className="flex-1 w-full h-full min-h-[500px]">
                <Map
                  wards={allWards}
                  selectedWard={selectedWard}
                  onSelectWard={handleSelectWard}
                />
              </div>
            </div>
          </section>

          {/* Right Side: 30% Column */}
          <aside className="w-full lg:w-[30%] flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Filter Component with dynamic suggestions */}
            <Filter
              wards={allWards}
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              zeroHistoryOnly={zeroHistoryOnly}
              onToggleZeroHistory={setZeroHistoryOnly}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectWard={handleSelectWard}
              onReset={handleResetFilters}
            />

            {/* Charts Component with the 6 real categories */}
            <Charts
              wards={filteredWards}
              selectedWard={selectedWard}
              onSelectWard={handleSelectWard}
            />
          </aside>

        </div>
      </main>
    </div>
  );
}
