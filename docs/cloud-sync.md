# Cloud sync development

Cloud sync stores each user's validated planner document in D1. It does not upload a preview image. Better Auth stores its users, sessions, and Google account records in the same D1 database.

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

The local Worker serves `out/` and handles `/api/auth/*`, `/api/cloud-projects*`, `/api/contact`, and `/api/feedback`. Contact and feedback requests continue through the existing contact Worker. Missing authentication configuration returns a no-store `503` from auth endpoints and does not affect static routes or local editing.

To refresh generated Cloudflare platform types after changing Wrangler bindings, run `pnpm wrangler:types`.

## D1 and deployment boundary

Wrangler uses `.wrangler/state` for the local D1 database. `pnpm db:migrate:local` always passes `--local`; it does not access a remote database. The checked-in `database_id` of all zeroes is a local-only placeholder. Replace it with the real D1 ID before any deployment. No production D1 database has been created or migrated by this change.

The Wrangler account ID targets the verified “Stardew Valley Planner” Cloudflare account. This change does not deploy a Worker, create a remote database, configure OAuth credentials, or change the public domain. The config keeps the current root custom domain and contact/feedback API routes so the Worker can serve the static site and same-origin APIs after the domain is available in the target account. The target account does not currently have the domain zone active; do not deploy this route configuration until that is resolved. The Google callback URL for the current public origin is `https://stardewvalleyplanner.art/api/auth/callback/google`; verify the domain and account migration plan before using it in production.

The `stardewvalleyplanner.art` zone is still in the previous Cloudflare account. Before routing production traffic through this Worker, migrate or attach the zone and preserve its existing DNS records, Cloudflare Email Routing records, and Turnstile configuration. The current Wrangler route declarations are project configuration only; they do not move the domain or make the new account authoritative for it.

## Production account migration checklist (not executed)

Keep the existing production service available until the new account passes every stage below. This change performs none of these remote actions.

1. Record the old project's build settings, production branch, repository, build root, build command, output directory, configured variable names, custom domain, DNS records, Cloudflare Email Routing records, Turnstile site key/secret names, email binding, and security rules. Keep the old project intact while the new account is prepared.
2. In the verified target account, prepare the Worker named `stardew-planner` and connect the original repository. Read back the production branch, repository root, build command, output directory, and deploy command from the old project before copying them; their exact values are not established by this local change.
3. Recreate the Turnstile widget and record its new public site key as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; configure the new Worker's `TURNSTILE_SECRET`, contact sender and recipient email values, `CONTACT_EMAIL` Email Sending binding, destination/sender restrictions, and email verification. Configure the Better Auth D1 binding, `BETTER_AUTH_SECRET`, Google client ID/secret, exact allowed origins, and Google callback URL in the new account. Recreate required domain, API, and security rules.
4. Deploy and test the new account without the production domain first. Verify the home page, both language routes, planner editor, static assets, contact/feedback APIs, authentication callbacks, and 404 handling. This requires a separate deployment authorization and real service setup.
5. Only after that test passes, migrate the DNS zone for `stardewvalleyplanner.art`. Preserve its current URL and required DNS records, Email Routing records, and Turnstile behavior; verify DNSSEC, certificates, and nameservers during the zone move.
6. After production acceptance, disconnect only the old project's Builds/repository connection. Keep unrelated projects and the account's other GitHub authorizations intact.

The current account readback showed the domain zone remains in the previous account and is not active in the target account. Do not deploy the custom-domain route or change DNS, email, OAuth, secrets, project Builds, or security configuration as part of local implementation.

Keep `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in local `.dev.vars` or Cloudflare Worker secrets. The app uses a dedicated Better Auth secret and D1 database; neither is shared with AI Image Editor.
