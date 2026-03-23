import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gaid Trip — Tu guía de viajes con IA",
  description:
    "Itinerarios personalizados con IA, compañeros de viaje, experiencias únicas. Planifica tu próximo viaje con Gaid Trip.",
  keywords: [
    "viajes",
    "itinerario",
    "inteligencia artificial",
    "planificar viaje",
    "compañeros de viaje",
    "travel planner",
    "AI travel",
  ],
  authors: [{ name: "Gaid Trip" }],
  openGraph: {
    title: "Gaid Trip — Tu guía de viajes con IA",
    description:
      "Itinerarios personalizados con IA, compañeros de viaje, experiencias únicas.",
    url: "https://gaidtrip.com",
    siteName: "Gaid Trip",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaid Trip — Tu guía de viajes con IA",
    description:
      "Itinerarios personalizados con IA, compañeros de viaje, experiencias únicas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
