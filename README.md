This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Production Integration Order

Follow this exact order to avoid booking-flow conflicts:

### 1) Real Supabase First

1. Create or reuse your Supabase project.
2. Run one SQL file in Supabase SQL editor:
	- Fresh setup: `supabase/migrations/20260525_private_cinema_bookings.sql`
	- Existing earlier table: `supabase/migrations/20260525_private_cinema_bookings_patch.sql`
3. Set environment values:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `SUPABASE_SERVICE_ROLE_KEY`
4. Verify slot availability works:
	- Open `/book`
	- Choose date and confirm unavailable slots still show as unavailable (not hidden).

### 2) Paystack Test Next

1. Set environment values:
	- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
	- `PAYSTACK_SECRET_KEY`
2. In Paystack dashboard, set webhook URL to:
	- `https://<your-domain>/api/paystack/webhook`
3. Run a test booking and verify:
	- Success redirects to `/book/success`
	- Failed/closed payment redirects to `/book/failed`
	- Paid booking locks slot in Supabase and UI.

### 3) Admin Auth After That

1. Set environment values:
	- `ADMIN_BASIC_USERNAME`
	- `ADMIN_BASIC_PASSWORD`
2. Visit `/admin/bookings` and confirm browser basic auth prompt appears.

### 4) Resend Last

1. Set environment values:
	- `RESEND_API_KEY`
	- `BOOKING_FROM_EMAIL`
2. Complete a successful test booking and confirm email delivery.

### Debug Note: Booking Date Availability

Booking APIs now enforce calendar-valid ISO dates (not only regex shape), plus Africa/Lagos "past date" checks, to reduce date mismatch issues.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## schema history and deployment record
use main migration for fresh setup

use patch only for older table versions
