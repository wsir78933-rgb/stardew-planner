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

it("publishes the static export while retaining the Contact Worker contract", () => {
  const workerConfiguration = JSON.parse(
    readFileSync(join(process.cwd(), "wrangler.jsonc"), "utf8"),
  ) as Readonly<{
    assets: Readonly<{
      binding: string;
      directory: string;
      html_handling: string;
      not_found_handling: string;
    }>;
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
  expect(workerConfiguration.assets).toEqual({
    binding: "STATIC_ASSETS",
    directory: "./out",
    html_handling: "auto-trailing-slash",
    not_found_handling: "404-page",
  });
  expect(workerConfiguration.send_email).toEqual([{ name: "CONTACT_EMAIL" }]);
  expect(workerConfiguration.vars).toEqual({
    CONTACT_ALLOWED_ORIGIN: "https://stardewvalleyplanner.art",
    CONTACT_EXPECTED_TURNSTILE_HOSTNAME: "stardewvalleyplanner.art",
    CONTACT_TURNSTILE_ACTION: "turnstile-spin-v2",
  });
});
