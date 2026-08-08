# Contact Worker configuration

This Worker owns only `POST /api/contact` on `stardewvalleyplanner.art`.

Set these values as Cloudflare Worker secrets. Do not add them to the repository:

- `TURNSTILE_SECRET`: the rotated Turnstile secret.
- `CONTACT_RECIPIENT_EMAIL`: the daily inbox that receives contact messages.
- `CONTACT_FROM_EMAIL`: a verified Email Sending sender address.

Keep the `CONTACT_EMAIL` Email Sending binding. You must restrict the binding's allowed sender address in the Cloudflare dashboard to the same address used by `CONTACT_FROM_EMAIL`. You must set the binding's destination address to the same inbox as `CONTACT_RECIPIENT_EMAIL`.

The static site must be built with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set in its Cloudflare build environment. It is the public Turnstile site key and must not be replaced by the secret key.

After the Worker is deployed, add a Cloudflare WAF or rate-limiting rule for `POST /api/contact` (for example, 5 requests per IP per 10 minutes).
