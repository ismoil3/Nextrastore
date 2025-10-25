import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import Footer from "./components/shared/footer/footer";
import Header from "./components/shared/header/header";
import "./globals.css";

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
  title: "Buy smartphones: iPhone, Samsung, Xiaomi, Oppo Tajikistan",
  description:
    "Sarez online store — smartphones iPhone, Samsung, Xiaomi, Oppo, Tecno, Infinix and others at competitive prices with delivery to Tajikistan. Warranty and service.!",
  keywords: [
    "smartphones Tajikistan",
    "buy iPhone Dushanbe",
    "Samsung Galaxy Tajikistan",
    "Xiaomi Redmi online",
    "phones Dushanbe",
    "online phone store Tajikistan",
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
  authors: [{ name: "Sarez Team", url: "https://www.sarezmobile.com" }],
  publisher: "Sarez",
  creator: "Sarez Developers",
  generator: "Next.js",
  applicationName: "Sarez",
  category: "ecommerce",
  classification: "Smartphones, Mobile Phones, Electronics",
  icons: {
    icon: "/mini-logo.png",
  },

  metadataBase: new URL("https://www.sarezmobile.com"),
  openGraph: {
    title:
      "Sarez — Buy smartphones iPhone, Samsung, Xiaomi, Oppo and other brands",
    description:
      "Sarez — online smartphone store in Tajikistan. iPhone, Samsung, Xiaomi, Oppo, Realme, Huawei and other brands at low prices.",
    url: "https://www.sarezmobile.com",
    siteName: "Sarez",
    images: [
      {
        url: "/mini-logo.png",
        width: 1200,
        height: 630,
        alt: "Sarez — smartphones in Tajikistan",
      },
    ],
    locale: "ru_RU",
    type: "website",
    alternateLocale: ["tg_TJ", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarez — smartphones in Tajikistan",
    description:
      "Buy smartphones Apple iPhone, Samsung Galaxy, Xiaomi, Oppo and other brands online. Delivery to Tajikistan.",
    images: ["/mini-logo.png"],
    creator: "@Sarez",
    site: "@Sarez",
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
    canonical: "https://www.sarezmobile.com",
    languages: {
      "ru-RU": "https://www.sarezmobile.com",
    },
  },
  appleWebApp: {
    capable: true,
    title: "Sarez",
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
  appLinks: {
    ios: {
      url: "Sarez://home",
      app_store_id: "1234567890",
    },
    android: {
      url: "Sarez://home",
      package: "tj.Sarez.app",
    },
    web: {
      url: "https://www.sarezmobile.com",
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
        <Suspense fallback={<p>loading</p>}>
          <Header />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
