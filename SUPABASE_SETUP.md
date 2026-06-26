# Customer Accounts & Order History — Setup

Both the website and the mobile app save orders to and read accounts from one
shared [Supabase](https://supabase.com) project. Supabase can't be created
from here — follow these steps once to wire it up.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (free tier is enough to start).
2. Once created, open **SQL Editor** and run the contents of `supabase/orders.sql`
   from this repo. This creates the `orders` table and its row-level security policy.

## 2. Enable phone (OTP) login

Customers verify their account by SMS code, which requires a Twilio account.

1. Sign up at [twilio.com](https://twilio.com) and create a Messaging Service
   (or buy a phone number capable of sending SMS).
2. In the Supabase dashboard: **Authentication → Providers → Phone** → enable it,
   choose **Twilio** as the provider, and enter your Twilio Account SID, Auth
   Token, and Message Service SID.
3. Twilio charges per SMS sent (a few cents each) — this is an ongoing cost as
   customers sign in.

## 3. Collect your API keys

In the Supabase dashboard: **Project Settings → API**, copy:

- **Project URL**
- **anon public key**
- **service_role key** (keep this secret — never put it in client-side code)

## 4. Set environment variables

**Website (Vercel → Project Settings → Environment Variables):**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |

**Mobile app** (`mobile/.env`, or as EAS secrets for production builds):

| Variable | Value |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

The service_role key is server-only and is never used by the mobile app.

## How it works once configured

- A customer's phone number is saved on every paid order automatically — no
  account needed to check out.
- Visiting **Account** (website nav, or the Account tab on mobile) and verifying
  that same phone number via OTP shows all past orders placed with it, on
  either platform.
- Until these env vars are set, the Account page/tab shows a friendly
  "not set up yet" message and checkout still works normally — order history
  saving fails silently in the background.
