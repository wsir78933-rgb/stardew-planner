import { describe, expect, it } from "vitest";
import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh-CN.json";
import {
  getMessageKeyPaths,
  getSiteMessages,
} from "../../src/i18n/messages";

describe("site messages", () => {
  it("keeps English and Chinese message leaf-key paths aligned", () => {
    expect(getMessageKeyPaths(enMessages)).toEqual(getMessageKeyPaths(zhMessages));
  });

  it("returns the message tree for the requested explicit locale", () => {
    expect(getSiteMessages("en")).toEqual(enMessages);
    expect(getSiteMessages("zh-CN")).toEqual(zhMessages);
  });

  it("rejects non-string message leaves with the offending value", () => {
    expect(() => getMessageKeyPaths({ navigation: { home: 1 } })).toThrow(
      'message value at "navigation.home" must be a string; received 1',
    );
  });
});
