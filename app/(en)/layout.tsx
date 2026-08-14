import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
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
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SEKQT6DTT1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SEKQT6DTT1');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xwledpd5pa");
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
