// Normalizes a Somali mobile number to the 252XXXXXXXXX format WaafiPay expects,
// regardless of how the customer typed it (+252, 00252, a local 0-prefixed
// trunk number like 061..., or just the 9-digit operator number).
export function normalizeSomaliPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!digits.startsWith("252")) {
    digits = `252${digits}`;
  }

  return digits;
}
