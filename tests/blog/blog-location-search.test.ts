import { expect, it } from "vitest";
import {
  getBlogArchivePageParameterFromLocationSearch,
  getBlogHomeSearchParametersFromLocationSearch,
} from "../../src/blog/blog-location-search";

it("projects home query parameters from a browser location search string", () => {
  expect(
    getBlogHomeSearchParametersFromLocationSearch(
      "?q=%20Robin%20&topic=Stardew+Valley+Guides&visible=12",
    ),
  ).toEqual({
    q: " Robin ",
    topic: "Stardew Valley Guides",
    visible: "12",
  });
});

it("omits unavailable home query parameters from a browser location search string", () => {
  expect(getBlogHomeSearchParametersFromLocationSearch("?q=Robin")).toEqual({
    q: "Robin",
  });
});

it("uses the first archive page value from a browser location search string", () => {
  expect(
    getBlogArchivePageParameterFromLocationSearch("?page=2&page=3"),
  ).toBe("2");
});

it("returns undefined when a browser location search string has no archive page", () => {
  expect(getBlogArchivePageParameterFromLocationSearch("?q=Robin")).toBeUndefined();
});
