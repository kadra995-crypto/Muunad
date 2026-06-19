import { NextRequest, NextResponse } from "next/server";
import { normalizeSomaliPhone } from "@/lib/phone";

const WAAFI_API_URL = "https://api.waafipay.net/asm";

interface ChargeRequestBody {
  phone: string;
  amount: number;
  orderNumber: string;
  customerName: string;
}

export async function POST(req: NextRequest) {
  const merchantUid = process.env.WAAFI_MERCHANT_UID;
  const apiUserId = process.env.WAAFI_API_USER_ID;
  const apiKey = process.env.WAAFI_API_KEY;

  if (!merchantUid || !apiUserId || !apiKey) {
    return NextResponse.json(
      { success: false, message: "WAAFI is not configured on the server." },
      { status: 500 }
    );
  }

  const body = (await req.json()) as ChargeRequestBody;
  const { phone, amount, orderNumber, customerName } = body;

  if (!phone || !amount || !orderNumber) {
    return NextResponse.json(
      { success: false, message: "Missing required payment fields." },
      { status: 400 }
    );
  }

  const normalizedPhone = normalizeSomaliPhone(phone);

  const payload = {
    schemaVersion: "1.0",
    requestId: orderNumber,
    timestamp: new Date().toISOString(),
    channelName: "WEB",
    serviceName: "API_PURCHASE",
    serviceParams: {
      merchantUid,
      apiUserId,
      apiKey,
      paymentMethod: "MWALLET_ACCOUNT",
      payerInfo: { accountNo: normalizedPhone },
      transactionInfo: {
        referenceId: orderNumber,
        invoiceId: orderNumber,
        amount: amount.toFixed(2),
        currency: "USD",
        description: `MUUNAD order ${orderNumber} for ${customerName}`,
      },
    },
  };

  try {
    const res = await fetch(WAAFI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const isSuccess = data?.responseCode === "2001" || data?.params?.state === "APPROVED";

    if (!isSuccess) {
      return NextResponse.json(
        {
          success: false,
          message: data?.responseMsg || "Payment was not approved. Please try again.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: data?.params?.transactionId || data?.params?.referenceId,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the payment provider. Please try again." },
      { status: 502 }
    );
  }
}
