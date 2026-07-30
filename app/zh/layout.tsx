import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { StaticLocaleProvider } from "../../src/i18n/static-locale-provider";
import { getSiteMessages } from "../../src/i18n/messages";

type ChineseRootLayoutProperties = Readonly<{
  children: ReactNode;
}>;

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
  },
};

export default function ChineseRootLayout({ children }: ChineseRootLayoutProperties) {
  return (
    <html lang="zh-CN">
      <body>
        <StaticLocaleProvider locale="zh-CN" messages={getSiteMessages("zh-CN")}>
          {children}
        </StaticLocaleProvider>
      </body>
    </html>
  );
}
