import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

it("documents mandatory Cloudflare Email Sending and public site-key configuration", () => {
  const configurationGuide = readFileSync(
    join(process.cwd(), "workers", "README.md"),
    "utf8",
  );

  expect(configurationGuide).toContain(
    "You must restrict the binding's allowed sender address",
  );
  expect(configurationGuide).toContain(
    "You must set the binding's destination address",
  );
  expect(configurationGuide).toContain("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
});

it("routes only Contact traffic and supplies the Worker binding contract", () => {
  const workerConfiguration = JSON.parse(
    readFileSync(join(process.cwd(), "wrangler.jsonc"), "utf8"),
  ) as Readonly<{
    routes: readonly Readonly<{ custom_domain: boolean; pattern: string }>[];
    send_email: readonly Readonly<{ name: string }>[];
    vars: Readonly<Record<string, string>>;
  }>;

  expect(workerConfiguration.routes).toEqual([
    {
      custom_domain: false,
      pattern: "stardewvalleyplanner.art/api/contact*",
    },
  ]);
  expect(workerConfiguration.send_email).toEqual([{ name: "CONTACT_EMAIL" }]);
  expect(workerConfiguration.vars).toEqual({
    CONTACT_ALLOWED_ORIGIN: "https://stardewvalleyplanner.art",
    CONTACT_EXPECTED_TURNSTILE_HOSTNAME: "stardewvalleyplanner.art",
    CONTACT_TURNSTILE_ACTION: "turnstile-spin-v2",
  });
});
