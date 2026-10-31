import React from 'react';
import { Filter as FilterIcon, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Filter({ 
  zones = [], 
  selectedZone, 
  onSelectZone, 
  zeroHistoryOnly, 
  onToggleZeroHistory,
  searchQuery,
  onSearchChange,
  onReset
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3.5 shadow-sm">
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

      {/* Search Input */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Search Ward</label>
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="e.g. Indiranagar, Whitefield..."
          className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
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
