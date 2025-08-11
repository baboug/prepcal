## PrepCal

AI-powered meal planning SaaS. PrepCal automates weekly meal planning based on your goals and preferences, with real‑time nutrition, editable plans, and Pro features via Polar billing.

### Core features

- Personalized nutrition profile and onboarding
- AI meal plan generation from your recipe database and targets
- Interactive edits: reordering, serving-size multipliers, add/remove meals
- Shopping list and meal prep plan generation (editable)
- Dashboard with charts and usage overview
- Freemium gating with Polar Pro upgrades

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- tRPC + TanStack Query
- Drizzle ORM (PostgreSQL; Neon compatible)
- Better Auth (+ Polar plugin) with Google/GitHub OAuth
- TailwindCSS + shadcn/ui
- AI via `@ai-sdk/google` (Gemini)

## Requirements

- Node.js 20+
- pnpm
- PostgreSQL database (local or hosted, e.g. Neon)
- Resend account for transactional emails
- OAuth apps for Google and GitHub (for social sign‑in)
- Polar account (Sandbox OK) for billing
- Google Generative AI API key for Gemini

## Quick start

```bash
corepack enable pnpm # ensures the right pnpm version
pnpm install --frozen-lockfile
cp .env.example .env.local # if present; otherwise create .env.local (see below)
pnpm db:push
pnpm dev
```

Visit `http://localhost:3000`.

## Environment variables

Create `.env.local` at the repo root. Required variables are validated in `src/lib/env.ts`.

### App and Database

- `NEXT_PUBLIC_APP_URL` = `http://localhost:3000` (local). In production, set to your HTTPS domain, e.g. `https://app.yourdomain.com`.
- `DATABASE_URL` = Postgres connection string (Neon works). Example: `postgres://user:pass@host/db?sslmode=require`
- For serverless Postgres (e.g. Neon), ensure SSL remains enabled and consider a connection pool if needed.

### Auth (Better Auth)

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### Email (Resend)

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` = verified sender, e.g. `no-reply@yourdomain.com`

### Billing (Polar)

- `POLAR_ACCESS_TOKEN`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_SERVER` = `sandbox` | `production` (use `sandbox` locally)
- `POLAR_PRO_PRODUCT_ID` = your Pro product ID

### AI (Gemini)

- `GOOGLE_GENERATIVE_AI_API_KEY` = key for `@ai-sdk/google`

### Scripts (optional, for recipe seeding)

- `SITEMAP_URL` (required for seeding)
- `SCRAPE_CONCURRENCY` (default 5, max 10)
- `BATCH_SIZE` (default 100)
- `CLEAR_DATABASE` (`true`/`false`)

## Database

- Push schema and create tables (dev):

```bash
pnpm db:push
```

Note: For production, prefer migration-based workflows and run migrations during deploys to avoid destructive changes.

- Inspect with Drizzle Studio:

```bash
pnpm db:studio
```

## Running the app

```bash
pnpm dev
```

## Seeding recipes (optional)

Configure seeding vars above, then:

```bash
pnpm db:seed-recipes
```

See `src/modules/recipes/scripts/README.md` for details.
Please respect source site robots.txt and terms of service. Tune SCRAPE_CONCURRENCY to avoid overloading upstreams.

## Emails

- Real emails are sent via Resend (verification and password reset)
- For local template preview:
- In production, set up DNS (SPF, DKIM, DMARC) for your sending domain in Resend to improve deliverability.

```bash
pnpm email:dev
```

This runs the React Email preview server for templates under `src/modules/emails/templates`.

## Testing

```bash
pnpm test
```

Vitest runs in a JSDOM environment.

## Project structure (high level)

- `src/app` app routes (App Router)
- `src/modules/*` feature modules (server: router/service/repository; ui: components/hooks/views)
- `src/lib` shared libraries (auth, db, trpc, env)
- `src/components` reusable components (shadcn in `components/ui`)

## Billing setup (Polar)

Polar is integrated via Better Auth’s plugin in `src/lib/auth/index.ts`; the client plugin is in `src/lib/auth/auth-client.ts`. Users manage plans at `/billing`.

Provide the Polar sandbox credentials and set `POLAR_SERVER=sandbox` for local dev. Webhooks are handled by the plugin; ensure `POLAR_WEBHOOK_SECRET` matches your Polar configuration when testing webhooks.

## Troubleshooting

- Database connection: ensure `DATABASE_URL` is a valid URL. For Neon, include `?sslmode=require` if needed.
- Auth sign‑in: verify OAuth callback URLs match `NEXT_PUBLIC_APP_URL` in provider settings.
- Emails: use a verified `RESEND_FROM_EMAIL`. For local development you can still run `pnpm email:dev` to preview templates.
- AI: ensure `GOOGLE_GENERATIVE_AI_API_KEY` is set; Gemini is used by the AI meal plan generator.

## Deployment

Deploy to Vercel. Set all environment variables in the dashboard. The app uses App Router and server components by default.

Checklist:

- Set `NEXT_PUBLIC_APP_URL` to your production HTTPS domain.
- Ensure Node.js runtime is 20+ in project settings.
- Run database migrations during deploys (avoid `db:push` in production).
- Add Resend, OAuth, Polar, and AI keys to the production environment.
