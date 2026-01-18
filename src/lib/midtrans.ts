import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string,
});

export default snap;

// batas midtrans = 50 char
export function truncateItemName(name: string, max = 50): string {
  if (!name) return "Item";
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}
