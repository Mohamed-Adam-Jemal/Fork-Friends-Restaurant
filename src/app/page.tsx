"use client";

import Hero from '@/components/Hero';
import FeaturedMenu from '@/components/FeaturedMenu';
import ReservationBanner from '@/components/ReservationBanner';
import Testimonials  from '@/components/Testimonials';


export default function HomePage() {
  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden bg-[#B3905E]/15 text-gray-800 font-sans pt-20">
        {/* <BackgroundLines className="absolute inset-0 pointer-events-none" /> */}
        {/* Hero Section */}
        <section className="relative z-10">
          <Hero />
        </section>

        <section className="py-12 px-4 sm:px-8 md:px-16 lg:px-24 bg-white">
          <FeaturedMenu />
        </section>

        <section className="py-12 bg-white px-4 sm:px-8 md:px-16">
          <ReservationBanner />
        </section>

        <section id="testimonials" className="py-12 px-4 sm:px-8 md:px-16">
          <Testimonials />
        </section>
      </main>
    </>
  );
}
