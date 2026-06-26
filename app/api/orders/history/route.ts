import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { isDbConfigured } from "@/lib/db";
import { verifySessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  if (!isDbConfigured) {
    return NextResponse.json({ success: false, message: "Order history is not configured." }, { status: 200 });
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const phone = token ? verifySessionToken(token) : null;

  if (!phone) {
    return NextResponse.json({ success: false, message: "Please sign in again." }, { status: 401 });
  }

  const { rows } = await sql`
    select order_number, customer_name, address, items, total, payment_method, transaction_id, status, created_at
    from orders
    where customer_phone = ${phone}
    order by created_at desc
  `;

  const orders = rows.map((row) => ({ ...row, total: Number(row.total) }));

  return NextResponse.json({ success: true, orders });
}
