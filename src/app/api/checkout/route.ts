import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export const dynamic = "force-dynamic";

interface CheckoutItemInput {
  productId: string;
  finish: string;
  quantity: number;
}

interface CheckoutPayload {
  customerName?: string;
  email?: string;
  city?: string;
  items?: CheckoutItemInput[];
}

export async function POST(request: NextRequest) {
  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed checkout payload." },
      { status: 400 }
    );
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Your bag is empty." },
      { status: 400 }
    );
  }

  const lineItems = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      const qty = Math.max(1, Math.min(10, Math.floor(item.quantity || 1)));
      return {
        sku: product.sku,
        name: product.name,
        finish: item.finish || product.defaultFinish,
        quantity: qty,
        unitPrice: product.price,
        lineTotal: product.price * qty,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (lineItems.length === 0) {
    return NextResponse.json(
      { ok: false, message: "No valid catalog items in checkout request." },
      { status: 400 }
    );
  }

  await new Promise((r) => setTimeout(r, 320));

  const subtotal = lineItems.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = subtotal >= 600 ? 0 : 28;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const orderSeq = Math.floor(1000 + Math.random() * 8999);
  const trackingCode = `KN-EUR-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}-${orderSeq}`;

  return NextResponse.json({
    ok: true,
    receipt: {
      orderId: `AK-2026-${orderSeq}`,
      trackingNumber: trackingCode,
      carrier: "DHL Express Architectural Freight",
      estimatedDelivery: "3–5 Business Days",
      customerName: body.customerName?.trim() || "Gallery Collector",
      email: body.email?.trim() || "collector@atelierkineta.design",
      city: body.city?.trim() || "Antwerp / Zurich",
      issuedAt: new Date().toISOString(),
      lineItems,
      subtotal,
      shipping,
      tax,
      total,
    },
  });
}
