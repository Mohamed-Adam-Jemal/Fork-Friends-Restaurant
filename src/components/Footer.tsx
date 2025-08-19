import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 w-full">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src="/FnF_Logo.png"
            alt="Fork & Friends logo"
            className="h-10 w-auto"
          />
          <h2 className="!text-lg font-semibold">Fork & Friends</h2>
        </a>

        {/* Quick nav links */}
        <ul className="flex gap-6 text-sm font-medium">
          <li><a href="/menu" className="hover:text-[#B3905E] transition-colors">Menu</a></li>
          <li><a href="/about" className="hover:text-[#B3905E] transition-colors">About</a></li>
          <li><a href="/reservation" className="hover:text-[#B3905E] transition-colors">Reservations</a></li>
          <li><a href="/contact" className="hover:text-[#B3905E] transition-colors">Contact</a></li>
        </ul>

        {/* Social icons */}
        <div className="flex gap-4">
          <a href="https://instagram.com/forkandfriends" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#B3905E]"><FaInstagram size={20} /></a>
          <a href="https://facebook.com/forkandfriends" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#B3905E]"><FaFacebook size={20} /></a>
          <a href="https://twitter.com/forkandfriends" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-[#B3905E]"><FaTwitter size={20} /></a>
          <a href="https://linkedin.com/company/forkandfriends" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-[#B3905E]"><FaLinkedin size={20} /></a>
        </div>

        {/* Copyright */}
        <p className="!text-xs text-gray-500">
          © {new Date().getFullYear()} Fork & Friends
        </p>
      </div>
    </footer>
  );
};
