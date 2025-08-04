"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaShoppingBasket } from "react-icons/fa";
import Button from "@/components/ui/Button"; // update path if needed

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  featured: boolean;
  chefChoice: boolean;
}

export default function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        const filtered = data.filter((item: MenuItem) => item.featured);
        setFeaturedItems(filtered);
      } catch (err) {
        console.error("Error fetching featured items:", err);
      }
    };
    fetchMenu();
  }, []);

  const handleAddClick = (item: MenuItem) => {
    setAddingId(item.id);
    // simulate add action
    setTimeout(() => setAddingId(null), 1000);
  };

  return (
    <section className="bg-ivory text-charcoal max-w-7xl mx-auto px-6 mt-10 scroll-mt-24">
      <div className="flex items-center justify-center mb-10">
        <hr className="border-t border-gold w-1/5" />
        <span className="mx-4 text-burgundy text-2xl font-bold uppercase tracking-widest">
          Featured Menu
        </span>
        <hr className="border-t border-gold w-1/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col hover:-translate-y-1 transform"
          >
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group">
              <Image
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                fill
                className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.chefChoice && (
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-burgundy font-semibold text-sm shadow-lg"
                  title="Chef's Choice"
                >
                  Chef's Choice
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-burgundy">{item.name}</h3>
            <p className="text-gray-700 mt-1 flex-grow">{item.description}</p>

            <div className="flex justify-between items-center mt-6">
              <span className="text-lg font-semibold text-charcoal">${item.price.toFixed(2)}</span>
              <Button
                onClick={() => handleAddClick(item)}
                variant="gold"
                size="sm"
                className={`bg-[#B3905E]/30 text-charcoal flex items-center gap-2 ${
                  addingId === item.id ? "scale-95 shadow-inner" : ""
                }`}
              >
                <FaShoppingBasket className="text-xs" />
                {addingId === item.id ? "Added!" : "Add to Order"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
