import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseServer";
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
  // Saving order history is best-effort: a missing/misconfigured Supabase
  // project must never block a customer's already-paid checkout.
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ success: false, message: "Order history is not configured." }, { status: 200 });
  }

  const body = (await req.json()) as CreateOrderBody;
  const { orderNumber, phone, customerName, address, items, total, paymentMethod, transactionId } = body;

  if (!orderNumber || !phone || !customerName || !address || !items?.length || !total || !paymentMethod) {
    return NextResponse.json({ success: false, message: "Missing required order fields." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("orders").insert({
    order_number: orderNumber,
    customer_phone: normalizePhone(phone),
    customer_name: customerName,
    address,
    items,
    total,
    payment_method: paymentMethod,
    transaction_id: transactionId || null,
  });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 200 });
  }

  return NextResponse.json({ success: true });
}
