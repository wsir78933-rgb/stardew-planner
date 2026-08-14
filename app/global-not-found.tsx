import type { Metadata } from "next";
import { publicSiteUrl } from "../src/seo/public-site-url";
import "./globals.css";

export const metadata: Metadata = {
  title: "404: This page could not be found.",
  metadataBase: publicSiteUrl,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
          }}
        >
          <h1>404</h1>
          <p>This page could not be found.</p>
        </main>
      </body>
    </html>
  );
}
