# Customer Accounts & Order History — Setup

Both the website and the mobile app save orders to, and read accounts from,
one shared [Vercel Postgres](https://vercel.com/storage/postgres) database.
Phone verification is sent via [Twilio](https://twilio.com). Neither can be
created from here — follow these steps once to wire it up.

## 1. Create the Vercel Postgres database

1. In the [Vercel dashboard](https://vercel.com/dashboard), open this
   project → **Storage** tab → **Create Database** → **Postgres**.
2. Connect it to this project. Vercel automatically adds a `POSTGRES_URL`
   environment variable (and a few related ones) to the project — no manual
   copying needed.
3. Open the database's **Query** tab and run the contents of `db/schema.sql`
   from this repo. This creates the `orders` and `otp_codes` tables.

## 2. Set up Twilio for SMS codes

Customers verify their account by entering a 6-digit code sent by SMS.

1. Sign up at [twilio.com](https://twilio.com) and create a **Messaging
   Service** (or buy a phone number capable of sending SMS) — either works as
   long as you have an Account SID, an Auth Token, and a Messaging Service SID.
2. Twilio charges per SMS sent (a few cents each) — this is an ongoing cost
   as customers sign in.

## 3. Generate a session secret

Sessions are signed locally (no third-party auth provider), using a secret
only you know. Generate one random value, e.g.:

```
openssl rand -hex 32
```

## 4. Set environment variables

**Website (Vercel → Project Settings → Environment Variables):**

| Variable | Value |
|---|---|
| `POSTGRES_URL` | added automatically when you connect the Postgres database (step 1) |
| `AUTH_SECRET` | the random value generated in step 3 |
| `TWILIO_ACCOUNT_SID` | from your Twilio console |
| `TWILIO_AUTH_TOKEN` | from your Twilio console |
| `TWILIO_MESSAGING_SERVICE_SID` | from your Twilio console |

**Mobile app:** nothing to set. It calls `muunad.com`'s API for everything
(auth, order history, order saving), so it has no database or Twilio
credentials of its own.

## How it works once configured

- A customer's phone number is saved on every paid order automatically — no
  account needed to check out.
- Visiting **Account** (website nav, or the Account tab on mobile) and
  verifying that same phone number via a Twilio SMS code shows all past
  orders placed with it, on either platform.
- Until the env vars above are set, sending/verifying a code fails with a
  friendly "not configured" message and checkout still works normally —
  order history saving fails silently in the background.
