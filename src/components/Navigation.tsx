"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaShoppingBasket } from "react-icons/fa";
import Image from "next/image";
import CartPanel from "./CartPanel";
import { AnimatePresence, motion } from "motion/react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navigation() {
  // Client-only flag
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const [shake, setShake] = useState(false);

  const { cartCount } = useCart();

  const showNavbar = () => setVisible(true);

  // Scroll detection - only on client
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
        setMenuOpen(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const toggleCart = () => setCartOpen((open) => !open);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservation", label: "Reserve" },
    { href: "/#testimonials", label: "Testimonials" },
    { href: "/about", label: "About" },
  ];

  // Trigger shake on cart count change - client only
  useEffect(() => {
    if (!isClient) return;
    if (cartCount > 0) {
      showNavbar();
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount, isClient]);

  // If not client, render minimal navbar to avoid hydration mismatch
  if (!isClient) {
    return (
      <nav className="bg-white fixed w-full top-0 left-0 z-50">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-2 md:py-1">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Image src="/logos/FnF_Logo.png" alt="Fork & Friends logo" width={60} height={60} />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`bg-white fixed w-full top-0 left-0 z-50 transition-all duration-500 ease-out
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-2 md:py-1">
          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="md:hidden relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-[#B3905E]/70 hover:text-white hover:scale-110 hover:shadow-lg active:scale-95"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiX className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiMenu className="w-7 h-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Image
              src="/logos/FnF_Logo.png"
              alt="Fork & Friends logo"
              width={60}
              height={60}
              className="drop-shadow-lg"
              priority
            />
          </div>

          {/* Mobile Cart */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleCart}
              aria-label="Toggle Basket"
              className={`cursor-pointer hover:bg-[#B3905E] bg-[#B3905E]/70 hover:text-white relative group w-11 h-11 flex items-center justify-center rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95
              ${shake ? "animate-shake" : ""}`}
            >
              <FaShoppingBasket className="text-xl" fill="white" />
              <span className="bg-[#000000]/40 text-white absolute -top-1 -right-1 text-xs text-black w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-md group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex items-center space-x-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-5 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-out overflow-hidden
                    ${
                      isActiveLink(link.href)
                        ? "text-white bg-[#C8A983] shadow-lg transform scale-105"
                        : "hover:text-[#C8A983]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleCart}
              aria-label="Toggle Basket"
              className={`cursor-pointer hover:bg-[#B3905E] bg-[#B3905E]/70 hover:text-white relative group w-11 h-11 flex items-center justify-center rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95
              ${shake ? "animate-shake" : ""}`}
            >
              <FaShoppingBasket className="text-xl" fill="white" />
              <span className="bg-[#000000]/40 text-white absolute -top-1 -right-1 text-xs text-black w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-md group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="backdrop-blur-sm border-t border-[#B3905E]">
            <ul className="space-y-1 py-2 px-1.5">
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  className={`transform transition-all duration-500 ease-out ${
                    menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`relative block px-5 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-out group overflow-hidden hover:scale-105 active:scale-95
                      ${
                        isActiveLink(link.href)
                          ? "text-white bg-[#B3905E]/50 shadow-lg"
                          : ""
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
