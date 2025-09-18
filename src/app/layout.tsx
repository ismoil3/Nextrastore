import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/shared/header/header";
import Footer from "./components/shared/footer/footer";
import { Suspense } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Купить смартфоны: iPhone, Samsung, Xiaomi, Oppo Таджикистан",
  description:
    "Интернет-магазин BestPrice — смартфоны iPhone, Samsung, Xiaomi, Oppo, Tecno, Infinix и другие по выгодным ценам с доставкой по Таджикистану. Гарантия и сервис.!",
  keywords: [
    "смартфоны Таджикистан",
    "купить iPhone Душанбе",
    "Samsung Galaxy Таджикистан",
    "Xiaomi Redmi онлайн",
    "телефоны Душанбе",
    "онлайн магазин телефонов Таджикистан",
    "Oppo",
    "Realme",
    "Tecno",
    "Infinix",
    "Vivo",
    "Huawei",
    "Honor",
    "Motorola",
    "Nokia",
    "Google Pixel",
  ],
  authors: [{ name: "BestPrice Team", url: "https://bestprice.tj" }],
  publisher: "BestPrice",
  creator: "BestPrice Developers",
  generator: "Next.js",
  applicationName: "BestPrice",
  category: "ecommerce",
  classification: "Smartphones, Mobile Phones, Electronics",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  metadataBase: new URL("https://bestprice.tj"),
  openGraph: {
    title:
      "BestPrice — Купить смартфоны iPhone, Samsung, Xiaomi, Oppo и другие бренды",
    description:
      "BestPrice — интернет-магазин смартфонов в Таджикистане. iPhone, Samsung, Xiaomi, Oppo, Realme, Huawei и другие бренды по низким ценам.",
    url: "https://bestprice.tj",
    siteName: "BestPrice",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BestPrice — смартфоны в Таджикистане",
      },
    ],
    locale: "ru_RU",
    type: "website",
    alternateLocale: ["tg_TJ", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BestPrice — смартфоны в Таджикистане",
    description:
      "Купить смартфоны Apple iPhone, Samsung Galaxy, Xiaomi, Oppo и другие бренды онлайн. Доставка по Таджикистану.",
    images: ["/og-image.jpg"],
    creator: "@bestprice",
    site: "@bestprice",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bestprice.tj",
    languages: {
      "ru-RU": "https://bestprice.tj",
    },
  },
  appleWebApp: {
    capable: true,
    title: "BestPrice",
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
  appLinks: {
    ios: {
      url: "bestprice://home",
      app_store_id: "1234567890",
    },
    android: {
      url: "bestprice://home",
      package: "tj.bestprice.app",
    },
    web: {
      url: "https://bestprice.tj",
      should_fallback: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<p>loading</p>}><Header/></Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
