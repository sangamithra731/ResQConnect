import React, { useState } from 'react';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../context/AuthContext';
import { ReliefCampaign, DonationRecord, PaymentMethod } from '../../types/donation';
import { formatCompactINR, formatCurrencyINR } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import {
  Heart,
  ArrowLeft,
  Home as HomeIcon,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  ArrowRight,
  IndianRupee
} from 'lucide-react';

interface DonationScreenProps {
  initialCampaignId?: string;
  onBack: () => void;
  onExitToHome?: () => void;
  onDonationSuccess: (donation: DonationRecord) => void;
}

export const DonationScreen: React.FC<DonationScreenProps> = ({
  initialCampaignId,
  onBack,
  onExitToHome,
  onDonationSuccess
}) => {
  const { currentUser } = useAuth();
  const campaigns = donationService.getCampaigns();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    initialCampaignId || (campaigns.length > 0 ? campaigns[0].id : '')
  );
  const [donationAmount, setDonationAmount] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];
  const numAmount = parseFloat(donationAmount) || 0;

  const handleProcessDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsProcessing(true);
    try {
      const don = await donationService.processDonation({
        campaignId: selectedCampaign.id,
        amount: numAmount,
        donorName: isAnonymous ? 'Anonymous Donor' : donorName,
        donorEmail,
        donorPhone,
        paymentMethod,
        isAnonymous
      });

      onDonationSuccess(don);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExit = () => {
    if (onExitToHome) onExitToHome();
    else onBack();
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header with Exit to Home Button */}
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
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Disaster Relief Fund
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Contribute for Relief
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExit}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          title="Exit to Home"
        >
          <HomeIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>Exit Home</span>
        </button>
      </div>

      <form onSubmit={handleProcessDonation} className="space-y-4">
        {/* Campaign Info */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Verified Relief Initiative
            </span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {selectedCampaign.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {selectedCampaign.description}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-900 dark:text-white">Fund Progress</span>
              <span className="text-amber-600 dark:text-amber-400">
                {formatCompactINR(selectedCampaign.raisedAmount)} / {formatCompactINR(selectedCampaign.goalAmount)}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((selectedCampaign.raisedAmount / selectedCampaign.goalAmount) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Free-Form Donation Amount (No forced presets) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Enter Donation Amount *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg text-amber-600 dark:text-amber-400">
              ₹
            </span>
            <input
              type="number"
              min="1"
              required
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount (e.g. 500, 1000, 2500...)"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Any contribution amount is eligible for 80G tax exemption.
          </p>
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Select Payment Method *
          </label>

          <div className="grid grid-cols-3 gap-2">
            {(['UPI', 'Credit / Debit Card', 'Net Banking'] as PaymentMethod[]).map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === method
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {method === 'UPI' ? (
                  <QrCode className="w-5 h-5 text-amber-500" />
                ) : method === 'Credit / Debit Card' ? (
                  <CreditCard className="w-5 h-5 text-blue-500" />
                ) : (
                  <Building className="w-5 h-5 text-emerald-500" />
                )}
                <span className="text-[10px] truncate w-full">{method}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Donor Information */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Donor Details (for Receipt)
          </label>

          <div className="space-y-2.5 text-xs">
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Donor Full Name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                required
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-600 dark:text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Anonymous contribution</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isProcessing}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm uppercase py-4 shadow-xl shadow-amber-600/30"
          >
            [ COMPLETE DONATION — {formatCurrencyINR(numAmount)} ]
          </Button>
        </div>
      </form>
    </div>
  );
};
