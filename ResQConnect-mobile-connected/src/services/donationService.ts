import { ReliefCampaign, DonationRecord, StateDonationSummary, PaymentMethod } from '../types/donation';
import { MOCK_CAMPAIGNS, MOCK_DONATIONS, MOCK_STATE_DONATIONS } from './mockData';

const STORAGE_KEY_CAMPAIGNS = 'resq_campaigns';
const STORAGE_KEY_DONATIONS = 'resq_donations';

class DonationService {
  private campaigns: ReliefCampaign[] = [];
  private donations: DonationRecord[] = [];
  private stateSummaries: StateDonationSummary[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const storedCamp = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (storedCamp) {
      try {
        this.campaigns = JSON.parse(storedCamp);
      } catch {
        this.campaigns = [...MOCK_CAMPAIGNS];
      }
    } else {
      this.campaigns = [...MOCK_CAMPAIGNS];
      this.saveCampaigns();
    }

    const storedDon = localStorage.getItem(STORAGE_KEY_DONATIONS);
    if (storedDon) {
      try {
        this.donations = JSON.parse(storedDon);
      } catch {
        this.donations = [...MOCK_DONATIONS];
      }
    } else {
      this.donations = [...MOCK_DONATIONS];
      this.saveDonations();
    }

    this.stateSummaries = [...MOCK_STATE_DONATIONS];
  }

  private saveCampaigns() {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(this.campaigns));
  }

  private saveDonations() {
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(this.donations));
  }

  public getCampaigns(): ReliefCampaign[] {
    return [...this.campaigns];
  }

  public getCampaignById(id: string): ReliefCampaign | undefined {
    return this.campaigns.find(c => c.id === id);
  }

  public getDonations(): DonationRecord[] {
    return [...this.donations];
  }

  public getDonationById(id: string): DonationRecord | undefined {
    return this.donations.find(d => d.id === id);
  }

  public getDonationsByCampaign(campaignId: string): DonationRecord[] {
    return this.donations.filter(d => d.campaignId === campaignId);
  }

  public getStateSummaries(): StateDonationSummary[] {
    return [...this.stateSummaries];
  }

  public processDonation(params: {
    campaignId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    paymentMethod: PaymentMethod;
    state?: string;
    isAnonymous?: boolean;
  }): Promise<DonationRecord> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const campaign = this.getCampaignById(params.campaignId);
        const randomTxn = Math.floor(Math.random() * 9000000000) + 1000000000;
        const randomReceipt = Math.floor(Math.random() * 9000) + 1000;

        const newDonation: DonationRecord = {
          id: `don-${Date.now()}`,
          campaignId: params.campaignId,
          campaignTitle: campaign?.title || 'Emergency Relief Fund',
          donorName: params.donorName,
          donorEmail: params.donorEmail,
          donorPhone: params.donorPhone,
          amount: params.amount,
          paymentMethod: params.paymentMethod,
          status: 'SUCCESS',
          transactionId: `TXN-${params.paymentMethod.replace(/\s+/g, '')}-${randomTxn}`,
          receiptNumber: `RC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomReceipt}`,
          timestamp: new Date().toISOString(),
          state: params.state || campaign?.state || 'Tamil Nadu',
          isAnonymous: !!params.isAnonymous
        };

        this.donations.unshift(newDonation);
        this.saveDonations();

        // Update campaign raised amount and donor count
        if (campaign) {
          campaign.raisedAmount += params.amount;
          campaign.donorsCount += 1;
          this.saveCampaigns();
        }

        resolve(newDonation);
      }, 500);
    });
  }

  public getFinancialAnalytics() {
    const totalRaised = this.campaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
    const totalGoal = this.campaigns.reduce((sum, c) => sum + c.goalAmount, 0);
    const totalDonors = this.campaigns.reduce((sum, c) => sum + c.donorsCount, 0);
    const successfulTxns = this.donations.filter(d => d.status === 'SUCCESS').length;
    const pendingTxns = 2; // mock
    const failedTxns = 1; // mock

    return {
      totalRaised,
      totalGoal,
      totalDonors,
      successfulTxns,
      pendingTxns,
      failedTxns,
      percentageOfGoal: Math.round((totalRaised / totalGoal) * 100),
      stateSummaries: this.stateSummaries
    };
  }
}

export const donationService = new DonationService();
