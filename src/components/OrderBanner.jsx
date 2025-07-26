"use client";

import Link from "next/link";

export default function OrderBanner() {
  return (
    <section className="bg-gold p-8 rounded-lg text-center max-w-md mx-auto">
      <h3 className="text-3xl font-semibold text-burgundy mb-3">Ready to Order?</h3>
      <p className="text-charcoal mb-6">
        Choose your favorites and let us handle the rest.
      </p>
      <Link href="/order">
        <button className="bg-burgundy text-ivory px-6 py-3 rounded-lg border border-transparent hover:bg-dark-burgundy transition">
          Place Your Order
        </button>
      </Link>
    </section>
  );
}
