# ACCESS Concierge

Luxury/on-demand sourcing and errand platform. Next.js (App Router, TypeScript) +
Tailwind CSS + Supabase (Postgres, Auth, Storage) + Resend.

## Status

**All 6 milestones complete.** See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for
build verification notes, the environment variable checklist, admin account
setup, and Vercel deployment steps.

- [x] **MILESTONE 1: Project Setup & Environment Configuration**
  - [x] Next.js App Router project scaffold (TypeScript, Tailwind CSS)
  - [x] `.env.local.example` template with all required variables
  - [x] `lib/supabase.ts` (browser + server clients, anon key, RLS-respecting)
  - [x] `lib/supabase-admin.ts` (service-role client, server-only)
- [x] **MILESTONE 2: Database & Storage Migration**
  - [x] `supabase/schema.sql` — `requests` table, status enum, ticket number
        generator, indexes, RLS policies
  - [x] `supabase/storage.sql` — `request-images` public bucket + policies
- [x] **MILESTONE 3: Core API Routes & Email Integration**
  - [x] `POST /api/requests/submit` — validates input, uploads optional
        reference image, inserts row, fires client + admin emails
  - [x] `POST /api/requests/update` — admin-auth-gated status/quote update,
        fires client status-update email
  - [x] Resend email templates (`lib/email-templates.ts`): client receipt,
        admin alert, client status update — all sent via `lib/email.ts`
- [x] **MILESTONE 4: Public Front-End UI (`/`)**
  - [x] Dark, high-converting single-page form matching the ACCESS theme
        (`app/page.tsx`, `components/RequestForm.tsx`)
  - [x] Client-side validation (required fields, email format, image
        type/size) with inline error messages
  - [x] Drag-and-drop or click-to-browse image upload with a live preview
        and remove button
  - [x] Wired to `POST /api/requests/submit` via `FormData`
  - [x] Confirmation modal showing the ticket number and next steps
        (`components/ConfirmationModal.tsx`)
- [x] **MILESTONE 5: Admin Auth & Dashboard (`/admin`)**
  - [x] `middleware.ts` — refreshes the Supabase session and redirects any
        unauthenticated visitor to `/admin/login`, and vice versa
  - [x] `app/admin/login/page.tsx` — email/password sign-in
  - [x] `app/admin/page.tsx` — server-fetches all requests (newest first)
        and hands off to the client dashboard
  - [x] `components/admin/AdminDashboard.tsx` — status filter tabs (All,
        Pending, In Review, Quoted, Fulfilled), request table, sign out
  - [x] `components/admin/RequestDetailDrawer.tsx` — detail drawer with the
        reference image, full contact/request info, and the status / quoted
        price / response notes form wired to `POST /api/requests/update`
  - [x] `components/admin/StatusPill.tsx` — shared status badge
- [x] **MILESTONE 6: Production Verification & Deployment Readiness**
  - [x] Static review pass (no network access in this environment to run a
        real `npm install && npm run build`) — caught and fixed two real
        type/logic bugs (see `DEPLOYMENT.md` §1); added the missing
        `.eslintrc.json` and `.gitignore`
  - [x] `DEPLOYMENT.md` — env var checklist, admin account creation
        (`scripts/create-admin.mjs`), Vercel steps, post-deploy smoke test

---

## 1. Local setup

```bash
npm install
cp .env.local.example .env.local
# fill in .env.local with your real Supabase + Resend values
npm run dev
```

## 2. Supabase project setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/storage.sql`.
3. Copy **Project URL**, **anon public key**, and **service_role key** (Settings →
   API) into `.env.local`.
4. Create admin accounts manually: Authentication → Users → Add user. There is
   no public admin signup route — this is intentional, since anyone who can
   authenticate gets full read/update access to `requests` under the current
   RLS policies (see the comments in `schema.sql`). If you need finer-grained
   roles later, add an `admins` table or a custom claim and tighten the
   policies accordingly before launch.

## 3. Resend setup

1. Create an account at [resend.com](https://resend.com) and verify a sending
   domain.
2. Copy the API key into `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` to an address on your verified domain.
4. Set `ADMIN_NOTIFICATION_EMAIL` to the inbox that should receive new-request
   alerts.

## 4. Environment variables

| Variable | Where it's used | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `lib/supabase-admin.ts` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase-admin.ts` | **No — server only** |
| `RESEND_API_KEY` | email sending (Milestone 3) | **No — server only** |
| `RESEND_FROM_EMAIL` | email sending (Milestone 3) | No |
| `ADMIN_NOTIFICATION_EMAIL` | admin alert email (Milestone 3) | No |
| `NEXT_PUBLIC_APP_URL` | email templates / links | Yes |

## 5. Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for build verification notes, the
full environment variable checklist, how to create the first admin account,
Vercel deployment steps, and a post-deploy smoke test.

## 6. Notes on the current schema/security decisions

- Public visitors never get a direct Supabase INSERT policy on `requests` or
  the storage bucket. All writes route through server-side API routes using
  the service-role client, so the anon key stays read/write-free for this
  table. This keeps client emails/phone numbers from being scraped via a
  leaked anon key.
- `ticket_number` is generated server-side by Postgres (`ACC-00001`,
  `ACC-00002`, …) via a sequence, so it's guaranteed unique and monotonic
  without a round trip from the app.
