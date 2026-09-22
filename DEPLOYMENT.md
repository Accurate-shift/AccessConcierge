# Deployment

## 1. Build verification

This project was written and statically reviewed in a sandbox with no
package-registry access, so `npm run build` could not be executed here.
Before deploying, run it yourself:

```bash
npm install
npm run lint
npm run build
```

What was checked without a real install:
- Every `@/...` import resolves to a file that exists.
- No file references `React.*` without importing `React`/the relevant type
  (this was actually caught and fixed — `app/layout.tsx` and
  `components/RequestForm.tsx` both referenced `React.ReactNode` with no
  import in scope).
- The `RequestInsert` type didn't mark nullable columns as optional, which
  would have made `/api/requests/submit`'s insert call fail `tsc` (it omits
  `admin_response_notes`/`quoted_price` on purpose, since those are
  admin-only fields) — fixed in `types/database.ts`.
- Client-side validation in `RequestForm.tsx` only ever added errors, never
  cleared one once a field became valid — fixed.
- Added the missing `.eslintrc.json` and `.gitignore` (both absent since
  Milestone 1 — `next build` runs ESLint by default and will prompt
  interactively for a config if one isn't present, which breaks CI).
- Removed an unused `clsx` dependency from `package.json`.

What this pass can't catch: anything that only surfaces once the real
`next`/`@supabase/*`/`resend` type definitions are loaded (exact prop types,
version-specific API shapes). Run the commands above before deploying.

## 2. Environment variables

Set all of these in Vercel under Project Settings → Environment Variables.

| Variable | Server-only? |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** |
| `RESEND_API_KEY` | **Yes** |
| `RESEND_FROM_EMAIL` | Yes |
| `ADMIN_NOTIFICATION_EMAIL` | Yes |
| `NEXT_PUBLIC_APP_URL` | No — set to your production URL, e.g. `https://access-concierge.vercel.app` |

Vercel automatically treats anything without a `NEXT_PUBLIC_` prefix as
server-only; it's never sent to the browser bundle.

## 3. Create the first admin account

Do this once, after the Supabase project and schema are set up (Milestones
1–2) and before you need to sign in at `/admin`. Two options:

**Option A — Supabase dashboard (simplest):** Authentication → Users → Add
user. Paste in the email and password directly there; nothing touches a
file on disk.

**Option B — the `create-admin` script**, if you'd rather do it from the
terminal. It reads the email and password from environment variables at run
time only — they are never written into `scripts/create-admin.mjs` or any
other file, so nothing lands in git history:

```bash
ADMIN_EMAIL="your-team-email" ADMIN_PASSWORD="your-password" npm run create-admin
```

For the account you mentioned, that's the same command with your values
filled in — worth noting that typing a real password directly into a shell
command puts it in your shell history, so if that matters to you, Option A
avoids that entirely.

## 4. Deploy to Vercel

1. Push this repository to GitHub (`.gitignore` already excludes
   `.env.local`, `node_modules`, and `.next`).
2. In Vercel, "Add New… → Project" and import the repo. Framework preset
   auto-detects Next.js — no build command changes needed.
3. Add every variable from the table above.
4. Deploy.
5. Once live, set `NEXT_PUBLIC_APP_URL` to the real deployed URL (used in
   the admin-alert email's dashboard link) and redeploy if you changed it
   after the first deploy.

## 5. Post-deploy smoke test

- [ ] Load the production URL — the public form renders, no console errors.
- [ ] Submit a test request with a reference image attached.
- [ ] Confirm the ticket-number modal appears.
- [ ] Confirm the client receipt email and the admin alert email both
      arrive (check spam if using a newly-verified Resend domain).
- [ ] Sign in at `/admin/login` with the account from step 3.
- [ ] Confirm the test request appears in the table, and that clicking it
      opens the drawer with the reference image visible.
- [ ] Set a status, quoted price, and note, then send the update — confirm
      the client status-update email arrives.
- [ ] Sign out, and confirm `/admin` redirects back to `/admin/login`.
