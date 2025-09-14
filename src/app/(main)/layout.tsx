import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navigation from "@/components/Navigation";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";
import { ModalProvider } from "@/context/OrderModalContext";
import ChatBot from "@/components/ChatBot";

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
  description:
    "Delicious meals crafted with love — your cozy spot for fresh flavors, friendly vibes, and unforgettable dining experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <ModalProvider>
            <Navigation />
            <main className="mt-12">{children}</main>
            {/* ChatBot */}
            <ChatBot />
            <Footer />
          </ModalProvider>
        </CartProvider>
      </body>
    </html>
  );
}
