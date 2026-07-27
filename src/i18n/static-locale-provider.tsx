"use client";

import { NextIntlClientProvider } from "next-intl";
import type { PropsWithChildren } from "react";
import { assertSiteLocale, type SiteLocale } from "./locales";
import type { getSiteMessages } from "./messages";

type StaticLocaleProviderProps = PropsWithChildren<{
  locale: SiteLocale;
  messages: ReturnType<typeof getSiteMessages>;
}>;

export function StaticLocaleProvider({
  children,
  locale,
  messages,
}: StaticLocaleProviderProps) {
  assertSiteLocale(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
