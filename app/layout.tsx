import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Footer from "./components/Footer";
 
const siteName = "CareerMed";
const siteUrl = "https://www.careermed.in";
const siteDescription =
  "India's leading healthcare job platform — Find verified doctor, nurse, technician & medical jobs at top hospitals, clinics, and diagnostic centres across India. Apply now on CareerMed.";
const siteTagline = "Healthcare Jobs & Medical Career Opportunities in India";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#155DFC",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — ${siteTagline}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  generator: "Next.js",
  creator: "CareerMed",
  publisher: "CareerMed",
  keywords: [
    "healthcare jobs",
    "medical jobs",
    "hospital jobs",
    "doctor jobs India",
    "nurse jobs India",
    "healthcare hiring",
    "medical careers",
    "CareerMed",
    "careermed.in",
    "healthcare recruitment India",
    "lab technician jobs",
    "pharmacist jobs",
    "hospital vacancies",
    "medical job portal",
    "healthcare job portal India",
  ],
  alternates: {
    canonical: "/",
  },
  category: "jobs",
  referrer: "origin-when-cross-origin",
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
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareerMed — India's #1 Healthcare Job Platform",
        type: "image/png",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@careermed",
    creator: "@careermed",
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareerMed — India's #1 Healthcare Job Platform",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon-32x32.png"],
    apple: [
      { url: "/icon-192x192.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    // Add your Google Search Console verification code here when available
    // google: "your-google-verification-code",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.careermed.in/#website",
        url: "https://www.careermed.in",
        name: "CareerMed",
        description:
          "India's leading healthcare job platform — Find verified doctor, nurse, technician & medical jobs at top hospitals, clinics, and diagnostic centres across India.",
        publisher: { "@id": "https://www.careermed.in/#organization" },
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://www.careermed.in/view-jobs?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.careermed.in/#organization",
        name: "CareerMed",
        url: "https://www.careermed.in",
        logo: {
          "@type": "ImageObject",
          url: "https://www.careermed.in/logo.png",
          width: 618,
          height: 203,
        },
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          email: "support@careermade.com",
          contactType: "customer support",
          availableLanguage: ["English", "Hindi"],
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&f[]=clash-display@400,500,600&display=swap"
          rel="stylesheet"
          precedence="default"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
