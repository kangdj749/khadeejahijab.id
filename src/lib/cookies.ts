"use client";

import { AFFILIATE_KEY, normalizeAffiliate } from "./affiliate";

export function saveAffiliate(ref?: string | null) {
  const code = normalizeAffiliate(ref);
  if (!code) return;

  const payload = {
    code,
    firstVisit: new Date().toISOString(),
  };

  // localStorage
  localStorage.setItem(AFFILIATE_KEY, JSON.stringify(payload));

  // cookie 30 hari
  document.cookie = `${AFFILIATE_KEY}=${code}; path=/; max-age=${
    60 * 60 * 24 * 30
  }`;
}

export function getAffiliate(): { code: string } | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AFFILIATE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
