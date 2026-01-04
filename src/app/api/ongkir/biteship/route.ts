import { NextResponse } from "next/server";

type BiteshipPricing = {
  courier_name: string;
  courier_service_name: string;
  price: number;
  duration: string;
};

type BiteshipItem = {
  name: string;
  price: number;
  qty: number;
  weight: number;
};

type BiteshipRequestBody = {
  destinationPostalCode: string;
  couriers: string[];
  items: BiteshipItem[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BiteshipRequestBody;

    if (
      !body.destinationPostalCode ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json({ services: [] });
    }

    const res = await fetch(
      "https://api.biteship.com/v1/rates/couriers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin_postal_code: "40115",
          destination_postal_code: body.destinationPostalCode,
          couriers: body.couriers.join(","),

          // ✅ TIDAK ADA any LAGI
          items: body.items.map((i) => ({
            name: i.name,
            price: i.price,
            weight: Math.max(i.weight, 1), // 🔥 WAJIB > 0
            quantity: i.qty,
          })),
        }),
      }
    );

    const json = await res.json();

    console.log("📦 BITESHIP RAW:", JSON.stringify(json, null, 2));

    // 🔒 GUARD – INI KUNCI NYA
    if (!Array.isArray(json.pricing)) {
      console.error("❌ BITESHIP INVALID RESPONSE");
      return NextResponse.json({ services: [] });
    }

    const services = json.pricing.map((p: BiteshipPricing) => ({
      courier: p.courier_name,
      service: p.courier_service_name,
      cost: p.price,
      etd: p.duration,
    }));

    return NextResponse.json({ services });
  } catch (err: unknown) {
    console.error("❌ BITESHIP ERROR", err);
    return NextResponse.json({ services: [] }, { status: 500 });
  }
}
