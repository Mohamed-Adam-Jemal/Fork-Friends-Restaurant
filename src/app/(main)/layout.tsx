import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navigation from "@/components/Navigation";
import { CartProvider } from "@/context/CartContext";
import {Footer} from '@/components/Footer';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fork & Friends Restaurant",
  description: "Delicious meals crafted with love — your cozy spot for fresh flavors, friendly vibes, and unforgettable dining experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CartProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main className="mt-12">
          {children}
        </main>
        <Footer />
      </body>
      </CartProvider>
    </html>
  );
}
