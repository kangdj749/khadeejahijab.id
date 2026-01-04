// lib/sheets/orders.ts
export async function createOrder(orderData: any) {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxFgDazALpW1cALeIGITalf1oNbm_NRXkxWI3Z1iViII0x6T5azxhS7ANQTkFnRNAaK/exec"; // ganti dengan URL web app kamu

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal simpan pesanan");

    return result;
  } catch (err) {
    console.error("❌ createOrder error:", err);
    return { success: false, error: err };
  }
}
