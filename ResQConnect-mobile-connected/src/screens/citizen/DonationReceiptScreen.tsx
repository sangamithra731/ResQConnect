import React from 'react';
import { DonationRecord } from '../../types/donation';
import { formatCurrencyINR, formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { CheckCircle2, ShieldCheck, Download, Home as HomeIcon } from 'lucide-react';

interface DonationReceiptScreenProps {
  donation: DonationRecord;
  onBackToHome: () => void;
}

export const DonationReceiptScreen: React.FC<DonationReceiptScreenProps> = ({
  donation,
  onBackToHome
}) => {
  return (
    <div className="space-y-4 pb-20 animate-fadeIn max-w-sm mx-auto">
      {/* Top Success Banner */}
      <div className="text-center pt-2 pb-1 space-y-2">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border-2 border-emerald-500/40 shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Payment Confirmed
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {formatCurrencyINR(donation.amount)}
          </h2>
        </div>
      </div>

      {/* Specific Details Only Receipt Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5 text-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-xs block">Official Tax Receipt</span>
            <span className="text-[10px] font-mono text-slate-400">#{donation.receiptNumber}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            80G Exempt
          </span>
        </div>

        {/* Key Transactional Details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Transaction ID:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">{donation.transactionId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Campaign:</span>
            <span className="font-bold text-slate-900 dark:text-white text-right max-w-[160px] truncate">
              {donation.campaignTitle}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Donor Name:</span>
            <span className="font-bold text-slate-900 dark:text-white">{donation.donorName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Payment Mode:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{donation.paymentMethod}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{formatDateTime(donation.timestamp)}</span>
          </div>

          <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-700 dark:text-slate-300">Amount Paid:</span>
            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
              {formatCurrencyINR(donation.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Back to Home Button */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onBackToHome}
          leftIcon={<HomeIcon className="w-4 h-4" />}
          className="w-full text-xs font-black uppercase py-3.5 shadow-lg"
        >
          Exit to Home Dashboard
        </Button>
      </div>
    </div>
  );
};
