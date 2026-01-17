import { google } from "googleapis";

/* =========================
   GOOGLE SHEETS CLIENT
========================= */
function getClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/* =========================
   APPEND ORDER (1x SAJA)
========================= */
export async function appendOrder(row: (string | number)[]) {
  const sheets = getClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A:Q",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

/* =========================
   FIND ROW BY ORDER ID
========================= */
async function findRowByOrderId(orderId: string): Promise<number | null> {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A2:A",
  });

  const rows = res.data.values ?? [];
  const idx = rows.findIndex((r) => r[0] === orderId);

  return idx === -1 ? null : idx + 2;
}

/* =========================
   UPDATE SNAP TOKEN (O)
========================= */
export async function updateSnapToken(
  orderId: string,
  snapToken: string
) {
  const sheets = getClient();
  const row = await findRowByOrderId(orderId);
  if (!row) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `pending_orders!O${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[snapToken]],
    },
  });
}

/* =========================
   UPDATE PAYMENT STATUS
   (L M N P SAJA)
========================= */
export async function updatePaymentStatus(
  orderId: string,
  data: {
    payment_method?: string;
    payment_status?: string;
    midtrans_order_id?: string;
    
  }
) {
  const sheets = getClient();
  const row = await findRowByOrderId(orderId);
  if (!row) return;

  if (data.payment_method !== undefined) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: `pending_orders!L${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[data.payment_method]] },
    });
  }

  if (data.payment_status !== undefined) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: `pending_orders!M${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[data.payment_status]] },
    });
  }

  if (data.midtrans_order_id !== undefined) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: `pending_orders!N${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[data.midtrans_order_id]] },
    });
  }

  
}


/* =========================
   GET ORDER DATA
========================= */
export async function getOrderAffiliateAndTotal(orderId: string): Promise<{
  affiliate_code: string;
  total: number;
} | null> {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A2:P",
  });

  const rows = res.data.values ?? [];
  const row = rows.find(r => r[0] === orderId);
  if (!row) return null;

  return {
    total: Number(row[10]),      // K = total
    affiliate_code: row[15] ?? "" // P = affiliate_code
  };
}

/* =========================
   GET AFFILIATE PERCENT
========================= */
export async function getAffiliatePercent(code: string): Promise<number | null> {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "affiliates!A2:E",
  });

  const rows = res.data.values ?? [];
  const row = rows.find(r => r[0] === code && r[4] === "yes");
  if (!row) return null;

  return Number(row[3]);
}

/* =========================
   CHECK COMMISSION EXISTS
========================= */
export async function affiliateCommissionExists(orderId: string): Promise<boolean> {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "affiliate_commissions!A2:A",
  });

  const rows = res.data.values ?? [];
  return rows.some(r => r[0] === orderId);
}

/* =========================
   APPEND COMMISSION
========================= */
export async function appendAffiliateCommission(row: (string | number)[]) {
  const sheets = getClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "affiliate_commissions!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

/* =========================
   GET ORDER AFFILIATE DATA
========================= */
export async function getAffiliateFromOrder(orderId: string): Promise<{
  affiliate_code: string | null;
  total: number;
} | null> {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A2:P",
  });

  const rows = res.data.values ?? [];

  const row = rows.find((r) => r[0] === orderId);
  if (!row) return null;

  return {
    total: Number(row[10]),        // K = total
    affiliate_code: row[15] || null, // P = affiliate_code
  };
}

/* =========================
   GET EARNED COMMISSIONS
========================= */
export async function getEarnedCommissionsByAffiliate(
  affiliateCode: string
) {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "affiliate_commissions!A2:G",
  });

  const rows = res.data.values ?? [];

  return rows.filter(
    (r) => r[1] === affiliateCode && r[4] === "earned"
  );
}

/* =========================
   MARK COMMISSION PAID
========================= */
export async function markAffiliateCommissionPaid(orderId: string) {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "affiliate_commissions!A2:A",
  });

  const rows = res.data.values ?? [];
  const idx = rows.findIndex((r) => r[0] === orderId);
  if (idx === -1) return;

  const rowNumber = idx + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `affiliate_commissions!E${rowNumber}:G${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [["paid", new Date().toISOString()]],
    },
  });
}

/* =========================
   AFFILIATE SUMMARY
========================= */
export async function getAffiliateSummary(affiliateCode: string) {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "affiliate_commissions!A2:G",
  });

  const rows = res.data.values ?? [];

  let totalEarned = 0;
  let totalPaid = 0;
  let earnedCount = 0;

  for (const r of rows) {
    if (r[1] !== affiliateCode) continue;

    const commission = Number(r[3]) || 0;
    const status = r[4];

    if (status === "earned") {
      totalEarned += commission;
      earnedCount++;
    }

    if (status === "paid") {
      totalPaid += commission;
    }
  }

  return {
    affiliate_code: affiliateCode,
    total_earned: totalEarned + totalPaid,
    total_paid: totalPaid,
    available_balance: totalEarned,
    total_orders: earnedCount,
  };
}

/* =========================
   AFFILIATE COMMISSIONS LIST
========================= */
export async function getAffiliateCommissions(affiliateCode: string) {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "affiliate_commissions!A2:G",
  });

  const rows = res.data.values ?? [];

  return rows
    .filter((r) => r[1] === affiliateCode)
    .map((r) => ({
      order_id: r[0],
      order_total: Number(r[2]),
      commission: Number(r[3]),
      status: r[4],
      created_at: r[5],
      paid_at: r[6] ?? null,
    }));
}

/* =========================
   GET PENDING ORDERS (ADMIN)
========================= */
export async function getPendingOrders() {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A2:P",
  });

  const rows = res.data.values ?? [];

  return rows
    .filter((row) => row[12] !== "paid") // kolom M = payment_status
    .map((row) => ({
      order_id: row[0],
      created_at: row[1],
      name: row[2],
      phone: row[3],
      total: Number(row[10]) || 0,
      payment_status: row[12],
      affiliate_code: row[15] || null,
    }));
}

export type AdminOrderRow = {
  order_id: string;
  created_at: string;
  name: string;
  phone: string;
  total: number;
  payment_method: string;
  payment_status: "pending" | "paid" | "expired" | "failed";
  affiliate_code?: string | null;
};

export async function getOrdersForAdmin(
  status?: "pending" | "paid"
): Promise<AdminOrderRow[]> {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A2:P",
  });

  const rows = res.data.values ?? [];

  return rows
    .map((r) => ({
      order_id: r[0],
      created_at: r[1],
      name: r[2],
      phone: r[3],
      total: Number(r[10]) || 0,
      payment_method: r[11],
      payment_status: r[12],
      affiliate_code: r[15] || null,
    }))
    .filter((r) =>
      status ? r.payment_status === status : true
    );
}

/* =========================
   GET ORDER BY ID (ADMIN)
========================= */
export async function getOrderById(orderId: string) {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A2:P",
  });

  const rows = res.data.values ?? [];
  const row = rows.find((r) => r[0] === orderId);

  if (!row) return null;

  return {
    order_id: row[0],
    created_at: row[1],
    customer: {
      name: row[2],
      phone: row[3],
      address: row[4],
      city: row[5],
    },
    items: row[6] ? JSON.parse(row[6]) : [],
    subtotal: Number(row[7]) || 0,
    ongkir: Number(row[8]) || 0,
    shipping_service: row[9],
    total: Number(row[10]) || 0,
    payment_method: row[11] || "",
    payment_status: row[12] || "pending",
    midtrans_order_id: row[13] || "",
    snap_token: row[14] || "",
    affiliate_code: row[15] || null,
  };
}
