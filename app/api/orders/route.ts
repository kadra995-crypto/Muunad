import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { isDbConfigured } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";

interface OrderItemInput {
  productId: number;
  name: string;
  brand: string;
  quantity: number;
  price: number;
}

interface CreateOrderBody {
  orderNumber: string;
  phone: string;
  customerName: string;
  address: string;
  items: OrderItemInput[];
  total: number;
  paymentMethod: "evc" | "sahal" | "zaad";
  transactionId?: string;
}

export async function POST(req: NextRequest) {
  // Saving order history is best-effort: a missing/misconfigured database
  // must never block a customer's already-paid checkout.
  if (!isDbConfigured) {
    return NextResponse.json({ success: false, message: "Order history is not configured." }, { status: 200 });
  }

  const body = (await req.json()) as CreateOrderBody;
  const { orderNumber, phone, customerName, address, items, total, paymentMethod, transactionId } = body;

  if (!orderNumber || !phone || !customerName || !address || !items?.length || !total || !paymentMethod) {
    return NextResponse.json({ success: false, message: "Missing required order fields." }, { status: 400 });
  }

  try {
    await sql`
      insert into orders (order_number, customer_phone, customer_name, address, items, total, payment_method, transaction_id)
      values (
        ${orderNumber},
        ${normalizePhone(phone)},
        ${customerName},
        ${address},
        ${JSON.stringify(items)}::jsonb,
        ${total},
        ${paymentMethod},
        ${transactionId || null}
      )
    `;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Failed to save order." },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: true });
}
