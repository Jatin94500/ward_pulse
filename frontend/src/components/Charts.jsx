import React from 'react';
import { BarChart3, PieChart, Zap, Trash2, Car, Trees, HeartPulse, HelpCircle, IndianRupee, HardHat } from 'lucide-react';

export default function Charts({ wards = [], selectedWard, onSelectWard }) {
  // Sort wards by demand
  const sortedWards = [...wards].sort(
    (a, b) => (b.predictedDemand || b.totalDemand || 0) - (a.predictedDemand || a.totalDemand || 0)
  );

  // Take top 5 wards by demand
  const topWards = sortedWards.slice(0, 5);

  // Ensure selectedWard is in the display list if it's not in top 5
  let displayWards = [...topWards];
  if (selectedWard && !topWards.some((w) => w.ward_id === selectedWard.ward_id)) {
    displayWards = [...topWards.slice(0, 4), selectedWard];
  }

  const maxDemand = displayWards.length > 0 
    ? Math.max(...displayWards.map(w => w.predictedDemand || w.totalDemand || 1)) 
    : 100;

  // Selected ward breakdown
  const current = selectedWard || wards[0] || { name: 'Select a ward', predictedDemand: 0, breakdown: {} };
  const b = current.breakdown || {};
  const total = current.totalDemand || current.predictedDemand || Object.values(b).reduce((acc, v) => acc + (Number(v) || 0), 0) || 1;

  // Cost and workforce benchmarks
  const COST_PER_COMPLAINT = {
    solid_waste: 650,
    electrical: 1200,
    roads: 4500,
    trees: 1800,
    animals_health: 950,
    other: 800
  };

  const WORKERS_CAP = {
    solid_waste: 14,
    electrical: 15,
    roads: 8,
    trees: 6,
    animals_health: 10,
    other: 12
  };

  let totalCost = 0;
  let totalPersonnel = 0;

  // Actual Hackathon Problem 03 Complaint Categories
  const categories = [
    { label: 'Solid Waste', key: 'solid_waste', count: b.solid_waste || 0, color: 'bg-emerald-500', icon: Trash2 },
    { label: 'Electrical', key: 'electrical', count: b.electrical || 0, color: 'bg-amber-500', icon: Zap },
    { label: 'Roads', key: 'roads', count: b.roads || 0, color: 'bg-blue-500', icon: Car },
    { label: 'Trees', key: 'trees', count: b.trees || 0, color: 'bg-green-600', icon: Trees },
    { label: 'Animal Health', key: 'animals_health', count: b.animals_health || 0, color: 'bg-rose-500', icon: HeartPulse },
    { label: 'Other Issues', key: 'other', count: b.other || 0, color: 'bg-purple-500', icon: HelpCircle },
  ].map((c) => {
    const costUnit = COST_PER_COMPLAINT[c.key] || 1000;
    const cap = WORKERS_CAP[c.key] || 10;
    const catCost = Math.round(c.count * costUnit);
    const catWorkers = c.count > 0 ? Math.max(1, Math.ceil(c.count / cap)) : 0;
    totalCost += catCost;
    totalPersonnel += catWorkers;
    return {
      ...c,
      cost: catCost,
      workers: catWorkers
    };
  });

  return (
    <div className="space-y-4">
      {/* Demand by Ward Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            <span>Demand by Ward</span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Recent Demands (Monthly Est.)</span>
        </div>

        <div className="space-y-2 pt-1">
          {displayWards.map((w) => {
            const isSelected = selectedWard?.ward_id === w.ward_id || selectedWard?.id === w.id;
            const demand = w.predictedDemand || Math.round(w.totalDemand || 0);
            const pct = Math.round((demand / maxDemand) * 100);

            return (
              <button
                key={w.ward_id || w.id}
                type="button"
                onClick={() => onSelectWard && onSelectWard(w)}
                className={`w-full text-left text-xs p-1.5 rounded-lg transition-colors ${
                  isSelected ? 'bg-orange-50/80 ring-1 ring-orange-400' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`truncate ${isSelected ? 'text-orange-600 font-bold' : 'text-gray-700 font-medium'}`}>
                    #{w.ward_id} {w.name} <span className="text-[10px] text-gray-400 font-normal">({w.zone})</span>
                  </span>
                  <span className={`font-mono font-semibold text-[11px] ml-1 ${isSelected ? 'text-orange-600' : 'text-gray-900'}`}>
                    {demand}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isSelected ? 'bg-orange-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown for Active Ward */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <PieChart className="h-4 w-4 text-orange-600" />
            <span>Category Distribution</span>
          </div>
          <span className="text-[11px] text-gray-700 font-bold truncate max-w-[130px]">
            {current.name}
          </span>
        </div>

        {/* Total, Cost & Workforce Status Summary Bar */}
        <div className="grid grid-cols-3 gap-1.5 text-[11px] p-2 bg-gray-50 rounded-lg">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Predicted Cases</span>
            <span className="font-bold text-orange-600 font-mono">{Math.round(total)}</span>
          </div>
          <div className="border-l border-gray-200 pl-1.5">
            <span className="text-[10px] text-gray-400 block font-medium flex items-center gap-0.5">
              <IndianRupee className="h-2.5 w-2.5 text-emerald-600" />
              Est. Budget
            </span>
            <span className="font-bold text-emerald-600 font-mono">
              {totalCost >= 100000 ? `₹${(totalCost / 100000).toFixed(1)}L` : `₹${Math.round(totalCost / 1000)}k`}
            </span>
          </div>
          <div className="border-l border-gray-200 pl-1.5">
            <span className="text-[10px] text-gray-400 block font-medium flex items-center gap-0.5">
              <HardHat className="h-2.5 w-2.5 text-blue-600" />
              Field Staff
            </span>
            <span className="font-bold text-blue-600 font-mono">{totalPersonnel}</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {categories.map((cat) => {
            const count = Math.round(Number(cat.count) * 10) / 10;
            const pct = Math.round((count / total) * 100) || 0;
            const Icon = cat.icon;

            return (
              <div key={cat.label} className="text-xs">
                <div className="flex justify-between items-center text-gray-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3 text-gray-400" />
                    <span>{cat.label}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-emerald-700 font-medium">
                      ₹{Math.round(cat.cost / 1000)}k
                    </span>
                    <span className="font-semibold text-gray-800 font-mono">
                      {count} <span className="text-[10px] text-gray-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${cat.color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
