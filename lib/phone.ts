// Somali phone numbers are commonly entered with or without the +252 country
// code and with varying spacing. Both Supabase auth and the orders table need
// a single canonical digit-only form so a checkout phone always matches the
// phone a customer later verifies via OTP.
const SOMALI_COUNTRY_CODE = "252";

export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = SOMALI_COUNTRY_CODE + digits.slice(1);
  } else if (!digits.startsWith(SOMALI_COUNTRY_CODE)) {
    digits = SOMALI_COUNTRY_CODE + digits;
  }
  return digits;
}

export function toE164(input: string): string {
  return `+${normalizePhone(input)}`;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input).length >= 11;
}
