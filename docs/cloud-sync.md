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

## Production account migration checklist

Keep the existing production service available until the new account passes every stage below. The new account's `workers.dev` test deployment is complete; credentials, Git integration, and production domain migration remain incomplete. See the dated deployment record below.

1. Record the old project's build settings, production branch, repository, build root, build command, output directory, configured variable names, custom domain, DNS records, Cloudflare Email Routing records, Turnstile site key/secret names, email binding, and security rules. Keep the old project intact while the new account is prepared.
2. The target-account Worker named `stardew-planner` now exists, but Git integration is not connected. Resolve the source-account arrangement before enabling automatic builds. The [Cloudflare GitHub integration guide](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) says a GitHub account should point to one Cloudflare account; uninstalling the shared GitHub App would stop future builds for its other connected repositories. Do not remove that shared installation to connect this project.
3. Recreate the Turnstile widget and record its new public site key as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; configure the new Worker's `TURNSTILE_SECRET`, contact sender and recipient email values, `CONTACT_EMAIL` Email Sending binding, destination/sender restrictions, and email verification. The new D1 binding and test origins are prepared; configure `BETTER_AUTH_SECRET`, Google client ID/secret, and the exact Google callback URL. If a local-save retirement deadline has been confirmed, set the public Next build variable `NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT` to that ISO deadline; leave it unset until then. Recreate required domain, API, and security rules.
4. The authorized test deployment passed page, planner, asset, and 404 checks. Complete real Google login, cloud-project save/load/conflict checks, and contact/feedback delivery before treating the new account as production-ready.
5. Only after that test passes, migrate the DNS zone for `stardewvalleyplanner.art`. Preserve its current URL and required DNS records, Email Routing records, and Turnstile behavior; verify DNSSEC, certificates, and nameservers during the zone move.
6. After production acceptance, disconnect only the old project's Builds/repository connection. Keep unrelated projects and the account's other GitHub authorizations intact.

The domain zone remains in the previous account. The test deployment did not change its domain routes, DNS, old Worker, old Builds connection, or shared GitHub authorization.

The D1 boundary and migration checklist above describe the pre-cutover test phase; see “Production domain cutover on 2026-10-16” below for the current production state.

Keep `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in local `.dev.vars` or Cloudflare Worker secrets. The app uses a dedicated Better Auth secret and D1 database; neither is shared with AI Image Editor.

`NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT` is a public Next.js build variable, not a Worker secret. The retirement date has not been decided. Leave it unset until that date is confirmed; the UI should say no migration period is scheduled. Once decided, set the same ISO deadline on production builds rather than calculating a fresh seven-day deadline on every build. This deadline only controls the local-save transition reminder and does not add an expiry to cloud projects.

## Local acceptance on 2026-10-15

`pnpm typecheck` passed for both the browser and Worker TypeScript projects. The production static build passed, and the cloud-sync/auth/Worker/save-modal test selection passed 107 tests across 17 files. `wrangler types --check` and `wrangler deploy --dry-run` also passed; the dry run did not deploy anything.

An isolated local workerd and D1 database passed 16 API checks, including owner isolation, same-request account matching, concurrent CAS updates, bounded pagination and request bodies, empty-stream DELETE, and session revocation. Ego Browser verified manual migration, repeated manual sync, automatic first-save upload, later save updates, recovery into independent browser storage, conflict preservation and resolution, offline retry, external session changes, and sign-out without losing local projects. A 390-pixel viewport had no horizontal overflow. These checks used synthetic local sessions and a temporary countdown deadline; the final default build leaves the real retirement date unset.

The full repository test run did not pass: 10 assertions fail in pre-existing asset/catalog/blog/static-route content, and one resource smoke test exceeded its five-second limit during the full parallel run. That resource suite passed all three tests when run separately. The content failures were compared against the pre-cloud-sync Git revision; they are outside this implementation's scope.

These local checks did not establish real Google OAuth, remote D1, production email/Turnstile, deployment, or DNS migration. Subsequent external evidence is recorded separately below; real Google login and user cloud-project operations remain unaccepted.

## Target-account test deployment on 2026-10-16

Using Ego in the “Stardew Valley Planner” Cloudflare account (`c75d13cb32903c8f0ec7948f6c91c9ed`), a D1 database named `stardew-planner` was created with ID `6cf9f831-c7b6-4349-b1ff-8c6c0f1ff9a5`. The existing `0001_auth.sql` and `0002_cloud_projects.sql` statements were applied in the D1 Console. This was a manual Console operation; no Wrangler migration command was run, so do not assume a Wrangler migration ledger records these statements.

The Console readback confirmed the `user`, `session`, `account`, `verification`, and `cloud_projects` tables contain zero rows. All three expected indexes are present. `cloud_projects.user_id` references `user.id` with `ON DELETE CASCADE`; its stored schema retains the 1 MiB payload limit, composite primary key, and `WITHOUT ROWID`, with no expiry column or automatic deletion. No local QA users or project data were imported, and no secret was created or copied.

The Worker is deployed at **https://stardew-planner.stardew-valley-planner.workers.dev**. The final upload returned HTTP 200 with no errors and startup time 74 ms. Dashboard/API readback confirmed deployment `709635c8-a02f-43e5-ad1d-d650904e93df`, serving version `62f1e127-4856-49c8-845f-778da3bd6834` at 100%. The `workers.dev` URL is enabled, Preview URLs are disabled, and there are no custom domains or zone routes on the new Worker.

The upload used a clean `git archive d5b6874` under `/tmp/stardew-planner-direct-upload-d5b6874.n8xlOt`, excluding uncommitted workspace changes. Its standard `pnpm run build` log records successful compilation, completed TypeScript checking, and 68/68 generated static pages. An existing esbuild dependency produced the 804,281-byte Worker ESM bundle; its only external import is `node:async_hooks`. No dependencies were installed. Ego uploaded 1,380 asset paths (935 unique files), retained `_headers` as asset configuration, and published the compiled Worker through the browser session. No Wrangler command was used for this deployment. The live compatibility date is `2026-08-08` with `nodejs_compat`; `DB` points to the new D1 ID and `STATIC_ASSETS` is present. Authentication origins point to the new test URL.

Ego verified the English and Chinese planner render, including the Chinese cloud panel at a 390-pixel viewport (352-pixel dialog, no failed asset requests). HTTP checks returned 200 for both home pages, both blog indexes, robots, sitemap, CSS, and a TMX map; an unknown route returned 404. The downloaded hero AVIF matched the staged file byte-for-byte, and static CSS retained its immutable cache header. The final D1 readback still showed zero rows in all five application tables.

**Google login and cloud sync are not enabled.** `/api/auth/get-session` and `/api/cloud-projects` return explicit HTTP 503 responses with `Cache-Control: no-store`, naming the missing `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`. The Google callback for this test deployment is `https://stardew-planner.stardew-valley-planner.workers.dev/api/auth/callback/google`; it has not been accepted with real credentials. Contact/feedback remain unavailable because this build has no Turnstile site key and the new Worker has no configured email binding/credentials. `NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT` remains unset, so the seven-day migration countdown has not started. Cloud records still have no automatic expiry.

