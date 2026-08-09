"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  subscribeToHomepageLanguageMenuDismissal,
} from "@/src/homepage/homepage-language-menu-behavior";
import {
  HOMEPAGE_LOCALE_LABELS,
  HOMEPAGE_LOCALES,
} from "@/src/homepage/homepage-locale";
import type { HomepageLocaleHrefByLocale } from "@/src/homepage/homepage-navigation-url";

type HomepageLocaleSwitcherProps = {
  label: string;
  localeHrefByLocale: HomepageLocaleHrefByLocale;
};

export function HomepageLocaleSwitcher({
  label,
  localeHrefByLocale,
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
            <a
              data-homepage-language-option
              href={localeHrefByLocale[homepageLocale]}
            >
              {HOMEPAGE_LOCALE_LABELS[homepageLocale]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
