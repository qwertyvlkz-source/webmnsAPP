import { describe, expect, it } from "vitest";
import { normalizeReferralData } from "@/lib/referral";

describe("normalizeReferralData", () => {
  it("fills optional API fields with safe defaults", () => {
    expect(normalizeReferralData({ referral_code: "ABC_1" })).toEqual({
      referral_code: "ABC_1",
      referral_link: "",
      total_referrals: 0,
      total_earnings: 0,
      pending_earnings: 0,
      referrals: [],
    });
  });

  it("normalizes numeric values returned by the backend", () => {
    const normalized = normalizeReferralData({
      total_referrals: "3" as unknown as number,
      total_earnings: "49.5" as unknown as number,
      pending_earnings: "10" as unknown as number,
    });

    expect(normalized.total_referrals).toBe(3);
    expect(normalized.total_earnings).toBe(49.5);
    expect(normalized.pending_earnings).toBe(10);
  });
});
