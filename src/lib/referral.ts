export interface ReferralEntry {
  id: number;
  name: string;
  email: string;
  joined_at: string;
  status: string;
  earnings: number;
}

export interface ReferralData {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  referrals: ReferralEntry[];
}

export const normalizeReferralData = (data: Partial<ReferralData>): ReferralData => ({
  referral_code: data.referral_code || "",
  referral_link: data.referral_link || "",
  total_referrals: Number(data.total_referrals) || 0,
  total_earnings: Number(data.total_earnings) || 0,
  pending_earnings: Number(data.pending_earnings) || 0,
  referrals: Array.isArray(data.referrals) ? data.referrals : [],
});
