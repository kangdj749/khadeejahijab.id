// lib/affiliate.ts
export const AFFILIATE_KEY = "affiliate_data";
export const AFFILIATE_EXPIRY_DAYS = 30;

export type AffiliateData = {
  code: string;
  created_at: number;
  expires_at: number;
};

const DAY = 1000 * 60 * 60 * 24;

export function getAffiliate(): AffiliateData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AFFILIATE_KEY);
    if (!raw) return null;

    const data: AffiliateData = JSON.parse(raw);

    // ⏰ expired → auto clear
    if (Date.now() > data.expires_at) {
      localStorage.removeItem(AFFILIATE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * FIRST TOUCH + FIXED EXPIRY
 *
 * - Jika masih aktif → JANGAN override
 * - Jika expired / belum ada → set baru
 */
export function setAffiliate(code: string) {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const existing = getAffiliate();

  // 🔒 MASIH AKTIF → TIDAK BOLEH DIGANTI (BAIK SAMA / BEDA)
  if (existing && existing.expires_at > now) {
    return;
  }

  // ✅ BELUM ADA atau SUDAH EXPIRED → SET BARU
  const data: AffiliateData = {
    code,
    created_at: now,
    expires_at: now + AFFILIATE_EXPIRY_DAYS * DAY,
  };

  localStorage.setItem(AFFILIATE_KEY, JSON.stringify(data));
}

export function clearAffiliate() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AFFILIATE_KEY);
}
