import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { AuthProvider } from "@/components/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: "#165b33",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AgriPulse (किसानमित्र) | AI Mandi Prices, Precision Soil Engine & Decision Support",
  description: "Free digital platform for Indian farmers: Live APMC Mandi prices, 14-day ML price forecasting, ICAR-approved fertilizer regimens, and multilingual voice AI assistant on WhatsApp and Web.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#165b33" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f4f6f4] text-gray-900 font-sans selection:bg-emerald-600 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

