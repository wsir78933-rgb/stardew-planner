"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  applyHomepageLocaleSelection,
  subscribeToHomepageLanguageMenuDismissal,
} from "@/src/homepage/homepage-language-menu-behavior";
import {
  HOMEPAGE_LOCALE_LABELS,
  HOMEPAGE_LOCALES,
  type HomepageLocale,
} from "@/src/homepage/homepage-locale";

type HomepageLocaleSwitcherProps = {
  label: string;
  onLocaleChange: (homepageLocale: HomepageLocale) => void;
};

export function HomepageLocaleSwitcher({
  label,
  onLocaleChange,
}: HomepageLocaleSwitcherProps) {
  const languageMenuId = useId();
  const languageSwitcherRef = useRef<HTMLDivElement>(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  function closeLanguageMenu() {
    setIsLanguageMenuOpen(false);
  }

  function restoreTriggerFocus() {
    languageSwitcherRef.current
      ?.querySelector<HTMLButtonElement>("[data-homepage-language-trigger]")
      ?.focus();
  }

  function selectHomepageLocale(homepageLocale: HomepageLocale) {
    applyHomepageLocaleSelection({
      closeLanguageMenu,
      homepageLocale,
      onLocaleChange,
      restoreTriggerFocus,
    });
  }

  useEffect(() => {
    if (!isLanguageMenuOpen) {
      return;
    }

    return subscribeToHomepageLanguageMenuDismissal({
      closeLanguageMenu,
      eventSource: document,
      getLanguageSwitcherElement: () => languageSwitcherRef.current,
      restoreTriggerFocus,
    });
  }, [isLanguageMenuOpen]);

  return (
    <div data-homepage-language-switcher ref={languageSwitcherRef}>
      <Button
        aria-controls={languageMenuId}
        aria-expanded={isLanguageMenuOpen}
        aria-label={label}
        data-homepage-language-trigger
        onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
        type="button"
        variant="ghost"
      >
        Language <span aria-hidden="true">▾</span>
      </Button>
      <ul
        data-homepage-language-menu
        hidden={!isLanguageMenuOpen}
        id={languageMenuId}
      >
        {HOMEPAGE_LOCALES.map((homepageLocale) => (
          <li key={homepageLocale}>
            <button
              data-homepage-language-option
              onClick={() => selectHomepageLocale(homepageLocale)}
              type="button"
            >
              {HOMEPAGE_LOCALE_LABELS[homepageLocale]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
