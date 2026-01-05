import { google } from "googleapis";

/* ============================
   CREATE AUTH PER REQUEST
============================ */
function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/* ============================
   APPEND SHEET (ANTI CRASH)
============================ */
export async function appendSheet(
  sheetName: string,
  row: (string | number)[]
): Promise<void> {
  try {
    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
  } catch (err) {
    // 🔥 PENTING: JANGAN THROW
    console.error("❌ GOOGLE SHEET APPEND ERROR:", err);
  }
}

/* ============================
   UPDATE PAYMENT STATUS
============================ */
export async function updatePaymentStatus(
  orderId: string,
  payload: {
    payment_status: string;
    payment_method?: string;
    midtrans_order_id?: string;
  }
) {
  try {
    const sheets = getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "pending_orders!A2:A",
    });

    const rows = res.data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === orderId);

    if (rowIndex === -1) {
      console.warn("Order ID not found:", orderId);
      return;
    }

    const sheetRowNumber = rowIndex + 2;

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
  } catch (err) {
    console.error("❌ GOOGLE SHEET UPDATE ERROR:", err);
  }
}

