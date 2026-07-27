import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stardew Valley Farm Planner",
  icons: {
    icon: "/favicon.ico",
  },
};

type RootLayoutProperties = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProperties) {
  return (
    <html lang="en">
      <body data-sveltekit-preload-data="hover">{children}</body>
    </html>
  );
}
