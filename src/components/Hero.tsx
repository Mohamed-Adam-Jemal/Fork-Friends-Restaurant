"use client";

import Image from "next/image";
import PageTransition from "@/components/PageTransition";

export default function Hero() {
  return (
    <PageTransition>
    <section className="relative flex items-center justify-center text-center overflow-hidden pb-50">
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
        <h1 className="!text-4xl !text-[#B3905E] font-extrabold mb-6">
          Fork & Friends
        </h1>
        <p className="!text-lg mb-10 max-w-xl mx-auto">
          Timeless elegance meets warm hospitality. Experience fine dining reimagined.
        </p>
        {/* Animated Down Arrow */}
      <div className="flex justify-center mt-12 animate-bounce">
        <a href="#featured-menu" aria-label="Scroll down">
          <svg
            className="w-12 h-12 text-[#B3905E]"
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
