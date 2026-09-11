import React, { useState } from 'react';
import { resourceService } from '../../services/resourceService';
import { ResourceItem, ResourceCategory, ResourceStatus } from '../../types/resource';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Boxes,
  Plus,
  Trash2,
  Edit3,
  Phone,
  MapPin,
  Search,
  CheckCircle2,
  LifeBuoy,
  Home as HomeIcon
} from 'lucide-react';

interface ManageResourcesScreenProps {
  onExitToHome?: () => void;
}

export const ManageResourcesScreen: React.FC<ManageResourcesScreenProps> = ({ onExitToHome }) => {
  const [resources, setResources] = useState<ResourceItem[]>(() => resourceService.getResources());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Ambulance');
  const [quantity, setQuantity] = useState<number>(10);
  const [availableQuantity, setAvailableQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('Vehicles');
  const [address, setAddress] = useState('Central Fire & Emergency Station, Chennai');
  const [contactPerson, setContactPerson] = useState('Station Officer');
  const [contactPhone, setContactPhone] = useState('108');
  const [notes, setNotes] = useState('');

  const refreshList = () => {
    setResources(resourceService.getResources());
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCategory('Ambulance');
    setQuantity(10);
    setAvailableQuantity(10);
    setUnit('Vehicles');
    setAddress('Chennai Central Logistics Base');
    setContactPerson('Duty Officer');
    setContactPhone('108');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res: ResourceItem) => {
    setEditingId(res.id);
    setName(res.name);
    setCategory(res.category);
    setQuantity(res.quantity);
    setAvailableQuantity(res.availableQuantity);
    setUnit(res.unit);
    setAddress(res.location.address || 'Chennai');
    setContactPerson(res.contactPerson);
    setContactPhone(res.contactPhone);
    setNotes(res.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      resourceService.updateResource(editingId, {
        name,
        category,
        quantity,
        availableQuantity,
        unit,
        location: { lat: 12.9815, lng: 80.2209, address },
        contactPerson,
        contactPhone,
        notes,
        status: availableQuantity > 0 ? 'AVAILABLE' : 'DEPLETED'
      });
    } else {
      resourceService.addResource({
        name,
        category,
        quantity,
        availableQuantity,
        unit,
        location: { lat: 12.9815, lng: 80.2209, address },
        distanceKm: 2.5,
        contactPerson,
        contactPhone,
        status: 'AVAILABLE',
        district: 'Chennai',
        state: 'Tamil Nadu',
        notes
      });
    }

    refreshList();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this resource item from state inventory?')) {
      resourceService.deleteResource(id);
      refreshList();
    }
  };

  const handleQuickQuantity = (id: string, currentAvailable: number, delta: number) => {
    const updated = Math.max(0, currentAvailable + delta);
    resourceService.updateQuantity(id, updated);
    refreshList();
  };

  let filtered = resources;
  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter(r => r.category === selectedCategory);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.address?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              State Logistics & Fleet
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Resource Management
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="primary"
              onClick={handleOpenAdd}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-bold"
            >
              Add
            </Button>

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

        {/* Search & Filter */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emergency inventory..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Ambulance">108 Ambulance</option>
            <option value="Hospital">Hospital</option>
            <option value="Fire & Rescue">Fire & Rescue</option>
            <option value="Rescue Team">Rescue Team</option>
            <option value="Food Supplies">Food Rations</option>
            <option value="Shelter">Shelters</option>
            <option value="Medical Supplies">Medical Kits</option>
          </select>
        </div>
      </div>

      {/* Resources Feed */}
      <div className="space-y-3">
        {filtered.map(res => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  {res.category}
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {res.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{res.location.address}</span>
                </p>
              </div>

              <StatusBadge status={res.status} variant="status" size="sm" />
            </div>

            {/* Inventory Controls */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase">
                  Available Fleet / Units:
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  <span className="text-emerald-600 dark:text-emerald-400">{res.availableQuantity}</span> / {res.quantity} {res.unit}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuickQuantity(res.id, res.availableQuantity, -1)}
                  className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-bold text-sm flex items-center justify-center transition-colors"
                  title="Dispatch 1 Unit"
                >
                  -
                </button>
                <button
                  onClick={() => handleQuickQuantity(res.id, res.availableQuantity, +1)}
                  className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center transition-colors"
                  title="Restock 1 Unit"
                >
                  +
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Contact: <strong className="text-slate-800 dark:text-slate-200">{res.contactPerson} ({res.contactPhone})</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(res)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
                  title="Edit details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(res.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Emergency Resource' : 'Add New Emergency Resource'}
      >
        <form onSubmit={handleSaveResource} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Resource Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tamil Nadu 108 ALS Ambulance #14"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ambulance">108 Ambulance</option>
                <option value="Hospital">Hospital</option>
                <option value="Fire & Rescue">Fire & Rescue</option>
                <option value="Rescue Team">Rescue Team</option>
                <option value="Food Supplies">Food Supplies</option>
                <option value="Shelter">Shelter</option>
                <option value="Medical Supplies">Medical Supplies</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Unit Metric *
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Vehicles, Beds, Packs..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Available Now *
              </label>
              <input
                type="number"
                required
                min="0"
                max={quantity}
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Station Location / Base Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Base location address..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Station Officer"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Direct Helpline *
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="108 or 1070"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-xs font-black uppercase py-3"
            >
              {editingId ? 'Update Resource' : 'Register Resource'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
