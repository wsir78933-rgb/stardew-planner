import type { Metadata } from "next";
import type { ReactNode } from "react";
import { publicSiteUrl } from "../../src/seo/public-site-url";
import "../globals.css";

export const metadata: Metadata = {
  title: "Stardew Valley Farm Planner",
  description:
    "Plan Stardew Valley farm layouts in your browser with an interactive map.",
  metadataBase: publicSiteUrl,
  icons: {
    icon: "/favicon.ico",
  },
};

type RootLayoutProperties = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProperties) {
  return (
    <html lang="zh-CN">
      <body data-sveltekit-preload-data="hover">{children}</body>
    </html>
  );
}
