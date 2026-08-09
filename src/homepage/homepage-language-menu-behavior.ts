type HomepageLanguageMenuCloseActions = {
  closeLanguageMenu: () => void;
  restoreTriggerFocus: () => void;
};

type HomepageLanguageMenuEscapeDismissal = HomepageLanguageMenuCloseActions & {
  keyboardKey: string;
};

type HomepageLanguageMenuPointerDismissal = {
  languageSwitcherElement: Pick<Node, "contains"> | null;
  pointerTarget: Node | null;
};

export type HomepageLanguageMenuEventSource = {
  addEventListener: (
    eventType: "keydown" | "pointerdown",
    listener: EventListener,
  ) => void;
  removeEventListener: (
    eventType: "keydown" | "pointerdown",
    listener: EventListener,
  ) => void;
};

type HomepageLanguageMenuDismissalSubscription =
  HomepageLanguageMenuCloseActions & {
    eventSource: HomepageLanguageMenuEventSource;
    getLanguageSwitcherElement: () => Pick<Node, "contains"> | null;
  };

export function dismissHomepageLanguageMenuOnEscape({
  closeLanguageMenu,
  keyboardKey,
  restoreTriggerFocus,
}: HomepageLanguageMenuEscapeDismissal): boolean {
  if (keyboardKey !== "Escape") {
    return false;
  }

  closeLanguageMenu();
  restoreTriggerFocus();
  return true;
}

export function shouldCloseHomepageLanguageMenuFromPointer({
  languageSwitcherElement,
  pointerTarget,
}: HomepageLanguageMenuPointerDismissal): boolean {
  return (
    pointerTarget !== null && !languageSwitcherElement?.contains(pointerTarget)
  );
}

export function subscribeToHomepageLanguageMenuDismissal({
  closeLanguageMenu,
  eventSource,
  getLanguageSwitcherElement,
  restoreTriggerFocus,
}: HomepageLanguageMenuDismissalSubscription): () => void {
  function closeWhenPointerIsOutside(pointerEvent: Event) {
    const pointerTarget = getNodePointerTarget(pointerEvent.target);

    if (
      shouldCloseHomepageLanguageMenuFromPointer({
        languageSwitcherElement: getLanguageSwitcherElement(),
        pointerTarget,
      })
    ) {
      closeLanguageMenu();
    }
  }

  function closeWhenEscapeIsPressed(keyboardEvent: Event) {
    const keyboardKey = getKeyboardEventKey(keyboardEvent);

    if (keyboardKey === null) {
      return;
    }

    dismissHomepageLanguageMenuOnEscape({
      closeLanguageMenu,
      keyboardKey,
      restoreTriggerFocus,
    });
  }

  eventSource.addEventListener("pointerdown", closeWhenPointerIsOutside);
  eventSource.addEventListener("keydown", closeWhenEscapeIsPressed);

  let isSubscribed = true;

  return () => {
    if (!isSubscribed) {
      return;
    }

    eventSource.removeEventListener("pointerdown", closeWhenPointerIsOutside);
    eventSource.removeEventListener("keydown", closeWhenEscapeIsPressed);
    isSubscribed = false;
  };
}

function getKeyboardEventKey(event: Event): string | null {
  if (!("key" in event) || typeof event.key !== "string") {
    return null;
  }

  return event.key;
}

function getNodePointerTarget(eventTarget: EventTarget | null): Node | null {
  if (
    eventTarget === null ||
    typeof eventTarget !== "object" ||
    !("nodeType" in eventTarget)
  ) {
    return null;
  }

  return eventTarget as Node;
}
