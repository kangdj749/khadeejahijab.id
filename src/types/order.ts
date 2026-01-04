import type { CheckoutData } from "@/lib/format-wa";

export interface PendingOrder extends CheckoutData {
  created_at: string;
  kota?: string;
  midtrans_order_id?: string;
  snap_token?: string;
}
