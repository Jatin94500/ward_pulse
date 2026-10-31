import React from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  Layers, 
  TrendingUp, 
  Compass, 
  Lightbulb, 
  ShieldCheck, 
  AlertTriangle,
  Trees as TreesIcon,
  Droplets,
  Bus,
  School,
  Shield,
  Activity,
  Flame,
  Zap,
  Trash2,
  Car,
  HeartPulse,
  HelpCircle,
  Home
} from 'lucide-react';

export default function WardStats({ wards = [], selectedWard, onSelectWard }) {
  if (!selectedWard) return null;

  const current = selectedWard;
  const b = current.breakdown || {};
  const totalDemand = current.predictedDemand || Math.round(current.totalDemand || 0);

  const categories = [
    { label: 'Solid Waste', count: b.solid_waste || 0, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: Trash2 },
    { label: 'Electrical', count: b.electrical || 0, color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Zap },
    { label: 'Roads', count: b.roads || 0, color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Car },
    { label: 'Trees', count: b.trees || 0, color: 'text-green-700 bg-green-50 border-green-200', icon: TreesIcon },
    { label: 'Animal Health', count: b.animals_health || 0, color: 'text-rose-600 bg-rose-50 border-rose-200', icon: HeartPulse },
    { label: 'Other Civic Issues', count: b.other || 0, color: 'text-purple-600 bg-purple-50 border-purple-200', icon: HelpCircle },
  ];

  const handleDropdownChange = (e) => {
    const wid = Number(e.target.value);
    const target = wards.find(w => w.ward_id === wid);
    if (target && onSelectWard) {
      onSelectWard(target);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-6">
      {/* Top Header & Ward Dropdown Selection */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700">
              <Activity className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 m-0">Ward Statistical Profile</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              Census & Geospatial Data
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Official BBMP metrics, infrastructure attributes, and demand forecast for selected ward
          </p>
        </div>

        {/* Dropdown selector with all 198 wards from ward_features_clean.csv */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="ward-select" className="text-xs font-semibold text-gray-600 whitespace-nowrap">
            Select Ward:
          </label>
          <select
            id="ward-select"
            value={current.ward_id || ''}
            onChange={handleDropdownChange}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 shadow-sm max-w-[280px] w-full"
          >
            {wards.map((w) => (
              <option key={w.ward_id} value={w.ward_id}>
                #{w.ward_id} - {w.name} ({w.zone}) {w.has_history ? '' : '★ Zero History'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ward Identity Hero Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
              BBMP Ward #{current.ward_id}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              current.has_history
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {current.history_status}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white m-0">
            {current.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {current.zone} Zone · Assembly: <strong className="text-slate-200">{current.assembly_constituency || 'N/A'}</strong> · MP: <strong className="text-slate-200">{current.mp_constituency || 'N/A'}</strong>
          </p>
        </div>

        {/* Prediction Demand Summary Badge */}
        <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Forecast Demand
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-orange-400">{totalDemand}</span>
              <span className="text-xs text-slate-400">complaints / mo</span>
            </div>
          </div>
          <div className="text-right border-l border-slate-700 pl-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Confidence</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end mt-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {current.confidence || '92%'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Statistical Feature Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Population */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span>Population</span>
          </div>
          <div className="text-base font-bold text-gray-900">{current.population || 'N/A'}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Census 2011</div>
        </div>

        {/* Area */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <MapPin className="h-3.5 w-3.5 text-rose-500" />
            <span>Ward Area</span>
          </div>
          <div className="text-base font-bold text-gray-900">{current.area_sq_km} km²</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Surface Area</div>
        </div>

        {/* Households */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <Home className="h-3.5 w-3.5 text-amber-500" />
            <span>Households</span>
          </div>
          <div className="text-base font-bold text-gray-900">{current.households || 'N/A'}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Census Record</div>
        </div>

        {/* Road Network */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <Car className="h-3.5 w-3.5 text-indigo-500" />
            <span>Road Length</span>
          </div>
          <div className="text-base font-bold text-gray-900">{current.road_length_kms} km</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Road Network</div>
        </div>

        {/* Streetlights */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <span>Streetlights</span>
          </div>
          <div className="text-base font-bold text-gray-900">{current.streetlights?.toLocaleString() || 0}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Public Lighting</div>
        </div>

        {/* Population Density */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span>Density</span>
          </div>
          <div className="text-base font-bold text-gray-900">{current.density_per_sq_km?.toLocaleString() || 'N/A'}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">persons / km²</div>
        </div>
      </div>

      {/* Infrastructure & Civic Assets Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Civic Amenities & Transit */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
            Civic Amenities & Transit
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2 rounded-lg bg-gray-50">
              <span className="text-gray-400 block text-[10px]">Bus Stops</span>
              <span className="font-bold text-gray-800">{current.bus_stops || 0} ({current.bus_routes || 0} routes)</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <span className="text-gray-400 block text-[10px]">Govt Schools</span>
              <span className="font-bold text-gray-800">{current.govt_schools || 0}</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <span className="text-gray-400 block text-[10px]">Police Stations</span>
              <span className="font-bold text-gray-800">{current.police_stations || 0}</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <span className="text-gray-400 block text-[10px]">Fire Stations</span>
              <span className="font-bold text-gray-800">{current.fire_stations || 0}</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <span className="text-gray-400 block text-[10px]">Decadal Growth</span>
              <span className="font-bold text-gray-800">+{current.decadal_growth_rate || 0}%</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <span className="text-gray-400 block text-[10px]">Playgrounds</span>
              <span className="font-bold text-gray-800">{current.playgrounds || 0}</span>
            </div>
          </div>
        </div>

        {/* Green & Environmental Assets */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
            Green & Environmental Assets
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-semibold">Parks & Green Spaces</span>
              <span className="font-bold text-emerald-900 text-sm">{current.parks || 0}</span>
              <span className="text-[10px] text-emerald-600 block">
                {current.park_area_sq_m ? `${Math.round(current.park_area_sq_m).toLocaleString()} m²` : '0 m²'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-cyan-50/60 border border-cyan-100">
              <span className="text-cyan-700 block text-[10px] font-semibold">Lakes & Water Bodies</span>
              <span className="font-bold text-cyan-900 text-sm">{current.lakes || 0}</span>
              <span className="text-[10px] text-cyan-600 block">
                {current.lake_area_sq_m ? `${Math.round(current.lake_area_sq_m).toLocaleString()} m²` : '0 m²'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Category Demand Pill Cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
          6 Official Complaint Categories Breakdown
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const pct = Math.round((cat.count / totalDemand) * 100) || 0;

            return (
              <div key={cat.label} className={`p-2.5 rounded-xl border ${cat.color} space-y-1`}>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    <span>{cat.label}</span>
                  </span>
                  <span className="font-bold text-[11px] font-mono">{pct}%</span>
                </div>
                <div className="text-base font-extrabold font-mono text-gray-900">{cat.count}</div>
                <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden">
                  <div className="bg-current h-1 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
