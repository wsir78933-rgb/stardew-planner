import { describe, expect, test } from "vitest";
import {
  DEFAULT_HOMEPAGE_LOCALE,
  getStoredHomepageLocale,
  saveHomepageLocale,
} from "@/src/homepage/homepage-locale";

const createStorage = (storedValue: string | null): Storage => ({
  getItem: () => storedValue,
  setItem: () => undefined,
} as unknown as Storage);

describe("homepage locale storage", () => {
  test("falls back when storage contains an unsupported locale", () => {
    expect(getStoredHomepageLocale(createStorage("fr-FR"))).toBe(DEFAULT_HOMEPAGE_LOCALE);
  });

  test("keeps the approved Chinese locale", () => {
    expect(getStoredHomepageLocale(createStorage("zh-CN"))).toBe("zh-CN");
  });

  test("rejects attempts to persist an unsupported locale", () => {
    expect(() => saveHomepageLocale(createStorage(null), "fr-FR" as never)).toThrow(
      'Unsupported homepage locale: "fr-FR"',
    );
  });
});
