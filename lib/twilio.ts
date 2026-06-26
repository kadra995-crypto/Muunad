const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

export const isTwilioConfigured = Boolean(accountSid && authToken && messagingServiceSid);

export async function sendSms(to: string, body: string): Promise<void> {
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const params = new URLSearchParams({ To: to, MessagingServiceSid: messagingServiceSid!, Body: body });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio send failed: ${text}`);
  }
}
