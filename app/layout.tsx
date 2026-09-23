import type { Metadata } from "next";
import Script from "next/script";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/navigation/Header";

import "./globals.css";

const SITE_URL = "https://www.savartus.com";
const GOOGLE_ANALYTICS_ID = "G-5ZF3GGF439";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: "Savartus",

  title: {
    default: "Savartus | Manage. Store. Preserve.",
    template: "%s | Savartus",
  },

  description:
    "Savartus provides Active Archive, Preservation, and Data Lifecycle Management solutions for managing, storing, governing, and preserving enterprise information.",

  authors: [
    {
      name: "Savartus",
      url: SITE_URL,
    },
  ],

  creator: "Savartus",
  publisher: "Savartus",

  category: "Enterprise Data Management",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Savartus",
    title: "Savartus | Manage. Store. Preserve.",
    description:
      "Active Archive, Preservation, and Data Lifecycle Management solutions for enterprise information.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Savartus | Manage. Store. Preserve.",
    description:
      "Active Archive, Preservation, and Data Lifecycle Management solutions for enterprise information.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

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