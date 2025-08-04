import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navigation from "@/components/Navigation";
import { CartProvider } from "@/context/CartContext";
import {Footer} from '@/components/Footer';
import { Particles } from "@/components/ui/particles"
import { ThemeProvider } from "@/context/ThemeContext";


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
      <ThemeProvider>
      <CartProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={110}
        ease={50}
        color="#000000"
        refresh
        />
        <Navigation />
        <main className="mt-12">
          {children}
        </main>
        <Footer />
      </body>
      </CartProvider>
      </ThemeProvider>
    </html>
  );
}
