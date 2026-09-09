# Pett TestFlight signups

The Pett CTA expands into an email field. Submitting stores the normalized email and signup timestamp in Neon PostgreSQL. The success state appears only after persistence. This is an invitation waitlist, not automatic Apple TestFlight enrollment. No email is sent by this implementation.

## Database

Neon project: `pett-testflight-signups` (`restless-tree-36881741`).
- `production`: empty and migrated, ready for real signups.
- `development`: isolated branch used by `.env.local` and local preview.
- Database: `pett`.
- Table: `testflight_signups` (`email`, `created_at`, `consent_version`).
- `signup_limits` contains hourly HMAC hashes, counts, and expiry times, never raw IP addresses. Expired buckets are removed on subsequent signups.

View signups privately in the Neon SQL Editor on the production branch:

```sql
SELECT email, created_at FROM testflight_signups ORDER BY created_at DESC;
```

There is no public endpoint for retrieving emails.

## Deploy on Vercel

The workspace is linked to Vercel project `albovsky-com` in `glibs-projects-09812790`. These **server-only** environment variables are configured as Production secrets under Project Settings → Environment Variables:

- `DATABASE_URL`: pooled runtime URL.
- `DATABASE_URL_UNPOOLED`: direct URL for migrations (not required by the request handler).
- `SIGNUP_RATE_LIMIT_SECRET`: random secret for hashing rate-limit keys.

The private, git-ignored `.env.vercel.production` contains the production values. Use them for **Production only**. For Preview/Development use the separate branch values in `.env.local`. Do not use `NEXT_PUBLIC_` prefixes or commit these files. `.vercelignore` excludes environment files from source uploads. Redeploy after changing environment variables.

Use the Node.js runtime with Vercel Fluid compute. The API uses a small PostgreSQL pool with Vercel's `attachDatabasePool` lifecycle integration. The database lives outside the deployment filesystem.

## Development and schema changes

```sh
npm run db:generate
npm run db:migrate
npm run test:waitlist
```

Migration files are checked into `drizzle/`. Migrate development first; apply the same reviewed migration to production with its environment values. Never run the integration checks against production.

With local preview running on port 3010 and `.env.local` pointing to the isolated development branch:

```sh
WAITLIST_TEST_DATABASE=true node scripts/test-waitlist.mjs
```

This creates and removes its own generated test email and local rate-limit bucket. It verifies invalid input, foreign origins, honeypot, oversized bodies, persistence, duplicate handling, and rate limiting. Keep the development branch free of real subscriber data.

The endpoint accepts only same-origin JSON POSTs, caps input at 4 KB, validates addresses, uses parameterized queries, and limits submissions to ten per IP per hour. Duplicate signups return the same success response. Database failures return a retryable error and never a false success.
