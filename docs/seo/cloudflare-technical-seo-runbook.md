# Cloudflare technical SEO runbook

This is a human-only production checklist. It records no Cloudflare login, API
call, deployment, configuration change, or proof that a Cloudflare setting is
already enabled. Run it only after the change owner has approval for the
selected zone.

## 0. Architecture boundary and change record

### Fixed boundary

- [`wrangler.jsonc`](../../wrangler.jsonc) is the **Contact Worker**: its only
  route is `stardewvalleyplanner.art/api/contact*`, and
  [`workers/README.md`](../../workers/README.md) specifies that it owns only
  `POST /api/contact`.
- Do not add static assets, a catch-all route, a full-site Worker entry point,
  or a static-deployment configuration to that file or Worker. It continues to
  own the contact API only.
- A full-site static deployment is a separate deployment unit with its own
  reviewed name, route ownership, configuration file, release, rollback
  target, and approval. It must serve the Next static-export output in `out/`.

### Before changing the zone

1. Record the zone, deployment owner, timestamp, current SSL/TLS mode,
   existing redirect rules, Transform Rules, HSTS settings, CSP-related rules,
   Cache Rules / Cache Response Rules, and current production smoke output.
2. Save the current rule order and each affected rule's exact expression and
   action. Do not replace an unknown existing rule.
3. Confirm the full-site deployment does not take ownership of
   `/api/contact*`. If route ownership cannot be proved, stop; this runbook
   does not authorize a deployment or route change.

The configuration and verification references below are Cloudflare's current
official documentation:

