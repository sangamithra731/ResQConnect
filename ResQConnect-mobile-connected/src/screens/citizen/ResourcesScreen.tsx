import React, { useState } from 'react';
import { resourceService } from '../../services/resourceService';
import { helperService } from '../../services/helperService';
import { TN_EMERGENCY_NUMBERS } from '../../services/mockData';
import { ResourceItem, ResourceCategory } from '../../types/resource';
import { HelperProfile } from '../../types/helper';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import {
  LifeBuoy,
  Phone,
  MapPin,
  Search,
  CheckCircle2,
  HeartHandshake,
  ShieldAlert,
  Home as HomeIcon,
  ArrowLeft,
  PhoneCall
} from 'lucide-react';

interface ResourcesScreenProps {
  onSelectResource?: (res: ResourceItem) => void;
  onOpenMap?: () => void;
  onExitToHome?: () => void;
}

export const ResourcesScreen: React.FC<ResourcesScreenProps> = ({
  onSelectResource,
  onOpenMap,
  onExitToHome
}) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'helpers' | 'helplines'>('resources');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allResources = resourceService.getResources();
  const allHelpers = helperService.getVerifiedHelpers();

  const categories: { key: string; label: string; icon: string }[] = [
    { key: 'ALL', label: 'All', icon: '⚡' },
    { key: 'Ambulance', label: '108 EMS Ambulance', icon: '🚑' },
    { key: 'Hospital', label: 'Government Hospitals', icon: '🏥' },
    { key: 'Fire & Rescue', label: 'TN Fire & Rescue', icon: '🚒' },
    { key: 'Rescue Team', label: 'Rescue Boats', icon: '🛟' },
    { key: 'Food Supplies', label: 'Food Rations', icon: '🍱' },
    { key: 'Shelter', label: 'GCC Relief Shelters', icon: '🏠' },
    { key: 'Medical Supplies', label: 'Medical Kits', icon: '💊' }
  ];

  const tnOfficialHelplines = [
    { name: 'State Disaster Management Control (TNSDMA)', number: '1070', desc: 'State 24/7 Disaster Response Headquarters', icon: '🏛️' },
    { name: 'District Emergency Operations Centre (DEOC)', number: '1077', desc: 'District Collectorate Emergency Desk', icon: '📍' },
    { name: 'Tamil Nadu 108 Emergency Medical Services', number: '108', desc: 'Ambulance, EMT & Paramedic Dispatch', icon: '🚑' },
    { name: 'Tamil Nadu Fire & Rescue Services (TNFRS)', number: '101', desc: 'Fire, Flood De-watering & Snorkel Rescue', icon: '🚒' },
    { name: 'Greater Chennai Corporation (GCC) Disaster Line', number: '1913', desc: 'Urban Inundation & Shelter Allocation', icon: '🏢' },
    { name: 'Tamil Nadu Police Emergency Control', number: '112', desc: 'Unified National Emergency Number', icon: '👮' },
    { name: 'Coastal Disaster & Flood Control Room', number: '044-28593990', desc: 'Chepauk State Operations Center', icon: '🌊' }
  ];

  let filteredResources = allResources;
  if (selectedCategory !== 'ALL') {
    filteredResources = filteredResources.filter(r => r.category === selectedCategory);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredResources = filteredResources.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.location.address?.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }

  let filteredHelpers = allHelpers;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredHelpers = filteredHelpers.filter(
      h =>
        h.name.toLowerCase().includes(q) ||
        h.skills.some(s => s.toLowerCase().includes(q)) ||
        h.verificationBadge.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header with Exit to Home */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Tamil Nadu Disaster Relief Directory
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Emergency Resources
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenMap && (
              <button
                onClick={onOpenMap}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            )}

            {onExitToHome && (
              <button
                onClick={onExitToHome}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
                title="Exit to Home"
              >
                <HomeIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Exit</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'resources'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Resources ({allResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('helplines')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'helplines'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-300 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>TN Helplines</span>
          </button>

          <button
            onClick={() => setActiveTab('helpers')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'helpers'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Helpers</span>
          </button>
        </div>

        {/* Search Bar */}
        {activeTab !== 'helplines' && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'resources' ? 'Search 108 ambulances, hospitals, shelters...' : 'Search helpers by skill, EMT, name...'}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        )}

        {/* Horizontal Category Filters */}
        {activeTab === 'resources' && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Official Tamil Nadu Department Numbers Tab */}
      {activeTab === 'helplines' && (
        <div className="space-y-3">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-3xl border border-red-200 dark:border-red-900/50 text-xs text-red-900 dark:text-red-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              Official Tamil Nadu Government Helplines
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Toll-free emergency numbers for immediate rescue, ambulance, and disaster assistance across Tamil Nadu.
            </p>
          </div>

          <div className="space-y-2.5">
            {tnOfficialHelplines.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {item.desc}
                    </p>
                    <span className="font-mono font-black text-xs text-red-600 dark:text-red-400">
                      Dial: {item.number}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95 transition-all shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-3">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-blue-400 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                    {res.category === 'Ambulance'
                      ? '🚑'
                      : res.category === 'Hospital'
                      ? '🏥'
                      : res.category === 'Rescue Team'
                      ? '🛟'
                      : res.category === 'Fire & Rescue'
                      ? '🚒'
                      : res.category === 'Shelter'
                      ? '🏠'
                      : res.category === 'Food Supplies'
                      ? '🍱'
                      : '💊'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                      {res.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {res.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{res.location.address}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <StatusBadge status={res.status} variant="status" size="sm" />
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                    {res.distanceKm} km away
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Available:</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {res.availableQuantity} / {res.quantity} {res.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 dark:text-slate-400">Desk Officer:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                    {res.contactPerson}
                  </p>
                </div>
              </div>

              {res.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  💡 {res.notes}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${res.contactPhone}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Helpline ({res.contactPhone})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helpers Tab */}
      {activeTab === 'helpers' && (
        <div className="space-y-3">
          {filteredHelpers.map(helper => (
            <div
              key={helper.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-400 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={helper.avatar}
                      alt={helper.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-1 -right-1" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1 truncate">
                      {helper.name}
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      {helper.verificationBadge}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-bold text-amber-500">⭐ {helper.rating}</span>
                      <span>•</span>
                      <span>{helper.completedMissions} missions</span>
                      <span>•</span>
                      <span>{helper.distanceKm} km away</span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={helper.availability} variant="availability" size="sm" />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {helper.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${helper.phone}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Volunteer ({helper.phone})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
