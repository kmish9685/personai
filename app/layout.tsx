import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://personai.fun'),
  title: "Persona AI - Stop Chatting. Start Deciding.",
  description: "GPTs give you options. Persona AI gives you answers. Simulate the minds of Musk, Naval, and Graham to make better decisions. The AI decision engine for founders, CEOs, and builders.",
  keywords: [
    "AI decision engine",
    "founder decision tool",
    "analysis paralysis",
    "mental models AI",
    "Naval Ravikant AI",
    "Elon Musk AI",
    "Paul Graham AI",
    "startup decision maker",
    "binary verdict AI",
    "kill signals startup",
    "decision framework tool",
    "ChatGPT alternative for founders",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://personai.fun',
  },
  openGraph: {
    title: "Persona AI - Stop Chatting. Start Deciding.",
    description: "GPTs give you options. Persona AI gives you answers. Simulate the minds of Musk, Naval, and Graham to make better decisions.",
    type: "website",
    url: 'https://personai.fun',
    siteName: 'Persona AI',
  },
  twitter: {
    card: "summary_large_image",
    title: "Persona AI - Stop Chatting. Start Deciding.",
    description: "GPTs give you options. Persona AI gives you answers. Simulate the minds of Musk, Naval, and Graham to make better decisions.",
    creator: "@kom556555",
  },
  icons: {
    icon: '/logo.png',
  },
};

import { AuthProvider } from '@/src/contexts/AuthContext';
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { AffiliateTracker } from "@/components/AffiliateTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Fontshare CDN — Clash Display + Cabinet Grotesk */}
          <link
            href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@100,200,300,400,500,700,800,900&display=swap"
            rel="stylesheet"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Persona AI",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web browser",
                "description": "Persona AI is an AI application and decision-making engine that simulates the strategic thinking of experts like Elon Musk, Naval Ravikant, and Paul Graham. Unlike generic chatbots or entertainment AIs, Persona AI is a specialized tool for entrepreneurs, founders, and professionals to get direct, actionable answers instead of conversational options.",
                "offers": {
                  "@type": "Offer",
                  "price": "99.00",
                  "priceCurrency": "INR"
                }
              })
            }}
          />
        </head>
        <body className="antialiased">
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-DGFC27782F"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DGFC27782F');
            `}
          </Script>

          <Suspense fallback={null}>
            <AffiliateTracker />
          </Suspense>

          <AuthProvider>
            {children}
          </AuthProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
