import React from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export default function Charts({ wards = [], selectedWard }) {
  // Take top 5 wards by demand
  const topWards = [...wards]
    .sort((a, b) => (b.predictedDemand || 0) - (a.predictedDemand || 0))
    .slice(0, 5);

  const maxDemand = topWards.length > 0 ? Math.max(...topWards.map(w => w.predictedDemand || 1)) : 100;

  // Selected ward breakdown
  const current = selectedWard || wards[0] || { roads: 60, garbage: 75, water: 40, streetlights: 20, predictedDemand: 195 };
  const categories = [
    { label: 'Roads & Potholes', count: current.roads || 50, color: 'bg-blue-500' },
    { label: 'Solid Waste & Garbage', count: current.garbage || 65, color: 'bg-emerald-500' },
    { label: 'BWSSB Water & Drainage', count: current.water || 35, color: 'bg-cyan-500' },
    { label: 'BESCOM Streetlights', count: current.streetlights || 20, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Ward Comparison Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            <span>Demand by Ward</span>
          </div>
          <span className="text-[11px] text-gray-400">Monthly Est.</span>
        </div>

        <div className="space-y-2 pt-1">
          {topWards.map((w) => {
            const isSelected = selectedWard?.id === w.id;
            const pct = Math.round(((w.predictedDemand || 0) / maxDemand) * 100);

            return (
              <div key={w.id} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium truncate ${isSelected ? 'text-orange-600 font-bold' : 'text-gray-700'}`}>
                    {w.name}
                  </span>
                  <span className="font-mono text-gray-900 font-semibold">{w.predictedDemand}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isSelected ? 'bg-orange-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
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
          <span className="text-[11px] text-gray-500 font-medium truncate max-w-[100px]">{current.name || 'Selected'}</span>
        </div>

        <div className="space-y-2 pt-1">
          {categories.map((cat) => {
            const total = current.predictedDemand || 1;
            const pct = Math.round((cat.count / total) * 100);

            return (
              <div key={cat.label} className="text-xs">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span className="truncate">{cat.label}</span>
                  <span className="font-semibold text-gray-800">{cat.count} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${cat.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
