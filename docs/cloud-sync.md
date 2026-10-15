# Cloud sync development

Cloud sync stores each user's validated planner document in D1 until that user deletes it. Cloud projects have no expiry or automatic deletion. It does not upload a preview image. Better Auth stores its users, sessions, and Google account records in the same D1 database. The seven-day reminder is only a transition notice for retiring local saves; it never expires a cloud project.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.dev.vars.example` to `.dev.vars` and replace its placeholders with a local Better Auth secret and Google OAuth client credentials. Never commit `.dev.vars`.
3. Add `http://localhost:8787/api/auth/callback/google` as an authorized redirect URI in the local Google OAuth client.
4. Apply the migrations to Wrangler's local D1 only:

   ```sh
   pnpm db:migrate:local
   ```

5. Build the existing static export and start the local Worker on `http://localhost:8787`:

   ```sh
   pnpm dev:cloud
   ```

Open the exact `http://localhost:8787` origin shown above. The local command binds to `127.0.0.1` and sets both `BETTER_AUTH_URL` and `AUTH_ALLOWED_ORIGINS` to `http://localhost:8787`; using a different hostname such as `127.0.0.1` in the browser changes the origin and will break the Google callback/origin checks. Register `http://localhost:8787/api/auth/callback/google` as the local OAuth redirect URI.

The local Worker serves `out/` and handles `/api/auth/*`, `/api/cloud-projects*`, `/api/contact`, and `/api/feedback`. Contact and feedback requests continue through the existing contact Worker. Missing authentication configuration returns a no-store `503` from auth endpoints and does not affect static routes or local editing. The checked-in production compatibility date stays `2026-08-08`; Wrangler 4.98.0 bundles workerd 1.20260603.1, whose latest locally supported date is `2026-06-10`. The local command therefore overrides the date to `2026-06-10` and explicitly enables `nodejs_compat`. Local Worker QA uses the same runtime override; this does not verify production runtime behavior at `2026-08-08`.

Every cloud-project `GET`, `PUT`, and `DELETE` must include `X-Expected-Account-Id` with the account ID the browser expects to be signed in. The Worker compares it with the account ID from the current Better Auth session before calling the cloud handler. A missing or blank header returns `400` with `EXPECTED_ACCOUNT_REQUIRED`; a different account returns `409` with `ACCOUNT_CHANGED`. The header never selects the database owner: requests that pass the check still use the authenticated session ID. Cloud-project responses use `Cache-Control: no-store`.

To refresh generated Cloudflare platform types after changing Wrangler bindings, run `pnpm wrangler:types`.

## D1 and deployment boundary

Wrangler uses `.wrangler/state` for the local D1 database. `pnpm db:migrate:local` always passes `--local`; it does not access a remote database. The checked-in `database_id` of all zeroes is a local-only placeholder. It is not the database created for the new account and must not be used for a deployment.

The Wrangler account ID targets the verified “Stardew Valley Planner” Cloudflare account. The current config keeps the existing root custom domain and contact/feedback API routes, but those routes do not transfer the domain or make the target account authoritative. The target account does not currently have the domain zone active; do not deploy this route configuration until that is resolved. The Google callback URL for the current public origin is `https://stardewvalleyplanner.art/api/auth/callback/google`; verify the domain and account migration plan before using it in production.

The `stardewvalleyplanner.art` zone is still in the previous Cloudflare account. Before routing production traffic through this Worker, migrate or attach the zone and preserve its existing DNS records, Cloudflare Email Routing records, and Turnstile configuration. The current Wrangler route declarations are project configuration only; they do not move the domain or make the new account authoritative for it.

## Production account migration checklist (not executed)

Keep the existing production service available until the new account passes every stage below. This change performs none of these remote actions.

1. Record the old project's build settings, production branch, repository, build root, build command, output directory, configured variable names, custom domain, DNS records, Cloudflare Email Routing records, Turnstile site key/secret names, email binding, and security rules. Keep the old project intact while the new account is prepared.
2. In the verified target account, prepare the Worker named `stardew-planner` and connect the original repository. Read back the production branch, repository root, build command, output directory, and deploy command from the old project before copying them; their exact values are not established by this local change.
3. Recreate the Turnstile widget and record its new public site key as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; configure the new Worker's `TURNSTILE_SECRET`, contact sender and recipient email values, `CONTACT_EMAIL` Email Sending binding, destination/sender restrictions, and email verification. Configure the Better Auth D1 binding, `BETTER_AUTH_SECRET`, Google client ID/secret, exact allowed origins, and Google callback URL in the new account. If a local-save retirement deadline has been confirmed, set the public Next build variable `NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT` to that ISO deadline; leave it unset until then. Recreate required domain, API, and security rules.
4. Deploy and test the new account without the production domain first. Verify the home page, both language routes, planner editor, static assets, contact/feedback APIs, authentication callbacks, and 404 handling. This requires a separate deployment authorization and real service setup.
5. Only after that test passes, migrate the DNS zone for `stardewvalleyplanner.art`. Preserve its current URL and required DNS records, Email Routing records, and Turnstile behavior; verify DNSSEC, certificates, and nameservers during the zone move.
6. After production acceptance, disconnect only the old project's Builds/repository connection. Keep unrelated projects and the account's other GitHub authorizations intact.

