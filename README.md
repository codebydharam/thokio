# ThokIO Marketplace

Production-oriented Flipkart/Amazon-style retail + wholesale marketplace for Indian vendors and buyers. Built with Next.js 15 App Router, TypeScript, Tailwind, shadcn-style primitives, Supabase Auth/Postgres/Storage/Realtime, React Hook Form + Zod, Zustand, and provider-ready payments.

## Quick start

Requirements: Node.js 20+, npm, and optionally a Supabase project.

```powershell
cd F:\ThokIO
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Run one dev server at a time. Before a production build, stop the dev process with `Ctrl+C`:

```powershell
npm run build
npm start
```

## Deployment

This is a server-rendered Next.js application. It uses middleware and route
handlers for catalog search, authentication, orders, payments, shipping, and
webhooks. Deploy it to a host that runs Next.js/Node.js (for example Vercel,
Render, or a self-hosted Node server).

Do not configure `output: 'export'` or deploy the generated `out` folder to
GitHub Pages. GitHub Pages only serves static files and cannot run `/api/*`
routes or middleware. GitHub can still be used to store the repository and to
trigger deployment to a server-capable host.

## Route map

| Route | Purpose |
| --- | --- |
| `/` | Marketplace home: search, offers, categories, trending products |
| `/products` | Search, filters, supplier/source labels, product grid |
| `/products/[id]` | Product detail, HSN/GST/MOQ, supplier, cart, quote request |
| `/cart` | Persistent browser cart |
| `/checkout` | Address, shipping method, payment handoff, order request |
| `/auth/login` | Email/password, Google OAuth, password reset entry |
| `/auth/signup` | Email verification signup |
| `/account` | Authenticated customer account center |
| `/buyer/dashboard` | Customer order portal |
| `/vendor/dashboard` | Vendor sales, catalog, inventory, storefront checklist |
| `/admin` | Marketplace overview |
| `/admin/leads` | Lead automation operations |
| `/admin/orders` | Fulfillment Kanban |

## Supabase setup

Run migrations in this order from the Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_product_catalog_fields.sql`
3. `supabase/migrations/003_marketplace_schema.sql`
4. `supabase/migrations/004_auth_and_seed.sql`

These migrations provide profiles, roles, categories, brands, products, variants, inventory, vendor ownership, multi-vendor order items, addresses, carts, wishlists, coupons, orders, reviews, returns, notifications, audit logs, indexes, RLS, realtime tables, Storage buckets, and an auth profile trigger.

In Supabase Auth, enable Email and Google providers. Set the Google callback URL to `https://YOUR_DOMAIN.com/auth/callback`; locally use `http://localhost:3000/auth/callback`.

## Environment variables

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_SITE_URL`: canonical URL for metadata, sitemap, and robots.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: browser/server auth client.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only admin and integration tasks.
- Razorpay, Stripe, PayPal, Shiprocket, WhatsApp, IndiaMART, and worker secrets are server-only.

Never expose service-role, payment, logistics, or webhook secrets to client components.

## Database-driven catalog

The storefront reads published rows from Supabase through `lib/catalog-server.ts`. Products need `status = 'PUBLISHED'` and `is_published = true`. Product images belong in Supabase Storage or a CDN, with URLs stored in `products.images`.

Migration `002` adds slug, cluster, MOQ, retail/wholesale pricing, GST, lead time, catalog source, rating, and image fields. Migration `003` adds variants and inventory. `lib/catalog.ts` is only a no-credentials local development fallback.

## API boundaries

- `POST /api/orders`: authenticated, Zod-validated order creation.
- `GET /api/catalog/search`: database search with optional local Ollama matching and keyword fallback.
- `POST /api/webhooks/indiamart`: idempotent lead ingestion.
- `POST /api/webhooks/razorpay`: verified payment webhook.
- `POST /api/shiprocket/create-order`: server-side shipment creation.

Payment adapters should create provider orders server-side, persist transaction IDs, and verify webhooks before changing order state. The checkout UI is provider-neutral until merchant credentials and policies are configured.

## Security and performance

- Middleware protects `/account`, `/cart`, `/checkout`, `/vendor`, and `/admin` from unauthenticated access.
- Zod validates order payloads at the API boundary.
- RLS limits customer data to the owning user and vendor/staff data to the correct owner/role.
- Storage policies separate public reads from vendor/staff uploads.
- Dynamic catalog routes avoid shipping the full catalog to the client.
- Add an edge rate limiter such as Upstash Redis for public search, auth, and webhook endpoints in production.
- Configure `next/image` remote patterns for the production CDN before deployment.

## Verification

```powershell
npx tsc --noEmit
npm run build
```
