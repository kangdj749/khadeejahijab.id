import { google } from "googleapis";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function appendSheet(
  sheetName: string,
  row: (string | number)[]
): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

export async function updatePaymentStatus(
  orderId: string,
  payload: {
    payment_status: string;
    payment_method?: string;
    midtrans_order_id?: string;
  }
) {
  /* 1️⃣ Ambil semua order_id */
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "pending_orders!A2:A",
  });

  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r) => r[0] === orderId);

  if (rowIndex === -1) {
    console.warn("Order ID not found in sheet:", orderId);
    return;
  }

  const sheetRowNumber = rowIndex + 2; // karena mulai A2

  /* 2️⃣ Update kolom status (M, N, L) */
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `pending_orders!L${sheetRowNumber}:N${sheetRowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        payload.payment_method ?? "",
        payload.payment_status,
        payload.midtrans_order_id ?? "",
      ]],
    },
  });
}

