"use client";

import Link from "next/link";
import Image from "next/image";
import { Team } from "@/components/Team"; // wherever you save it
import PageTransition from "@/components/PageTransition";
import Button from "@/components/ui/Button";
import { Particles } from "@/components/ui/particles";

export default function AboutPage() {
  return (
    <PageTransition>
    <Particles
      className="fixed inset-0 z-0 pointer-events-none"
      quantity={110}
      ease={50}
      color="#000000"
      refresh
      />
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-16 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image
            src="/FnF_Logo.png"
            alt="Fork & Friends logo"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>

        <h1 className="!text-4xl font-extrabold mb-4">
          About Fork & Friends
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
          Fork & Friends is a community-driven platform dedicated to bringing
          people together through food, friendship, and shared experiences. 
          We believe that great meals create great memories, and we strive to
          make every dining experience special, inclusive, and fun.
        </p>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
          Whether you're here to discover new recipes, connect with fellow foodies,
          or join our events, Fork & Friends welcomes you with open arms and an open table.
        </p>

        <h2 className="!text-3xl font-bold mt-12 mb-8">
          Meet the Fork & Friends Team
        </h2>
        <Team />

        <Link href="/" passHref>
          <Button variant="primary">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
    </PageTransition>
  );
}
