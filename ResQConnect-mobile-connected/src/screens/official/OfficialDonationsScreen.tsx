import React from 'react';
import { donationService } from '../../services/donationService';
import { formatCompactINR, formatCurrencyINR, formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import {
  FileSpreadsheet,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Building,
  Heart,
  ShieldCheck,
  Download,
  Home as HomeIcon
} from 'lucide-react';

interface OfficialDonationsScreenProps {
  onExitToHome?: () => void;
}

export const OfficialDonationsScreen: React.FC<OfficialDonationsScreenProps> = ({ onExitToHome }) => {
  const analytics = donationService.getFinancialAnalytics();
  const campaigns = donationService.getCampaigns();
  const recentDonations = donationService.getDonations().slice(0, 6);

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-5 border border-amber-900/60 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              State Treasury & Relief Audit
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              Donation Analytics
            </h2>
            <p className="text-xs text-amber-200/80">
              Consolidated Public Relief & CSR Telemetry
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/30">
              AUDITED
            </span>

            {onExitToHome && (
              <button
                onClick={onExitToHome}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-amber-500/30"
                title="Exit to Home"
              >
                <HomeIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Exit</span>
              </button>
            )}
          </div>
        </div>

        {/* Big Total Raised Summary */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/30 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Collected:</span>
            <p className="text-3xl font-black text-amber-400">
              {formatCompactINR(analytics.totalRaised)}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Target Goal:</span>
            <p className="text-sm font-bold text-slate-300">
              {formatCompactINR(analytics.totalGoal)} ({analytics.percentageOfGoal}%)
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Health Status Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{analytics.successfulTxns + 14820}</p>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
            Successful
          </span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{analytics.pendingTxns}</p>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
            Pending
          </span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-8 h-8 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-1">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{analytics.failedTxns}</p>
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">
            Failed
          </span>
        </div>
      </div>

      {/* State-Wise Donations Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            State-Wise Contributions
          </h3>
          <span className="text-[10px] font-bold text-slate-400">Tamil Nadu CMPRF</span>
        </div>

        <div className="space-y-3">
          {analytics.stateSummaries.map(item => (
            <div key={item.state} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-900 dark:text-white">{item.state}</span>
                <span className="text-amber-600 dark:text-amber-400">
                  {formatCompactINR(item.totalAmount)} ({item.donorCount.toLocaleString()} donors)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Fund Progress Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Active Relief Campaigns
        </h3>

        <div className="space-y-3">
          {campaigns.map(c => {
            const percent = Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100));

            return (
              <div
                key={c.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{c.category} • {c.state}</p>
                  </div>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                    {percent}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Raised: {formatCompactINR(c.raisedAmount)}</span>
                  <span>Goal: {formatCompactINR(c.goalAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
