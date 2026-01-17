import {
  updatePaymentStatus,
  getOrderAffiliateAndTotal,
  getAffiliatePercent,
  affiliateCommissionExists,
  appendAffiliateCommission,
} from "@/lib/google-sheet";

export async function handlePaymentPaid(orderId: string) {
  // 1️⃣ ambil order
  const order = await getOrderAffiliateAndTotal(orderId);
  if (!order) return;

  // 2️⃣ update payment status (manual / admin)
  await updatePaymentStatus(orderId, {
    payment_status: "paid",
    payment_method: "manual",
  });

  // 3️⃣ tidak ada afiliasi → stop
  if (!order.affiliate_code) return;

  // 4️⃣ cegah dobel komisi (GUARD UTAMA)
  const alreadyExists = await affiliateCommissionExists(orderId);
  if (alreadyExists) return;

  // 5️⃣ ambil persentase
  const percent = await getAffiliatePercent(order.affiliate_code);
  if (!percent) return;

  // 6️⃣ hitung komisi
  const commission = (order.total * percent) / 100;

  // 7️⃣ append komisi (APPEND-ONLY)
  await appendAffiliateCommission([
    orderId,
    order.affiliate_code,
    order.total,
    commission,
    "earned",
    new Date().toISOString(),
  ]);
}
