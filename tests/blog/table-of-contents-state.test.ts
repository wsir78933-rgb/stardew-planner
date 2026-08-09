import { expect, it, vi } from "vitest";
import { createUniqueHeadingAnchors } from "../../src/blog/table-of-contents-state";

it("creates Unicode-aware, deterministic anchors for duplicate headings", () => {
  expect(
    createUniqueHeadingAnchors([
      "Robin's Shop Hours",
      "Robin's Shop Hours",
      "罗宾的商店时间",
      "罗宾的商店时间",
      "---",
      "---",
    ]),
  ).toEqual([
    "robin-s-shop-hours",
    "robin-s-shop-hours-2",
    "罗宾的商店时间",
    "罗宾的商店时间-2",
    "section",
    "section-2",
  ]);
});

it("uses locale-independent lowercasing for Latin heading anchors", () => {
  const localeLowercaseSpy = vi
    .spyOn(String.prototype, "toLocaleLowerCase")
    .mockReturnValue("ı");

  try {
    expect(createUniqueHeadingAnchors(["I"])).toEqual(["i"]);
  } finally {
    localeLowercaseSpy.mockRestore();
  }
});
