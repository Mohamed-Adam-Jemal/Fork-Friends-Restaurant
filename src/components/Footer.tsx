import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 w-full">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src="/logos/FnF_Logo.png"
            alt="Fork & Friends logo"
            className="h-10 w-auto"
          />
          <h2 className="!text-lg font-semibold">Fork & Friends</h2>
        </a>

        {/* Quick nav links */}
        <ul className="flex gap-6 text-sm font-medium">
          <li><a href="/menu" className="hover:text-[#C8A983] transition-colors">Menu</a></li>
          <li><a href="/about" className="hover:text-[#C8A983] transition-colors">About</a></li>
          <li><a href="/reservation" className="hover:text-[#B3905E] transition-colors">Reservations</a></li>
          <li><a href="/contact" className="hover:text-[#C8A983] transition-colors">Contact</a></li>
        </ul>

        {/* Social icons */}
        <div className="flex gap-4">
          <a href="https://www.upwork.com/freelancers/~01f31a868268eb189f?mp_source=share" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#C8A983]"><FaInstagram size={20} /></a>
          <a href="https://www.upwork.com/freelancers/~01f31a868268eb189f?mp_source=share" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#C8A983]"><FaFacebook size={20} /></a>
          <a href="https://www.upwork.com/freelancers/~01f31a868268eb189f?mp_source=share" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-[#C8A983]"><FaTwitter size={20} /></a>
          <a href="https://www.linkedin.com/in/mohamed-adam-jemal" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-[#C8A983]"><FaLinkedin size={20} /></a>
        </div>

        {/* Copyright */}
        <p className="!text-xs text-gray-500">
          © {new Date().getFullYear()} Fork & Friends
        </p>
      </div>
    </footer>
  );
};
