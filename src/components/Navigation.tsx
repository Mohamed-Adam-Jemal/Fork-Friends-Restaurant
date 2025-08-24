"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaShoppingBasket } from "react-icons/fa";
import Image from "next/image";
import CartPanel from "./CartPanel";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

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
  }, []);

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
            className="hover:bg-[#B3905E] hover:text-white md:hidden relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-gradient-to-r hover:from-gold/20 hover:to-burgundy/10 transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                }`}
              />
            </div>
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
              className="cursor-pointer hover:bg-[#B3905E] bg-[#B3905E]/70 hover:text-white relative group w-11 h-11 flex items-center justify-center rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaShoppingBasket className="text-xl" fill="white" />
              <span className="bg-[#000000]/40 text-white absolute -top-1 -right-1 text-xs bg-burgundy text-black w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-md group-hover:scale-110 transition-transform">
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
                    className={`relative px-5 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ease-out overflow-hidden
                    ${
                      isActiveLink(link.href)
                        ? "text-white bg-[#B3905E]/70 shadow-lg transform scale-105"
                        : "text-charcoal hover:text-[#B3905E]/70"
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
              className="cursor-pointer hover:bg-[#B3905E] bg-[#B3905E]/70 hover:text-white relative group w-11 h-11 flex items-center justify-center rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaShoppingBasket className="text-xl" fill="white" />
              <span className="bg-[#000000]/40 text-white absolute -top-1 -right-1 text-xs bg-burgundy text-black w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-md group-hover:scale-110 transition-transform">
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
          <div className="bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-sm border-t border-gold/20 shadow-lg">
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
