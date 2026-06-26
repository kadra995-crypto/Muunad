import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { sql } from "@vercel/postgres";
import { isDbConfigured } from "@/lib/db";
import { createSessionToken, isAuthConfigured } from "@/lib/session";
import { normalizePhone } from "@/lib/phone";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  if (!isDbConfigured || !isAuthConfigured) {
    return NextResponse.json({ success: false, message: "Account login is not configured." }, { status: 200 });
  }

  const { phone, code } = await req.json();
  if (!phone || !code) {
    return NextResponse.json({ success: false, message: "Please enter the code we sent you." }, { status: 400 });
  }

  const normalized = normalizePhone(phone);
  const { rows } = await sql`select code_hash, expires_at, attempts from otp_codes where phone = ${normalized}`;
  const row = rows[0];

  if (!row || new Date(row.expires_at as string) < new Date()) {
    return NextResponse.json(
      { success: false, message: "That code has expired. Please request a new one." },
      { status: 200 }
    );
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please request a new code." },
      { status: 200 }
    );
  }

  const codeHash = createHash("sha256").update(String(code).trim()).digest("hex");
  const expectedBuf = Buffer.from(row.code_hash as string);
  const actualBuf = Buffer.from(codeHash);
  const matches = expectedBuf.length === actualBuf.length && timingSafeEqual(expectedBuf, actualBuf);

  if (!matches) {
    await sql`update otp_codes set attempts = attempts + 1 where phone = ${normalized}`;
    return NextResponse.json({ success: false, message: "Incorrect code. Please try again." }, { status: 200 });
  }

  await sql`delete from otp_codes where phone = ${normalized}`;

  return NextResponse.json({ success: true, token: createSessionToken(normalized), phone: normalized });
}
