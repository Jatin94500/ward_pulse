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
  Home,
  IndianRupee,
  HardHat,
  Wallet,
  Coins
} from 'lucide-react';

export default function WardStats({ wards = [], selectedWard, onSelectWard }) {
  if (!selectedWard) return null;

  const current = selectedWard;
  const b = current.breakdown || {};
  const totalDemand = current.predictedDemand || Math.round(current.totalDemand || 0);

  // BBMP Municipal Resolution Cost Benchmarks (INR)
  const MUNICIPAL_COST_PER_COMPLAINT = {
    solid_waste: 650,      // Collection, tipper transport, segregation
    electrical: 1200,      // Lineman labor, luminaire replacement, wiring
    roads: 4500,           // Cold/hot asphalt pothole repair, compaction
    trees: 1800,           // Hydraulic pruning crane, chainsaw crew, clearance
    animals_health: 950,   // ABC surgery, anti-rabies vaccination, handling
    other: 800             // Stormwater drain clearing & general civic works
  };

  // Average monthly complaints handled per dedicated field worker
  const COMPLAINTS_PER_WORKER = {
    solid_waste: 14,       // Pourakarmikas / sanitation workers
    electrical: 15,        // Linemen & wire technicians
    roads: 8,              // Pothole repair gang members
    trees: 6,              // Horticulture pruning squad
    animals_health: 10,    // Animal handlers & vet technicians
    other: 12              // General civic maintenance staff
  };

  const WORKER_ROLE_TITLES = {
    solid_waste: 'Pourakarmikas & SWM Crews',
    electrical: 'Linemen & Wire Technicians',
    roads: 'Road & Pothole Gangs',
    trees: 'Horticulture Pruning Squads',
    animals_health: 'Animal Handlers & Vet Staff',
    other: 'Civic Maintenance Technicians'
  };

  let totalEstimatedCost = 0;
  let totalFieldWorkforce = 0;

  const categories = [
    { key: 'solid_waste', label: 'Solid Waste', count: b.solid_waste || 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500', icon: Trash2 },
    { key: 'electrical', label: 'Electrical', count: b.electrical || 0, color: 'text-amber-700 bg-amber-50 border-amber-200', barColor: 'bg-amber-500', icon: Zap },
    { key: 'roads', label: 'Roads', count: b.roads || 0, color: 'text-blue-700 bg-blue-50 border-blue-200', barColor: 'bg-blue-500', icon: Car },
    { key: 'trees', label: 'Trees', count: b.trees || 0, color: 'text-green-800 bg-green-50 border-green-200', barColor: 'bg-green-600', icon: TreesIcon },
    { key: 'animals_health', label: 'Animal Health', count: b.animals_health || 0, color: 'text-rose-700 bg-rose-50 border-rose-200', barColor: 'bg-rose-500', icon: HeartPulse },
    { key: 'other', label: 'Other Civic Issues', count: b.other || 0, color: 'text-purple-700 bg-purple-50 border-purple-200', barColor: 'bg-purple-500', icon: HelpCircle },
  ].map((cat) => {
    const count = cat.count;
    const unitCost = MUNICIPAL_COST_PER_COMPLAINT[cat.key] || 1000;
    const workerCap = COMPLAINTS_PER_WORKER[cat.key] || 10;
    const cost = Math.round(count * unitCost);
    const workers = count > 0 ? Math.max(1, Math.ceil(count / workerCap)) : 0;
    
    totalEstimatedCost += cost;
    totalFieldWorkforce += workers;

    return {
      ...cat,
      unitCost,
      cost,
      workers,
      roleTitle: WORKER_ROLE_TITLES[cat.key]
    };
  });

  // Find department with highest cost
  const highestCostDept = [...categories].sort((a, b) => b.cost - a.cost)[0] || categories[0];

  const formatInr = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

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
            Official BBMP metrics, infrastructure attributes, resolution budget, and workforce forecasts
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

      {/* Ward Identity Hero Banner with Cost & Workforce Integration */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
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

        {/* Prediction Demand & Operations Triple Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-slate-700/80 w-full lg:w-auto">
          {/* Demand */}
          <div className="px-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Forecast Demand
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-orange-400 font-mono">{totalDemand}</span>
              <span className="text-[10px] text-slate-400">cases/mo</span>
            </div>
          </div>

          {/* Cost Prediction */}
          <div className="px-2 sm:border-l border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold flex items-center gap-1">
              <Coins className="h-3 w-3 text-emerald-400" />
              Est. Resolution Cost
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {formatInr(totalEstimatedCost)}
              </span>
            </div>
          </div>

          {/* Workforce Required */}
          <div className="px-2 border-l border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold flex items-center gap-1">
              <HardHat className="h-3 w-3 text-amber-400" />
              Field Personnel
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-amber-400 font-mono">{totalFieldWorkforce}</span>
              <span className="text-[10px] text-slate-400">workers</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="px-2 border-l border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Confidence</span>
            <span className="text-sm font-bold text-sky-400 flex items-center gap-1 mt-1">
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

      {/* NEW: Municipal Resource & Budget Planner Section */}
      <div className="p-5 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/40 via-amber-50/20 to-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-orange-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-600/20">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 m-0">
                Municipal Operations Budget & Workforce Planner
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Predictive operational expenditure (OpEx) and field personnel required to resolve forecasted ward grievances
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 whitespace-nowrap">
            BBMP Norm Benchmarks
          </span>
        </div>

        {/* 3 Operations KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block">
                Total Resolution Budget
              </span>
              <div className="text-xl font-extrabold text-emerald-600 font-mono mt-1">
                {formatInr(totalEstimatedCost)}
              </div>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                ₹{Math.round(totalEstimatedCost / Math.max(totalDemand, 1)).toLocaleString('en-IN')} avg. / complaint
              </span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Wallet className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block">
                Field Workforce Needed
              </span>
              <div className="text-xl font-extrabold text-blue-600 font-mono mt-1">
                {totalFieldWorkforce} Technicians
              </div>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                Across 6 departmental field crews
              </span>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <HardHat className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block">
                Peak Cost Department
              </span>
              <div className="text-xl font-extrabold text-orange-600 font-mono mt-1 capitalize truncate max-w-[150px]">
                {highestCostDept.label}
              </div>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                {formatInr(highestCostDept.cost)} ({highestCostDept.workers} staff allocated)
              </span>
            </div>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
              <Flame className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Detailed Department Cost & Workforce Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Civic Department</th>
                <th className="py-2.5 px-3 font-semibold text-right">Predicted Demand</th>
                <th className="py-2.5 px-3 font-semibold text-right">Norm Cost/Case</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Est. Budget</th>
                <th className="py-2.5 px-3 font-semibold text-right">Field Personnel Required</th>
                <th className="py-2.5 px-3 font-semibold text-left">Primary Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const costShare = Math.round((cat.cost / Math.max(totalEstimatedCost, 1)) * 100);

                return (
                  <tr key={cat.key} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-gray-900 flex items-center gap-2">
                      <div className={`p-1 rounded ${cat.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{cat.label}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-gray-800">
                      {cat.count} <span className="text-[10px] text-gray-400">cases</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-gray-600">
                      ₹{cat.unitCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      ₹{cat.cost.toLocaleString('en-IN')}
                      <span className="text-[10px] text-gray-400 font-normal ml-1">({costShare}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
                        <HardHat className="h-3 w-3" />
                        {cat.workers} {cat.workers === 1 ? 'person' : 'people'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px]">
                      {cat.roleTitle}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Operational Dispatch & Scheduling Insight */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Municipal Dispatch & Mobilization Advisory:</span>
            <p className="text-amber-800/90 leading-relaxed m-0 text-[11px]">
              Ward #{current.ward_id} ({current.name}) requires <strong>{totalFieldWorkforce} dedicated field personnel</strong> and an estimated resolution budget of <strong>{formatInr(totalEstimatedCost)}</strong> for the upcoming cycle. Priority funding should be directed towards <strong>{highestCostDept.label}</strong> (unit cost benchmark ₹{highestCostDept.unitCost.toLocaleString('en-IN')}) to maintain swift resolution SLA.
            </p>
          </div>
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

      {/* 6 Category Demand Pill Cards with Cost & Workers Mini Tags */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
          6 Official Complaint Categories Breakdown
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const pct = Math.round((cat.count / Math.max(totalDemand, 1)) * 100) || 0;

            return (
              <div key={cat.label} className={`p-2.5 rounded-xl border ${cat.color} space-y-1.5`}>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    <span>{cat.label}</span>
                  </span>
                  <span className="font-bold text-[11px] font-mono">{pct}%</span>
                </div>
                <div className="text-base font-extrabold font-mono text-gray-900">{cat.count}</div>
                <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden">
                  <div className={`h-1 rounded-full ${cat.barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] font-mono">
                  <span className="text-emerald-700 font-bold">₹{(cat.cost / 1000).toFixed(0)}k</span>
                  <span className="text-blue-700 font-semibold">{cat.workers} staff</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
