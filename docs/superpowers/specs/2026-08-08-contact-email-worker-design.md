# Contact Form and Email Worker Design

## Goal

Add bilingual, noindex Contact pages that let visitors send a message from the site to the operator's daily inbox without exposing credentials or adding a database.

## Approved behavior

- Render `/contact` and `/zh/contact`; both are static pages with canonical and language alternates, `noindex`, and no sitemap entry.
- Add Contact Us / 联系我们 to the existing Legal footer group.
- Reproduce the supplied form language: near-black page, thin dividers, large rounded form card, two desktop fields that stack on small screens, textarea, and gold submit button.
- Require name, email, and message. Submit with same-origin `POST /api/contact`.
- Use invisible Turnstile. The public site key is supplied only at build time; its secret is a Worker secret.
- Deliver messages directly to the operator's daily inbox. Store no database records and delete received messages after resolution, no later than 90 days.

## Architecture

The static Next export owns pages, metadata, CSS, footer navigation, and the browser form. A separate Cloudflare Worker owns the POST boundary. It accepts only the approved origin and JSON schema, validates Turnstile server-side, and sends plain-text mail through a restricted Email Sending binding. The inbox is never client-provided.

## Security and privacy

- The worker accepts only `POST /api/contact`, a strict `application/json` body, and origin `https://stardewvalleyplanner.art`.
- The request schema contains only `name`, `email`, `message`, and `turnstileToken`; limits are 100, 254, 2,000, and 2,048 characters.
- It checks Turnstile `success`, hostname, and `contact` action before sending mail. It returns generic error categories and does not log message contents, tokens, addresses, or secrets.
- The Worker uses `TURNSTILE_SECRET` and `CONTACT_RECIPIENT_EMAIL` as secrets, `CONTACT_FROM_EMAIL` as a non-secret Worker variable, and `CONTACT_EMAIL` as the Email Sending binding. No real value is committed.
- Privacy and Terms describe Cloudflare Email Service, the delivery purpose, and the 90-day maximum retention.

## Out of scope

- The frozen reference runtime, planner/editor behavior, account features, databases, attachments, analytics, dashboard changes, DNS, deployment, commits, and unrelated working-tree changes.

## Verification

- Test the Contact page route, metadata, sitemap exclusion, footer links, copy, request validation, Worker failures, and successful send path.
- Run focused Vitest tests, `pnpm typecheck`, and `pnpm build`.
- Use a browser against the built static page for layout and interaction. The existing full-suite baseline failures remain out of scope and will be reported separately.
