export interface ReliefCampaign {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  district: string;
  goalAmount: number;
  raisedAmount: number;
  donorsCount: number;
  bannerImage: string;
  isUrgent: boolean;
  organizer: string;
  createdAt: string;
  matchedByGovt: boolean;
}

export type PaymentMethod = 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Digital Wallet';

export interface DonationRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  transactionId: string;
  receiptNumber: string;
  timestamp: string;
  state: string;
  isAnonymous: boolean;
}

export interface StateDonationSummary {
  state: string;
  totalAmount: number;
  donorCount: number;
  percentage: number;
}
