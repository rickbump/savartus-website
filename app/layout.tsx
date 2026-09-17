import type { Metadata } from "next";
import Script from "next/script";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/navigation/Header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Savartus | Manage. Store. Preserve.",
    template: "%s | Savartus",
  },
  description:
    "Savartus provides Active Archive, Preservation, and Data Lifecycle Management solutions for managing, storing, and preserving information.",
};

const GOOGLE_ANALYTICS_ID = "G-5ZF3GGF439";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Header />

        {children}

        <Footer />

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', '${GOOGLE_ANALYTICS_ID}', {
              send_page_view: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}
