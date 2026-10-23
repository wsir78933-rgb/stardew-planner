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
    d1_databases: readonly Readonly<{
      binding: string;
      database_id: string;
      database_name: string;
      migrations_dir: string;
    }>[];
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
      custom_domain: false,
      pattern: "stardewvalleyplanner.art/api/auth*",
    },
    {
      custom_domain: false,
      pattern: "stardewvalleyplanner.art/api/cloud-projects*",
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
  expect(workerConfiguration.d1_databases).toHaveLength(1);
  const [d1DatabaseBinding] = workerConfiguration.d1_databases;
  if (d1DatabaseBinding === undefined) {
    throw new Error(
      `Expected one local D1 binding, received ${JSON.stringify(workerConfiguration.d1_databases)}.`,
    );
  }
  expect(d1DatabaseBinding.binding).toBe("DB");
  expect(d1DatabaseBinding.database_name).toBe("stardew-planner");
  expect(d1DatabaseBinding.database_id).toBe("6cf9f831-c7b6-4349-b1ff-8c6c0f1ff9a5");
  expect(d1DatabaseBinding.migrations_dir).toBe("./migrations");
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
    BETTER_AUTH_URL: "https://stardewvalleyplanner.art",
    AUTH_ALLOWED_ORIGINS: "https://stardewvalleyplanner.art",
  });
});
