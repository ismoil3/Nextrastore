import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/shared/header/header";
import Footer from "./components/shared/footer/footer";

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
  title:
    "NexaStore - Магазин смартфонов: iPhone, Samsung, Xiaomi, Oppo и другие",
  description: `Добро пожаловать в NexaStore! У нас вы найдете Apple iPhone, Samsung Galaxy, Xiaomi Redmi, Oppo, Tecno, Infinix, Realme, Vivo, Huawei, Honor, Google Pixel, Sony Xperia, Motorola, Nokia и другие телефоны.
  Лучший выбор, выгодные цены, гарантия качества!`,
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
