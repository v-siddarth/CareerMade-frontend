import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Footer from "./components/Footer";
 
const siteName = "CareerMed";
const siteUrl = "https://www.careermed.in";
const siteDescription =
  "CareerMed connects healthcare professionals with verified hospital, clinic, diagnostics, and medical employer opportunities across India.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Healthcare Jobs & Medical Career Opportunities`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "healthcare jobs",
    "medical jobs",
    "hospital jobs",
    "doctor jobs",
    "nurse jobs",
    "healthcare hiring",
    "medical careers",
    "CareerMed",
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
    title: `${siteName} | Healthcare Jobs & Medical Career Opportunities`,
    description: siteDescription,
    images: [
      {
        url: "/image.png",
        width: 1280,
        height: 800,
        alt: `${siteName} platform preview`,
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Healthcare Jobs & Medical Career Opportunities`,
    description: siteDescription,
    images: ["/image.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "618x203" },
      { url: "/logo.png", rel: "shortcut icon" },
    ],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png", sizes: "618x203", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&f[]=clash-display@400,500,600&display=swap"
          rel="stylesheet"
          precedence="default"
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
