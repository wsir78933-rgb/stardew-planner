import { describe, expect, it } from "vitest";
import enMessages from "../../messages/en.json";
import { StaticLocaleProvider } from "../../src/i18n/static-locale-provider";

describe("static locale provider", () => {
  it("rejects an unsupported runtime locale before rendering", () => {
    expect(() =>
      StaticLocaleProvider({
        children: null,
        locale: "fr" as never,
        messages: enMessages,
      }),
    ).toThrow('site locale "fr" is not supported');
  });
});
