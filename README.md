# KisanJunction

A mobile-friendly farm marketplace demo built with Next.js App Router, Tailwind and Supabase.

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in its SQL Editor. The schema targets a fresh database; back up and migrate any existing tables separately.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` to your plain project URL (no Markdown brackets) and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your project's **anon/public** key from Supabase project settings. The service role key is not an anon key and must never be used in client environment variables.
3. Run `npm install` and `npm run dev`. Open http://localhost:3000.
4. Deploy to Vercel and add the same two public environment variables in project settings, then redeploy. Run the SQL on the target Supabase project first.

The farmer form creates a user if needed, a listing and a pending delivery in one database transaction. Listings shown under My listings are matched to the phone last used on that browser. Buyers can see contact details and simulate a completed trade. Drivers can claim pending routes; because there is no login, the demo does not assign a driver identity and drop-off is to be coordinated separately. Refresh a page to fetch the latest data.

## Security and scope

**This is a hackathon demo, not safe for production or real personal information.** The supplied SQL deliberately allows anonymous read access to users (including phone numbers), listings and deliveries and anonymous execution of mutation functions. Anyone with the public key can impersonate a farmer by phone, create listings, mark any listing sold or accept any route. The UI does not provide authentication, authorization, verification, rate limiting, real payments, or delivery tracking. Before a public launch, implement Supabase Auth (such as verified phone OTP), associate records with authenticated identities, restrict RLS and function privileges to the relevant owner/participants, protect contact details, add abuse controls and validate the complete trade workflow. Do not expose a service role key in the browser.

The existing `api/webhook.ts` is a separate legacy WhatsApp webhook and is not integrated into this application.
