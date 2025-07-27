"use client";

import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function Hero() {
  return (
    <PageTransition>
    <section className="relative flex items-center justify-center text-center overflow-hidden pb-16.5">
      {/* Content */}
      <div
      >
        <Image
          src="/FnF_Logo.png"
          alt="Fork & Friends logo"
          width={250}
          height={250}
          className="mx-auto mb-6 drop-shadow-lg"
          priority
        />
        <h1 className="text-[#B3905E] dark:text-white text-5xl md:text-7xl font-extrabold text-burgundy mb-6 leading-tight tracking-wide">
          Fork & Friends
        </h1>
        <p className="text-lg md:text-xl text-charcoal mb-10 max-w-xl mx-auto">
          Timeless elegance meets warm hospitality. Experience fine dining reimagined.
        </p>
        {/* Animated Down Arrow */}
      <div className="flex justify-center mt-12 animate-bounce">
        <a href="#next-section" aria-label="Scroll down">
          <svg
            className="w-10 h-10 text-[#B3905E] hover:text-burgundy transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
      </div>
    </section>
    </PageTransition>
  );
}