- [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/)
- [HTTP Strict Transport Security (HSTS)](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/)
- [Content security rules](https://developers.cloudflare.com/client-side-security/rules/)
- [Static Site Generation and custom 404 pages](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [Edge and Browser Cache TTL](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/)
- [Cache Response Rules](https://developers.cloudflare.com/cache/how-to/cache-response-rules/)

## 1. SSL/TLS precheck, then a single HTTP-to-HTTPS hop

1. In **SSL/TLS > Overview**, inspect—not infer—the current encryption mode.
   Do not enable Always Use HTTPS if the mode is `Off`; Cloudflare documents
   `Full (strict)` as the end-to-end mode when the origin certificate satisfies
   its requirements.
2. Inventory all existing HTTP-to-HTTPS behavior at the origin and in
   Redirect Rules / Page Rules. Remove or disable duplicate behavior only in
   the approved change, so an HTTP request has exactly one redirect rather than
   a chain or loop.
3. In **SSL/TLS > Edge Certificates**, turn on **Always Use HTTPS**. It
   redirects HTTP visitor requests before they reach the origin. Do not use a
   second redirect mechanism for the same traffic.
4. Run [V1](#v1-http-single-hop-and-query-preservation) before proceeding. The
   success condition is one `301` or `308` whose `Location` is the same
   hostname, path, and query on `https`, followed by an HTTPS `200`.
5. If the redirect is not one hop, the query changes, or HTTPS is unhealthy,
   turn off only the newly enabled setting or restore the previously recorded
   redirect rule, then stop and preserve the evidence.

## 2. Response Header Transform Rules; HSTS comes later

Use **Rules > Transform Rules > Modify Response Header** for ordinary static
response headers. Cloudflare's `Set static` / `Set dynamic` operation replaces
an existing value or adds it when absent; use **Set**, not Add, for the
single-valued headers below. Scope the rule to the reviewed production host,
preserve rule order in the evidence record, and do not touch `cf-*` / `x-cf-*`
headers, which Cloudflare does not allow these rules to modify.

Create only the approved baseline headers, each with `Set static`:

| Header | Value | Purpose |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Do not MIME-sniff responses. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit cross-origin referrer detail. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable these unneeded browser capabilities. |
| `X-Frame-Options` | `SAMEORIGIN` | Provide frame protection while CSP is observation-only. |

Do **not** set `Strict-Transport-Security` in this Transform Rule while the
zone's Cloudflare HSTS setting owns it. Cloudflare documents that an HSTS
Transform Rule can override the SSL/TLS HSTS value. Keeping one owner avoids
an untraceable conflict.

Only after V1 has remained successful for the agreed observation period and
every intended hostname is HTTPS-capable, configure HSTS at **SSL/TLS > Edge
Certificates > HTTP Strict Transport Security (HSTS) > Enable HSTS**. Start
with a reversible, approved `max-age`; enable `includeSubDomains` only after
checking every subdomain, and enable preload only after meeting Cloudflare's
documented 12-month requirement and separate preload decision. Run
[V2a](#v2a-baseline-security-headers) immediately after the header rule and
again after HSTS. At this stage, success requires only the four baseline
headers above plus a non-empty `Strict-Transport-Security` header with a
positive `max-age` on HTTPS. CSP is deliberately not a V2a requirement;
Report-Only / Log has not been configured yet.

## 3. CSP: measure first, Report-Only / Log before enforcement

This repository proves only the **declared integrations**, not their complete
runtime network graph:

- GA is loaded from `www.googletagmanager.com` in the English and Chinese root
  layouts.
- Microsoft Clarity is loaded from `www.clarity.ms` in those layouts.
- The contact form lazily loads Turnstile from
  `challenges.cloudflare.com/turnstile/v0/api.js` when a public site key is
  supplied.
- Blog video playback creates a lazy `www.youtube-nocookie.com` iframe.

Before creating any CSP allowlist, use a real production browser session and
its Network panel to record the actual `script-src`, `connect-src`, `frame-src`,
`img-src`, `style-src`, `font-src`, `media-src`, and worker requests for:

1. English and Chinese public pages after GA and Clarity initialize.
2. `/contact` and `/zh/contact` with a real Turnstile-rendering attempt.
3. Both blog articles in both languages after starting each YouTube embed.

Do not copy a guessed list of vendor hostnames into an enforcing CSP. Include
only observed, documented requests and the site's own needed sources. Record
the exact date, page, user interaction, request URL, initiator, directive, and
whether the source was required.

If the zone has **Client-Side Security Advanced**, create a **Log** content
security rule first. Cloudflare documents that Log uses
`Content-Security-Policy-Report-Only`, reports violations without blocking,
and must be validated before an Allow rule. If that product is unavailable,
use a single Response Header Transform Rule with **Set static** on
`Content-Security-Policy-Report-Only` only after a reporting receiver and the
measured policy text have been approved. Never add an enforcing
`Content-Security-Policy` header in this phase.

For each policy revision, inspect the response header and Cloudflare/browser
violation evidence with [V2b](#v2b-csp-policy-state), exercise the measured
flows again, and keep the policy in Report-Only / Log until it produces no
unexplained required-resource violations for the agreed observation period.
The Report-Only / Log state succeeds only when
`Content-Security-Policy-Report-Only` is present and an enforced
`Content-Security-Policy` is absent. After separate approval for enforcement,
the enforced state succeeds only when `Content-Security-Policy` is present and
the evidence record names the approved policy owner and rule action. Before
changing state, re-check for duplicate CSP headers: Cloudflare notes that
multiple policies combine and the most restrictive result can break legitimate
resources.

## 4. Separate static-site deployment configuration

This is a configuration shape for the **separate full-site deployment unit**;
it is not a patch to `wrangler.jsonc` and it must not be applied to the Contact
Worker. The deployment owner should use the following reviewed `assets` block
in that separate unit:

```jsonc
{
  "assets": {
    "directory": "./out",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

Cloudflare documents `auto-trailing-slash` for static HTML routing and
`404-page` as serving the nearest `404.html` with a `404 Not Found` status.
The current export has `out/404.html`, `out/robots.txt`, `out/sitemap.xml`,
and file-style public routes such as `out/farm/standard.html` and
`out/zh/farm/standard.html`.

After the separate deployment owner completes an approved release, run
[V3](#v3-static-routing-and-indexing-files) and
[V4](#v4-html-404). Success means the two canonical farm URLs are `200`, the
trailing-slash probe either takes one `301` / `308` to the exact canonical URL
or returns a direct `200` with one exact canonical link to that URL (never an
SPA fallback), robots and sitemap are served as their correct non-HTML types,
and an unknown URL returns `404 text/html` from the HTML 404 artifact.

## 5. Cache Rules and Cache Response Rules

Keep browser caching and edge caching separate in the change record:

- **Browser caching** is what visitors see in `Cache-Control` / `Expires`.
  Cloudflare normally respects existing headers when Browser Cache TTL is set
  to **Respect Existing Headers**. Changing it can make a deployed asset remain
  stale in a visitor browser even after an edge purge.
- **Edge Cache TTL** is the maximum freshness period inside Cloudflare's cache;
  it is not shown in response headers. Use a **Cache Rule** to change edge
  eligibility or edge TTL, not a Response Header Transform Rule.
- **Cache Response Rules** can change response `Cache-Control` directives
  before Cloudflare's caching decision. Transform Rules and Workers run after
  that decision and cannot set edge behavior.

For this static export, first observe production headers and cache statuses.
An approved cache change may target immutable, hashed `/_next/static/` assets
and keep their browser `max-age` positive. Do not invent an HTML TTL in this
runbook: leave HTML edge eligibility, Edge TTL, and browser TTL unchanged
unless a separately approved measurement establishes a safe value. Keep
`/api/contact*` out of any static-asset cache rule.

Run [V5](#v5-repeated-hashed-static-asset-requests) after any approved cache
change. Success is a real same-origin hashed asset with positive browser
`max-age`, two recorded responses, and their `CF-Cache-Status` values. A
second request is evidence to review, not an unconditional `HIT` assertion:
cache status can vary by edge location and rule eligibility.

## 6. Rollback and evidence template

### Rollback order

1. Stop at the failed verification command and preserve its full output,
   timestamp, command, public URL, Cloudflare Ray ID (if present), and rule
   order.
2. Revert only the latest approved zone change: restore the prior redirect,
   header-rule revision, HSTS setting, CSP Log / Report-Only policy, static
   deployment version, or cache-rule revision from the before-change record.
3. For HSTS, follow Cloudflare's documented disable procedure (set its
   `max-age` to `0`) and retain HTTPS until browsers have expired the prior
   advertised max-age. Do not remove HTTPS to attempt a rollback.
4. Re-run the command that failed plus `pnpm seo:smoke`; attach both before
   and after outputs. Do not state that production is fixed until the commands
   pass.

### Evidence record (complete for every change)

```text
Change ID:
Approved owner / approver:
UTC timestamp and zone:
Scope (one of redirect | headers | HSTS | CSP | static deployment | cache):
Before state (rule IDs/order, values, deployment version):
Exact approved change:
Contact Worker boundary checked (/api/contact* remains separate): yes/no
Production URL and Cloudflare Ray IDs:
Commands run and complete output attachments:
Observed statuses, Location, headers, CSP violations, CF-Cache-Status:
Result (pass | fail):
Rollback performed (exact revision/setting) or not needed:
Follow-up owner and due date:
```

## Production verification commands

Set the target once for this terminal session. These commands are read-only;
they do not authenticate to Cloudflare or mutate the zone.

```bash
export SEO_ORIGIN='https://stardewvalleyplanner.art'
```

### V1. HTTP single hop and query preservation

```bash
curl --silent --show-error --dump-header - --output /dev/null --max-redirs 0 \
  'http://stardewvalleyplanner.art/farm/standard?seo_https_probe=1'
curl --silent --show-error --dump-header - --output /dev/null \
  'https://stardewvalleyplanner.art/farm/standard?seo_https_probe=1'
```

Expected: the first response is `301` or `308` with exactly
`Location: https://stardewvalleyplanner.art/farm/standard?seo_https_probe=1`;
the second is `200`. `--max-redirs 0` makes an extra hop visible rather than
silently following it.

### V2a. Baseline security headers

```bash
curl --silent --show-error --dump-header - --output /dev/null \
  "$SEO_ORIGIN/farm/standard" \
  | rg -i '^(strict-transport-security|x-content-type-options|referrer-policy|permissions-policy|x-frame-options):'
```

Expected: non-empty `strict-transport-security` with positive `max-age`,
`x-content-type-options: nosniff`, and the three other baseline headers. Do
not require a CSP header until Section 3 has created an approved policy.

### V2b. CSP policy state

Set `SEO_CSP_POLICY_STATE` to the action recorded in the current change
evidence, then run this command after the Section 3 policy change.

```bash
export SEO_CSP_POLICY_STATE='report-only' # allowed values: report-only | enforced
seo_csp_headers="$(curl --silent --show-error --dump-header - --output /dev/null "$SEO_ORIGIN/farm/standard")"
case "$SEO_CSP_POLICY_STATE" in
  report-only)
    printf '%s\n' "$seo_csp_headers" | rg -i '^content-security-policy-report-only:'
    ! printf '%s\n' "$seo_csp_headers" | rg -qi '^content-security-policy:'
    ;;
  enforced)
    printf '%s\n' "$seo_csp_headers" | rg -i '^content-security-policy:'
    ;;
  *)
    echo "SEO_CSP_POLICY_STATE must be report-only or enforced; received: $SEO_CSP_POLICY_STATE" >&2
    exit 1
    ;;
esac
```

Expected: with `report-only`, `Content-Security-Policy-Report-Only` is present
and no enforced `Content-Security-Policy` is present. With `enforced`,
`Content-Security-Policy` is present and the evidence record identifies the
approved policy owner and rule action. The command intentionally does not
claim enforcement merely from a header value; the recorded state is required.

### V3. Static routes, canonical slash behavior, robots, and sitemap

```bash
for seo_path in /farm/standard /zh/farm/standard /robots.txt /sitemap.xml; do
  curl --silent --show-error --dump-header - --output /dev/null --max-redirs 0 "$SEO_ORIGIN$seo_path" \
    | awk -v requested_path="$seo_path" '$0 ~ /^HTTP\// || tolower($0) ~ /^(location|content-type):/ { print requested_path ": " $0 }'
done
```

Expected: `/farm/standard` and `/zh/farm/standard` are `200 text/html`.
`/robots.txt` is `200 text/plain` and `/sitemap.xml` is `200 application/xml`
or `text/xml`.

Run this separate trailing-slash assertion. It prefers one `301` / `308` to
the exact canonical URL. The only accepted direct-`200` alternative is a
single canonical link to that exact no-trailing-slash URL; any other `200` is
treated as an SPA fallback or duplicate-canonical failure.

```bash
seo_canonical_farm_url="$SEO_ORIGIN/farm/standard"
seo_trailing_headers="$(curl --silent --show-error --dump-header - --output /dev/null --max-redirs 0 "$seo_canonical_farm_url/")"
seo_trailing_status="$(printf '%s\n' "$seo_trailing_headers" | awk '$0 ~ /^HTTP\// { status = $2 } END { print status }')"
case "$seo_trailing_status" in
  301|308)
    seo_trailing_location="$(printf '%s\n' "$seo_trailing_headers" | awk 'tolower($0) ~ /^location:/ { sub(/^[^:]*:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit }')"
    test "$seo_trailing_location" = "$seo_canonical_farm_url" || { echo "Unexpected trailing-slash Location: $seo_trailing_location" >&2; exit 1; }
    seo_trailing_final_status="$(curl --silent --show-error --location --max-redirs 1 --output /dev/null --write-out '%{http_code}' "$seo_canonical_farm_url/")"
    test "$seo_trailing_final_status" = '200' || { echo "Trailing-slash redirect did not finish at 200: $seo_trailing_final_status" >&2; exit 1; }
    ;;
  200)
    seo_trailing_html="$(curl --fail --silent --show-error "$seo_canonical_farm_url/")"
    seo_canonical_link_count="$(printf '%s' "$seo_trailing_html" | rg -o '<link rel="canonical" href="[^"]+"/?>' | wc -l | tr -d '[:space:]')"
    test "$seo_canonical_link_count" = '1' || { echo "Expected one canonical link for a direct trailing-slash 200; received: $seo_canonical_link_count" >&2; exit 1; }
    printf '%s' "$seo_trailing_html" | rg -q '<link rel="canonical" href="https://stardewvalleyplanner\.art/farm/standard"/?>' || { echo 'Direct trailing-slash 200 did not self-canonicalize to the no-trailing-slash URL; rejecting SPA fallback.' >&2; exit 1; }
    ;;
  *)
    echo "Unexpected trailing-slash status: $seo_trailing_status" >&2
    exit 1
    ;;
esac
```

The `301` / `308` branch uses `--max-redirs 1`, so a second redirect fails.
The direct-`200` branch checks the full body for exactly one canonical link and
rejects a homepage / SPA fallback whose canonical is absent or different.

### V4. HTML 404

```bash
curl --silent --show-error --dump-header - \
  "$SEO_ORIGIN/__production-seo-smoke-missing-page__" \
  | rg -io 'HTTP/[0-9.]+ [0-9]+|content-type:[^\r\n]+|<html[^>]*>|<meta name="robots"[^>]*>'
```

Expected: `404`, `content-type: text/html`, an HTML document, and the exported
404's noindex markup. A `200` SPA fallback is a failure for this static site.

### V5. Repeated hashed static-asset requests

```bash
seo_asset_path="$(curl --fail --silent --show-error "$SEO_ORIGIN/" | rg -o '/_next/static/[^"[:space:]]+\.(css|js)' | awk -F/ '{ asset_file_name = $NF; sub(/\.(css|js)$/, "", asset_file_name); asset_token_count = split(asset_file_name, asset_tokens, /[-_.]/); for (asset_token_index = 1; asset_token_index <= asset_token_count; asset_token_index += 1) { asset_token = asset_tokens[asset_token_index]; if (length(asset_token) >= 8 && asset_token ~ /^[A-Za-z0-9]+$/ && asset_token ~ /[A-Za-z]/ && asset_token ~ /[0-9]/) { print; exit } } }')"
test -n "$seo_asset_path" || { echo 'No same-origin /_next/static CSS or JS URL with a smoke-contract hash token was found in the homepage HTML.' >&2; exit 1; }
printf 'asset=%s\n' "$seo_asset_path"
curl --silent --show-error --dump-header - --output /dev/null "$SEO_ORIGIN$seo_asset_path" \
  | rg -i '^(HTTP/|cache-control:|cf-cache-status:|age:)'
curl --silent --show-error --dump-header - --output /dev/null "$SEO_ORIGIN$seo_asset_path" \
  | rg -i '^(HTTP/|cache-control:|cf-cache-status:|age:)'
```

Expected: both are `200`, `Cache-Control` has a positive browser `max-age`, and
the two `CF-Cache-Status` / `Age` values are recorded for review. Do not call a
cache configuration successful merely because a header Transform Rule changed
`Cache-Control`; Cloudflare evaluates edge caching earlier.

### V6. Complete repository production contract

```bash
pnpm seo:smoke
```

Expected: the command reports the HTTP redirect, 36 public HTML contracts,
robots, sitemap, HTML 404, required security headers, and a same-origin hashed
static asset cache header as passing. It is a production read-only check; its
failure is evidence of an external follow-up, not permission to change
Cloudflare automatically.
