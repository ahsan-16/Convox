import type { Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { buildRootMetadata } from "@/lib/seo";
import Script from "next/script";

export const metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: "#00D084",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-2722637490463810"></meta>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,600&f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
          fetchPriority="low"
        />
          <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2722637490463810"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script
    id="monetag-inpage-push"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11449977',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
  />
      </head>
      <body>
        {children}
        <GoogleAnalytics />
        <MicrosoftClarity />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1C2028",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#F0F2F5",
              fontFamily: "Satoshi, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
