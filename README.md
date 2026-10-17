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

## Driving lesson enquiries

The contact form validates in the browser and prepares an encoded WhatsApp message for the visitor to review and send. The secure `POST /api/enquiries` integration point remains available for a configured receiving service. No database schema, database connection configuration, or existing enquiry storage was found in this workspace. The Prisma and PostgreSQL packages are installed, but they are not configured for persistence here.

To connect phone enquiries to storage or another trusted receiver:

1. Copy `.env.example` to `.env.local`.
2. Set `ENQUIRY_WEBHOOK_URL` to an HTTPS endpoint you control and `ENQUIRY_WEBHOOK_SECRET` to a random secret with at least 32 characters.
3. Configure that endpoint to require the secret as a Bearer token, honor the `Idempotency-Key` header, validate and persist or route the received JSON, and return a 2xx response only when it has accepted the enquiry.
4. Restart the Next.js server after changing environment variables.

The receiver gets `fullName`, normalized `mobileNumber`, `enquiryType`, `contactMethod` (always `WhatsApp`), optional `message`, `consent`, and `receivedAt`. API submissions are not reported as saved until the configured receiver accepts them. The website form uses the direct WhatsApp flow: it prepares a message, and the visitor must open WhatsApp and press Send.

The API also validates the same enquiry fields server-side, checks same-origin requests, limits request size, uses a honeypot, blocks repeated identical enquiries for ten minutes per process, and rate-limits by client address in process memory. The server fixes the contact method to WhatsApp and rejects the removed branch and pick-up preference fields. For a multi-instance production deployment, add a shared rate limiter and deduplication store at the hosting edge or in a shared store.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
