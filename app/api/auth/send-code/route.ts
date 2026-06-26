import { NextRequest, NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { sql } from "@vercel/postgres";
import { isDbConfigured } from "@/lib/db";
import { isTwilioConfigured, sendSms } from "@/lib/twilio";
import { normalizePhone, toE164, isValidPhone } from "@/lib/phone";

const CODE_TTL_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  // Account login is best-effort to configure: a missing database or SMS
  // provider must never crash the page, just show "not set up yet".
  if (!isDbConfigured || !isTwilioConfigured) {
    return NextResponse.json({ success: false, message: "Account login is not configured." }, { status: 200 });
  }

  const { phone } = await req.json();
  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json({ success: false, message: "Please enter a valid phone number." }, { status: 400 });
  }

  const normalized = normalizePhone(phone);
  const code = randomInt(100000, 1000000).toString();
  const codeHash = createHash("sha256").update(code).digest("hex");
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  await sql`
    insert into otp_codes (phone, code_hash, expires_at, attempts)
    values (${normalized}, ${codeHash}, ${expiresAt}, 0)
    on conflict (phone) do update set code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0
  `;

  try {
    await sendSms(toE164(phone), `Your Muunad verification code is ${code}. It expires in 10 minutes.`);
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not send the verification code. Please try again." },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: true });
}
