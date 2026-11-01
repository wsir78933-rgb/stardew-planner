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
    account_id: string;
    main: string;
    compatibility_date: string;
    compatibility_flags: readonly string[];
    assets: Readonly<{
      binding: string;
      directory: string;
      html_handling: string;
      not_found_handling: string;
      run_worker_first: readonly string[];
    }>;
    routes: readonly Readonly<{ custom_domain: boolean; pattern: string }>[];
    send_email: readonly Readonly<{
      name: string;
      allowed_sender_addresses: readonly string[];
      destination_address: string;
    }>[];
    vars: Readonly<Record<string, string>>;
  }>;

  expect(workerConfiguration.routes).toEqual([
    {
      custom_domain: false,
      pattern: "stardewvalleyplanner.art/api/contact*",
    },
    {
      custom_domain: false,
      pattern: "stardewvalleyplanner.art/api/feedback*",
    },
    {
      custom_domain: true,
      pattern: "stardewvalleyplanner.art",
    },
  ]);
  expect(workerConfiguration.account_id).toBe("c75d13cb32903c8f0ec7948f6c91c9ed");
  expect(workerConfiguration.main).toBe("workers/planner-worker.ts");
  expect(workerConfiguration.compatibility_date).toBe("2026-08-08");
  expect(workerConfiguration.compatibility_flags).toContain("nodejs_compat");
  expect(workerConfiguration).not.toHaveProperty("d1_databases");
  expect(workerConfiguration.assets).toEqual({
    binding: "STATIC_ASSETS",
    directory: "./out",
    html_handling: "auto-trailing-slash",
    not_found_handling: "404-page",
    run_worker_first: ["/api/*"],
  });
  expect(workerConfiguration.send_email).toHaveLength(1);
  const [contactEmailBinding] = workerConfiguration.send_email;
  if (contactEmailBinding === undefined) {
    throw new Error(
      `Expected one Contact Email Sending binding, received ${JSON.stringify(workerConfiguration.send_email.map(({ name }) => name))}.`,
    );
  }
  expect(contactEmailBinding.name).toBe("CONTACT_EMAIL");
  expect(contactEmailBinding.allowed_sender_addresses).toHaveLength(1);
  expect(contactEmailBinding.allowed_sender_addresses[0]).toMatch(
    /^[^@\s]+@stardewvalleyplanner\.art$/,
  );
  expect(contactEmailBinding.destination_address).toMatch(
    /^[^@\s]+@[^@\s.]+(?:\.[^@\s.]+)+$/,
  );
  expect(workerConfiguration.vars).toEqual({
    CONTACT_ALLOWED_ORIGIN: "https://stardewvalleyplanner.art",
    CONTACT_EXPECTED_TURNSTILE_HOSTNAME: "stardewvalleyplanner.art",
    CONTACT_TURNSTILE_ACTION: "turnstile-spin-v2",
  });
});
