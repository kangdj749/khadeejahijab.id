
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text(); // karena kita kirim form-urlencoded
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbzkn8WfSVC5gudhAT6so9TL_u-tLwcsS_IwHuvFQDC1LGvuyJSdcGTcSlq-wZ6jYss/exec";

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: bodyText, // ✅ pastikan semua data (termasuk totalBerat) ikut dikirim  
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: true, message: "Data terkirim, tapi bukan JSON." };
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal kirim ke Apps Script" },
      { status: 500 }
    );
  }
}
