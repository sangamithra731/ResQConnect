import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmergencyContact } from '../../types/user';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { PhoneCall, Plus, Trash2, Heart, ArrowLeft, Home as HomeIcon, ShieldCheck } from 'lucide-react';

interface EmergencyContactsScreenProps {
  onBack: () => void;
  onExitToHome?: () => void;
}

export const EmergencyContactsScreen: React.FC<EmergencyContactsScreenProps> = ({
  onBack,
  onExitToHome
}) => {
  const { currentUser, addEmergencyContact, removeEmergencyContact, updateProfile } = useAuth();
  const contacts = currentUser?.emergencyContacts || [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [phone, setPhone] = useState('');
  const [isPrimary, setIsPrimary] = useState(contacts.length === 0);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addEmergencyContact({
      name,
      relationship,
      phone,
      isPrimary
    });

    setName('');
    setPhone('');
    setIsPrimary(false);
    setIsAddModalOpen(false);
  };

  const handleSetPrimary = (contactId: string) => {
    if (!currentUser) return;
    const updated = currentUser.emergencyContacts.map(c => ({
      ...c,
      isPrimary: c.id === contactId
    }));
    updateProfile({ emergencyContacts: updated });
  };

  const handleExit = () => {
    if (onExitToHome) onExitToHome();
    else onBack();
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Header with Exit to Home */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              SOS Contact Network
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Emergency Contacts
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="danger"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            Add
          </Button>

          <button
            onClick={handleExit}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
            title="Exit to Home"
          >
            <HomeIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Primary SOS Info */}
      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-3xl p-4 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
          Automated Emergency Relaying
        </p>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          When one-touch SOS is pressed, your Primary SOS contact and Tamil Nadu State Control (1070) will immediately receive your coordinates.
        </p>
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map(c => (
          <div
            key={c.id}
            className={`p-4 rounded-3xl bg-white dark:bg-slate-900 border transition-all space-y-3 ${
              c.isPrimary
                ? 'border-rose-400 dark:border-rose-800/80 shadow-md shadow-rose-500/5 ring-1 ring-rose-400/20'
                : 'border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-base shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</h4>
                    {c.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500 text-white shadow-sm">
                        PRIMARY SOS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {c.relationship} • {c.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeEmergencyContact(c.id)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Remove contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${c.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                <span>Call Directly ({c.phone})</span>
              </a>

              {!c.isPrimary && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSetPrimary(c.id)}
                  className="text-[11px] font-bold py-2"
                >
                  Set Primary
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Emergency Contact"
      >
        <form onSubmit={handleAddContact} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contact Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. State Emergency Control Room or Family"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              >
                <option value="Family">Family Member</option>
                <option value="TNSDMA Control">TNSDMA Authority</option>
                <option value="Doctor">Doctor / Hospital</option>
                <option value="Neighbor">Neighbor</option>
                <option value="Other">Other Contact</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="1070 or +91..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 dark:text-slate-300 pt-1">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="font-bold">Set as Primary Emergency SOS Recipient</span>
          </label>

          <div className="pt-2 flex gap-2">
            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full text-xs font-black uppercase py-3"
            >
              Save Emergency Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
