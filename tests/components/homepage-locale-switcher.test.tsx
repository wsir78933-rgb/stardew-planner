import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import { HomepageLocaleSwitcher } from "@/src/components/homepage-locale-switcher";
import {
  applyHomepageLocaleSelection,
  dismissHomepageLanguageMenuOnEscape,
  subscribeToHomepageLanguageMenuDismissal,
  shouldCloseHomepageLanguageMenuFromPointer,
  type HomepageLanguageMenuEventSource,
} from "@/src/homepage/homepage-language-menu-behavior";

type RegisteredHomepageLanguageMenuEventListener = {
  eventType: "keydown" | "pointerdown";
  listener: EventListener;
};

function createHomepageLanguageMenuEventSource() {
  const addedEventListeners: RegisteredHomepageLanguageMenuEventListener[] = [];
  const removedEventListeners: RegisteredHomepageLanguageMenuEventListener[] = [];
  const eventSource = {
    addEventListener(
      eventType: "keydown" | "pointerdown",
      listener: EventListener,
    ) {
      addedEventListeners.push({ eventType, listener });
    },
    removeEventListener(
      eventType: "keydown" | "pointerdown",
      listener: EventListener,
    ) {
      removedEventListeners.push({ eventType, listener });
    },
  } satisfies HomepageLanguageMenuEventSource;

  function dispatchEvent(
    eventType: "keydown" | "pointerdown",
    event: Event,
  ) {
    const eventListener = addedEventListeners.find(
      (registeredEventListener) => registeredEventListener.eventType === eventType,
    )?.listener;

    if (eventListener === undefined) {
      throw new Error(`No ${eventType} listener was registered.`);
    }

    eventListener(event);
  }

  return {
    addedEventListeners,
    dispatchKeyDown: (keyboardKey: string) => {
      dispatchEvent("keydown", { key: keyboardKey } as unknown as Event);
    },
    dispatchPointerDown: (pointerTarget: EventTarget | null) => {
      dispatchEvent("pointerdown", { target: pointerTarget } as Event);
    },
    eventSource,
    removedEventListeners,
  };
}

test("renders a closed language disclosure with unmarked locale options", () => {
  const onLocaleChange = vi.fn();
  const markup = renderToStaticMarkup(
    <HomepageLocaleSwitcher label="Language" onLocaleChange={onLocaleChange} />,
  );

  expect(markup).toContain('aria-label="Language"');
  expect(markup).toContain(">Language <span aria-hidden=\"true\">▾</span><");
  expect(markup).toContain("中文");
  expect(markup).toContain("English");
  expect(markup).toContain('aria-expanded="false"');
  expect(markup).toContain("aria-controls=");
  expect(markup).toContain("<ul");
  expect(markup).toContain("hidden=\"\"");
  expect(markup).not.toContain("aria-current");
  expect(markup).not.toContain("aria-pressed");
});

test("applies locale selection before closing the language menu and restoring focus", () => {
  const actionOrder: string[] = [];
  const onLocaleChange = vi.fn((homepageLocale) => {
    actionOrder.push(`locale:${homepageLocale}`);
  });

  applyHomepageLocaleSelection({
    closeLanguageMenu: () => actionOrder.push("close"),
    homepageLocale: "zh-CN",
    onLocaleChange,
    restoreTriggerFocus: () => actionOrder.push("focus"),
  });

  expect(onLocaleChange).toHaveBeenCalledExactlyOnceWith("zh-CN");
  expect(actionOrder).toEqual(["locale:zh-CN", "close", "focus"]);
});

test("closes and restores trigger focus only when Escape dismisses the language menu", () => {
  const actionOrder: string[] = [];
  const closeLanguageMenu = () => actionOrder.push("close");
  const restoreTriggerFocus = () => actionOrder.push("focus");

  expect(
    dismissHomepageLanguageMenuOnEscape({
      closeLanguageMenu,
      keyboardKey: "Enter",
      restoreTriggerFocus,
    }),
  ).toBe(false);
  expect(actionOrder).toEqual([]);

  expect(
    dismissHomepageLanguageMenuOnEscape({
      closeLanguageMenu,
      keyboardKey: "Escape",
      restoreTriggerFocus,
    }),
  ).toBe(true);
  expect(actionOrder).toEqual(["close", "focus"]);
});

test("closes the language menu only for a pointer target outside its switcher", () => {
  const languageMenuPointerTarget = {} as Node;
  const outsidePointerTarget = {} as Node;
  const languageSwitcherElement = {
    contains: (pointerTarget: Node) => pointerTarget === languageMenuPointerTarget,
  } as Pick<Node, "contains">;

  expect(
    shouldCloseHomepageLanguageMenuFromPointer({
      languageSwitcherElement,
      pointerTarget: null,
    }),
  ).toBe(false);
  expect(
    shouldCloseHomepageLanguageMenuFromPointer({
      languageSwitcherElement,
      pointerTarget: languageMenuPointerTarget,
    }),
  ).toBe(false);
  expect(
    shouldCloseHomepageLanguageMenuFromPointer({
      languageSwitcherElement,
      pointerTarget: outsidePointerTarget,
    }),
  ).toBe(true);
});

test("subscribes, routes dismissal events, and removes the same listeners once", () => {
  const eventSource = createHomepageLanguageMenuEventSource();
  const actionOrder: string[] = [];
  const languageMenuPointerTarget = { nodeType: 1 } as Node;
  const outsidePointerTarget = { nodeType: 1 } as Node;
  const languageSwitcherElement = {
    contains: (pointerTarget: Node) => pointerTarget === languageMenuPointerTarget,
  } as Pick<Node, "contains">;

  const cleanupLanguageMenuDismissal = subscribeToHomepageLanguageMenuDismissal({
    closeLanguageMenu: () => actionOrder.push("close"),
    eventSource: eventSource.eventSource,
    getLanguageSwitcherElement: () => languageSwitcherElement,
    restoreTriggerFocus: () => actionOrder.push("focus"),
  });

  expect(eventSource.addedEventListeners).toHaveLength(2);
  expect(eventSource.addedEventListeners.map(({ eventType }) => eventType)).toEqual([
    "pointerdown",
    "keydown",
  ]);

  eventSource.dispatchPointerDown(languageMenuPointerTarget);
  expect(actionOrder).toEqual([]);

  eventSource.dispatchPointerDown(outsidePointerTarget);
  expect(actionOrder).toEqual(["close"]);

  eventSource.dispatchKeyDown("Enter");
  expect(actionOrder).toEqual(["close"]);

  eventSource.dispatchKeyDown("Escape");
  expect(actionOrder).toEqual(["close", "close", "focus"]);

  cleanupLanguageMenuDismissal();
  cleanupLanguageMenuDismissal();

  expect(eventSource.removedEventListeners).toHaveLength(2);
  expect(eventSource.removedEventListeners).toEqual(
    eventSource.addedEventListeners,
  );
});
