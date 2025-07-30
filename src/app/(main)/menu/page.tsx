"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

const categories = ["Appetizers", "Main Dishes", "Sides", "Desserts"];
const cuisines = ["Italian", "Turkish", "French", "Japanese", "Mexican"];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [chefChoiceOnly, setChefChoiceOnly] = useState(false);
  const [isOpen, setIsOpen] = useState<"price" | "category" | "cuisine" | null>(null);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const cuisineDropdownRef = useRef<HTMLDivElement>(null);

  const priceRanges = [
    { label: "Under $8", min: 0, max: 8 },
    { label: "$8 - $12", min: 8, max: 12 },
    { label: "$12 - $16", min: 12, max: 16 },
    { label: "Above $16", min: 16, max: Infinity },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node) &&
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target as Node) &&
        cuisineDropdownRef.current &&
        !cuisineDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (selectedCuisine && item.cuisine !== selectedCuisine) return false;

    if (priceRange) {
      const priceNum = Number(item.price);
      const range = priceRanges.find((r) => r.label === priceRange);
      if (!range) return true;
      if (priceNum < range.min || priceNum > range.max) return false;
    }

    if (chefChoiceOnly && !item.chefChoice) return false;

    return true;
  });

  const filteredCategories = categories.filter((cat) =>
    filteredItems.some((item) => item.category === cat)
  );

  const getItemsByCategory = (category: string) =>
    filteredItems.filter((item) => item.category === category);

  const handleAddClick = (item: any) => {
    setAddingId(item.id);
    addToCart(item);
    setTimeout(() => setAddingId(null), 800);
  };

  return (
    <PageTransition>
      <main className="bg-[#B3905E]/15 py-16">
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-burgundy mb-6 drop-shadow-sm">
            Discover Our Menu
          </h1>
          <p className="text-lg md:text-xl text-charcoal/80 max-w-2xl mx-auto mb-12">
            Crafted with passion, served with elegance — a symphony of flavors awaits you.
          </p>

          {/* FILTER BAR */}
          <div className="bg-[#B3905E]/30 flex flex-wrap gap-4 py-4 mb-10 rounded-full shadow-inner px-6 justify-center max-w-full mx-auto">

            {/* CATEGORY DROPDOWN */}
            <div className="relative" ref={categoryDropdownRef}>
              <Dropdown
                label={selectedCategory || "All Categories"}
                isOpen={isOpen === "category"}
                onToggle={() => setIsOpen(isOpen === "category" ? null : "category")}
                onSelect={(value) => {
                  setSelectedCategory(value);
                  setIsOpen(null);
                }}
                options={categories}
                allLabel="All Categories"
                selected={selectedCategory}
              />
            </div>

            {/* CUISINE DROPDOWN */}
            <div className="relative" ref={cuisineDropdownRef}>
              <Dropdown
                label={selectedCuisine || "All Cuisines"}
                isOpen={isOpen === "cuisine"}
                onToggle={() => setIsOpen(isOpen === "cuisine" ? null : "cuisine")}
                onSelect={(value) => {
                  setSelectedCuisine(value);
                  setIsOpen(null);
                }}
                options={cuisines}
                allLabel="All Cuisines"
                selected={selectedCuisine}
              />
            </div>

            {/* PRICE DROPDOWN */}
            <div className="relative" ref={priceDropdownRef}>
              <Dropdown
                label={priceRange || "All Prices"}
                isOpen={isOpen === "price"}
                onToggle={() => setIsOpen(isOpen === "price" ? null : "price")}
                onSelect={(value) => {
                  setPriceRange(value);
                  setIsOpen(null);
                }}
                options={priceRanges.map((r) => r.label)}
                allLabel="All Prices"
                selected={priceRange}
              />
            </div>

            {/* CHEF’S CHOICE TOGGLE */}
            <button
              onClick={() => setChefChoiceOnly(!chefChoiceOnly)}
              className={`px-5 py-2 rounded-full font-semibold shadow transition flex items-center gap-1 ${
                chefChoiceOnly
                  ? "bg-[#B3905E] text-white"
                  : "bg-white text-burgundy hover:bg-[#B3905E] hover:text-white"
              }`}
            >
              Chef's Choice
            </button>

            {/* CLEAR FILTERS */}
            {(selectedCategory || selectedCuisine || priceRange || chefChoiceOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedCuisine(null);
                  setPriceRange(null);
                  setChefChoiceOnly(false);
                }}
                className="px-4 py-2 rounded-full font-semibold shadow bg-red-400 text-white hover:bg-red-500 transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* MENU ITEMS */}
          {loading ? (
            <p className="text-charcoal/70 text-lg mt-12">Loading menu...</p>
          ) : filteredCategories.length === 0 ? (
            <p className="text-charcoal/70 text-lg mt-12">No items match your filters.</p>
          ) : (
            filteredCategories.map((category) => {
              const items = getItemsByCategory(category);
              return (
                <section key={category} className="mb-16 scroll-mt-24">
                  <div className="flex items-center justify-center mb-6">
                    <hr className="border-t border-gold w-1/5" />
                    <span className="mx-4 text-burgundy text-xl font-semibold uppercase tracking-wide">
                      {category}
                    </span>
                    <hr className="border-t border-gold w-1/5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col hover:-translate-y-1 transform"
                      >
                        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group">
                          <Image
                            src={item.image}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl transition-transform duration-500 group-hover:scale-105"
                          />
                          {item.chefChoice && (
                            <span className="absolute top-3 left-3 bg-gold text-burgundy px-3 py-1 rounded-full text-xs font-semibold drop-shadow-lg">
                              Chef's Choice
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-burgundy">{item.name}</h3>
                        <p className="text-gray-700 mt-1 flex-grow">{item.description}</p>
                        <div className="flex justify-between items-center mt-6">
                          <span className="text-lg font-semibold text-charcoal">
                            ${item.price.toFixed(2)}
                          </span>
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
            })
          )}
        </div>
      </main>
    </PageTransition>
  );
}

// Reusable Dropdown Component
function Dropdown({
  label,
  isOpen,
  onToggle,
  onSelect,
  options,
  allLabel,
  selected,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string | null) => void;
  options: string[];
  allLabel: string;
  selected: string | null;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="px-5 py-2 rounded-full bg-white text-burgundy font-semibold shadow-md flex items-center gap-2"
      >
        {label}
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <ul
        className={`absolute w-full mt-2 bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
          isOpen
            ? "max-h-96 opacity-100 scale-y-100"
            : "max-h-0 opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <li
          onClick={() => onSelect(null)}
          className="px-5 py-2 cursor-pointer hover:bg-[#B3905E]/15 text-burgundy font-semibold"
        >
          {allLabel}
        </li>
        {options.map((option) => (
          <li
            key={option}
            onClick={() => onSelect(option)}
            className={`px-5 py-2 cursor-pointer hover:bg-[#B3905E]/50 text-burgundy hover:text-white ${
              selected === option ? "bg-[#B3905E] text-white font-semibold" : ""
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    </>
  );
}
