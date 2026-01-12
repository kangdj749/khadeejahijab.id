export const AFFILIATE_KEY = "affiliate_ref";

export type AffiliateData = {
  code: string;
  source?: string;
  firstVisit: string;
};

export function normalizeAffiliate(code?: string | null) {
  if (!code) return null;
  return code.trim().toUpperCase();
}
