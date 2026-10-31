import React, { useState, useRef, useEffect } from 'react';
import { Filter as FilterIcon, RotateCcw, Search, X, MapPin } from 'lucide-react';

export default function Filter({ 
  wards = [],
  zones = [], 
  selectedZone, 
  onSelectZone, 
  zeroHistoryOnly, 
  onToggleZeroHistory,
  searchQuery = '',
  onSearchChange,
  onSelectWard,
  onReset
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  // Filter suggestions based on query
  const suggestions = React.useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return [];
    return wards.filter(w => 
      w.name.toLowerCase().includes(q) || 
      (w.zone && w.zone.toLowerCase().includes(q)) ||
      String(w.wardNo || w.ward_id || '').includes(q)
    ).slice(0, 6);
  }, [searchQuery, wards]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (ward) => {
    if (onSearchChange) onSearchChange(ward.name);
    if (onSelectWard) onSelectWard(ward);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    if (onSearchChange) onSearchChange('');
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3.5 shadow-sm relative">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <FilterIcon className="h-4 w-4 text-orange-600" />
          <span>Filters</span>
        </div>
        {onReset && (
          <button 
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Search Input with Dynamic Auto-Suggestions */}
      <div className="relative" ref={containerRef}>
        <label className="block text-xs font-medium text-gray-600 mb-1">Search Ward</label>
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => {
              if (onSearchChange) onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type ward name, zone, or #..."
            className="w-full text-xs pl-8 pr-7 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in duration-150">
            <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Matching Wards ({suggestions.length})</span>
              <span className="text-orange-600">Click to Select</span>
            </div>
            {suggestions.map((ward) => (
              <button
                key={ward.id || ward.ward_id}
                type="button"
                onClick={() => handleSelectSuggestion(ward)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-orange-50/70 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  <div>
                    <span className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors block">
                      {ward.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {ward.zone || 'BBMP'} Zone
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 group-hover:bg-orange-100 text-gray-600 group-hover:text-orange-700 font-medium transition-colors">
                    #{ward.wardNo || ward.ward_id}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zero History Toggle */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Ward History Status</label>
        <button
          onClick={() => onToggleZeroHistory && onToggleZeroHistory(!zeroHistoryOnly)}
          className={`w-full text-xs font-medium px-3 py-2 rounded-lg border flex items-center justify-between transition-colors ${
            zeroHistoryOnly
              ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>Zero-History Wards Only</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            zeroHistoryOnly ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-600'
          }`}>
            {zeroHistoryOnly ? 'Active' : 'All Wards'}
          </span>
        </button>
      </div>

      {/* Zone Chips */}
      {zones.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">BBMP Zones</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onSelectZone && onSelectZone('All')}
              className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                selectedZone === 'All'
                  ? 'bg-orange-600 text-white font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Zones
            </button>
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => onSelectZone && onSelectZone(zone)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  selectedZone === zone
                    ? 'bg-orange-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
