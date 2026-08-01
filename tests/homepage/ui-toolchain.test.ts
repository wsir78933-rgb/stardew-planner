import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const readProjectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

const packageJson = JSON.parse(readProjectFile("package.json")) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

describe("homepage UI toolchain", () => {
  test("configures Tailwind's PostCSS plugin and shadcn primitives", () => {
    expect(readProjectFile("postcss.config.mjs")).toContain("@tailwindcss/postcss");
    expect(readProjectFile("components.json")).toContain("https://ui.shadcn.com/schema.json");
    expect(readProjectFile("components/ui/button.tsx")).toContain("Button");
    expect(readProjectFile("components/ui/accordion.tsx")).toContain("Accordion");
    expect(readProjectFile("app/(en)/layout.tsx")).not.toContain("next/font/google");
    expect(readProjectFile("app/globals.css")).not.toContain('shadcn/tailwind.css');
    expect(readProjectFile("app/globals.css")).not.toContain("@layer base");
    expect(readProjectFile("vitest.config.ts")).toContain('alias: { "@":');
    expect(packageJson.dependencies).not.toHaveProperty("shadcn");
    expect(packageJson.devDependencies).toHaveProperty("shadcn");
  });
});
