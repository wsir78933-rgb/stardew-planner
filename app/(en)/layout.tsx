import type { ReactNode } from "react";
import "../globals.css";
import { StaticLocaleProvider } from "../../src/i18n/static-locale-provider";
import { getSiteMessages } from "../../src/i18n/messages";

type EnglishRootLayoutProperties = Readonly<{
  children: ReactNode;
}>;

export default function EnglishRootLayout({ children }: EnglishRootLayoutProperties) {
  return (
    <html lang="en">
      <body>
        <StaticLocaleProvider locale="en" messages={getSiteMessages("en")}>
          {children}
        </StaticLocaleProvider>
      </body>
    </html>
  );
}
