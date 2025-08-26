'use client';

import Hero from '@/components/Hero';
import FeaturedMenu from '@/components/FeaturedMenu';
import ReservationBanner from '@/components/ReservationBanner';
import Testimonials from '@/components/Testimonials';
import ChatBot from '@/components/ChatBot';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden text-gray-800 font-sans mt-17 bg-[#F3EFE7]">
      <section className="relative z-10 h-screen pt-15 md:pt-20" style={{ height: "calc(100vh - 4.25rem)" }}>
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
  );
}
