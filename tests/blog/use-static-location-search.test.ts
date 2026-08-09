import { afterEach, expect, it, vi } from "vitest";
import {
  getBrowserLocationSearch,
  getServerLocationSearch,
  subscribeToBrowserLocationSearch,
} from "../../src/components/blog/use-static-location-search";

function installBrowserLocation(search: string) {
  const browserEventTarget = new EventTarget();
  const addEventListener = vi.fn(
    (eventName: string, eventListener: EventListenerOrEventListenerObject) => {
      browserEventTarget.addEventListener(eventName, eventListener);
    },
  );
  const removeEventListener = vi.fn(
    (eventName: string, eventListener: EventListenerOrEventListenerObject) => {
      browserEventTarget.removeEventListener(eventName, eventListener);
    },
  );

  vi.stubGlobal("window", {
    addEventListener,
    location: { search },
    removeEventListener,
  });

  return { addEventListener, browserEventTarget, removeEventListener };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("reads the current browser location search", () => {
  installBrowserLocation("?q=Robin");

  expect(getBrowserLocationSearch()).toBe("?q=Robin");
});

it("returns an empty location search for server rendering", () => {
  expect(getServerLocationSearch()).toBe("");
});

it("subscribes to popstate and removes the same listener during cleanup", () => {
  const { addEventListener, browserEventTarget, removeEventListener } = installBrowserLocation(
    "?topic=Stardew+Valley+Guides",
  );
  const onStoreChange = vi.fn();

  const stopSubscription = subscribeToBrowserLocationSearch(onStoreChange);

  expect(addEventListener).toHaveBeenCalledWith("popstate", onStoreChange);
  browserEventTarget.dispatchEvent(new Event("popstate"));
  expect(onStoreChange).toHaveBeenCalledTimes(1);

  stopSubscription();

  expect(removeEventListener).toHaveBeenCalledWith("popstate", onStoreChange);
  browserEventTarget.dispatchEvent(new Event("popstate"));
  expect(onStoreChange).toHaveBeenCalledTimes(1);
});