GitHub verification succeeded, but the new account's repository connection remained empty. The existing GitHub App installation and its four repository permissions were preserved. This upload did not commit or push. At final readback, GitHub `main` remained `9287a02`; the local workspace was at `bbc7ebc`, whose later UI changes are not part of this `d5b6874` deployment.

The old production deployment `24df1416-2c7a-4635-8f33-a3950847008a` and version `b594fc0a-acfc-4082-a144-a30ca44c961f` remained unchanged. Its nine DNS records retained the same SHA-256 fingerprint before and after deployment: `7e6de2aea1eeb83d5714388d82f8b6f715f56c5a580f12d70f555e21ca82f4e7`. This deployment made no domain-zone or nameserver changes and switched no production traffic.

The temporary build's `.direct-upload/` directory retains the build log, upload result, remote Worker readback, live HTTP/asset/mobile checks, final D1 counts, screenshots, and old-production comparison records. This is evidence for the new test deployment, not acceptance of real Google OAuth, authenticated cloud CRUD, email delivery, Git automatic deployment, or production domain migration.

## Production domain cutover on 2026-10-16

The final infrastructure readback at 00:17 UTC reports the `stardewvalleyplanner.art` zone active and the old-account zone moved. The production custom domain is enabled on `stardew-planner`; the old zone's observed name servers match the new zone's assigned pair. The apex and wildcard advanced and universal certificates are active. Deployment `98b96050-ddc4-4357-895a-2d26e2fe86c9` serves version `608fdc60-7b50-4f7c-abf3-b9f202b7d2db` at 100%, uploaded from the dashboard.

The post-cutover DNS readback contains the eight copied target-zone records unchanged from the pre-cutover snapshot, plus Cloudflare's managed proxied apex AAAA record. The Worker has 11 bindings: `AUTH_ALLOWED_ORIGINS`, `BETTER_AUTH_URL`, `CONTACT_ALLOWED_ORIGIN`, `CONTACT_EMAIL`, `CONTACT_EXPECTED_TURNSTILE_HOSTNAME`, `CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `CONTACT_TURNSTILE_ACTION`, `DB`, `STATIC_ASSETS`, and `TURNSTILE_SECRET`. The `CONTACT_EMAIL` binding permits `contact@stardewvalleyplanner.art` and routes to `wsir78933@gmail.com`; Email Routing reports ready. Secret values are not recorded here.

Production HTTP checks returned 200 for `/`, `/zh/`, `/contact`, `/zh/contact`, `/blog`, `/zh/blog`, `/robots.txt`, and `/sitemap.xml`; an unknown path returned 404. The captured Chinese planner view shows the map rendered. Contact submission returned 202, replay returned 403, and a matching message was found in the mailbox. Feedback submission returned 202 and a matching delivered message was found. The page continues using GA4 measurement ID `G-SEKQT6DTT1` and Clarity project `xwledpd5pa`; their dashboards showed 5 active GA4 users in the last 30 minutes and 2 Clarity real-time users, which cannot be attributed to this acceptance run. Search Console reports the domain owner verified after cutover. Its sitemap row shows historical `Success` with 58 discovered pages and last read on 2026-10-11, before the cutover; the separate `www` row remains `Unknown` / `Couldn't fetch`.

Real Google login and authenticated cloud CRUD remain unaccepted, and `NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT` remains unset. Git automatic deployment is not connected: the current deployment source is dashboard upload. The old Worker's Builds/Git connection is disconnected, while the Worker service and shared GitHub App installation are retained. The migrated `content_bots_protection=disabled`, `crawler_protection=disabled`, and `ai_training=disallow` values match the old account. The legacy `ai_bots_protection` value still differs (`disabled` in the new account, `only_on_ad_pages` in the old account), so not all security settings are identical.