The current account readback showed the domain zone remains in the previous account and is not active in the target account. Do not deploy the custom-domain route or change DNS, email, OAuth, secrets, project Builds, or security configuration as part of local implementation.

Keep `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in local `.dev.vars` or Cloudflare Worker secrets. The app uses a dedicated Better Auth secret and D1 database; neither is shared with AI Image Editor.

`NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT` is a public Next.js build variable, not a Worker secret. The retirement date has not been decided. Leave it unset until that date is confirmed; the UI should say no migration period is scheduled. Once decided, set the same ISO deadline on production builds rather than calculating a fresh seven-day deadline on every build. This deadline only controls the local-save transition reminder and does not add an expiry to cloud projects.

## Local acceptance on 2026-10-15

`pnpm typecheck` passed for both the browser and Worker TypeScript projects. The production static build passed, and the cloud-sync/auth/Worker/save-modal test selection passed 107 tests across 17 files. `wrangler types --check` and `wrangler deploy --dry-run` also passed; the dry run did not deploy anything.

An isolated local workerd and D1 database passed 16 API checks, including owner isolation, same-request account matching, concurrent CAS updates, bounded pagination and request bodies, empty-stream DELETE, and session revocation. Ego Browser verified manual migration, repeated manual sync, automatic first-save upload, later save updates, recovery into independent browser storage, conflict preservation and resolution, offline retry, external session changes, and sign-out without losing local projects. A 390-pixel viewport had no horizontal overflow. These checks used synthetic local sessions and a temporary countdown deadline; the final default build leaves the real retirement date unset.

The full repository test run did not pass: 10 assertions fail in pre-existing asset/catalog/blog/static-route content, and one resource smoke test exceeded its five-second limit during the full parallel run. That resource suite passed all three tests when run separately. The content failures were compared against the pre-cloud-sync Git revision; they are outside this implementation's scope.

Real Google OAuth, the production compatibility date, remote D1, production email/Turnstile, deployment, and DNS migration have not been accepted. Local tests do not establish those external states.

## Target-account preparation status on 2026-10-16

Using Ego in the “Stardew Valley Planner” Cloudflare account (`c75d13cb32903c8f0ec7948f6c91c9ed`), a D1 database named `stardew-planner` was created with ID `6cf9f831-c7b6-4349-b1ff-8c6c0f1ff9a5`. The existing `0001_auth.sql` and `0002_cloud_projects.sql` statements were applied in the D1 Console. This was a manual Console operation; no Wrangler migration command was run, so do not assume a Wrangler migration ledger records these statements.

The Console readback confirmed the `user`, `session`, `account`, `verification`, and `cloud_projects` tables contain zero rows. All three expected indexes are present. `cloud_projects.user_id` references `user.id` with `ON DELETE CASCADE`; its stored schema retains the 1 MiB payload limit, composite primary key, and `WITHOUT ROWID`, with no expiry column or automatic deletion. No local QA users or project data were imported, and no secret was created or copied.

No Worker has been created or deployed in the target account. The production domain, DNS, old Worker, and old Builds connection remain unchanged. The user replied “好了” in the GitHub authorization flow; its resulting authorization and repository connection are still unverified pending Root's Ego readback. The remote `main` is at `9287a02`; local `HEAD` is `d5b6874`, and no branch has been pushed. `pnpm typecheck` and `pnpm build` both exited 0 in this workspace; these are repository checks, not a Wrangler build or deployment proof.

The next deployment-preparation gate is for Root to read back the GitHub authorization in Ego, then verify the target-account Worker's repository, branch, build root, build command, output directory, and deploy command. The user has authorized a test deployment on the account's `workers.dev` hostname. Keep the old production service and domain untouched; no production domain routing or DNS/zone change has been made.
