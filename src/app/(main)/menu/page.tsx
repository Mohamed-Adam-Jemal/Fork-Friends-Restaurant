'use client';

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";
import FilteringBar from "@/components/ui/FilteringBar";
import Dropdown from "@/components/ui/Dropdown";
import Spinner from "@/components/ui/Spinner";
import { MdPedalBike } from "react-icons/md";

const categories = ["Appetizers", "Salads", "Main Dishes", "Sides", "Desserts", "Drinks", "Specials"];
const cuisines = ["Italian", "Turkish", "French", "Japanese", "Mexican"];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null); // match string id type
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [chefChoiceOnly, setChefChoiceOnly] = useState(false);
  const [isOpen, setIsOpen] = useState<"price" | "category" | "cuisine" | null>(null);

  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const cuisineDropdownRef = useRef<HTMLDivElement>(null);

  const priceRanges = [
    { label: "Under $8", min: 0, max: 8 },
    { label: "$8 - $16", min: 8, max: 16 },
    { label: "$16 - $25", min: 16, max: 25 },
    { label: "Above $25", min: 25, max: Infinity },
  ];

  // Close dropdown when clicking outside
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

  // Fetch menu items
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          const cleanedData = data.map((item) => ({
            ...item,
            id: item.id, // ensure id exists
            chef_choice: item.chefChoice, // map Prisma field
            image: item.image || null,
            name: item.name || "Unnamed Item",
            price: Number(item.price) || 0,
          }));
          setMenuItems(cleanedData);
        } else {
          console.error("Error fetching menu items:", data.error || data);
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch menu items", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (selectedCuisine && item.cuisine !== selectedCuisine) return false;

    if (priceRange) {
      const priceNum = Number(item.price);
      const range = priceRanges.find((r) => r.label === priceRange);
      if (!range) return true;
      if (priceNum < range.min || priceNum > range.max) return false;
    }

    if (chefChoiceOnly && !item.chef_choice) return false;

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
    setTimeout(() => setAddingId(null), 1000);
  };

  return (
    <PageTransition>
      <main className="py-16 relative">
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
            Discover Our Menu
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-12">
            Crafted with passion, served with elegance — a symphony of flavors awaits you.
          </p>

          {/* FILTER BAR */}
          <FilteringBar>
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
                selected={priceRange}
              />
            </div>

            {/* CHEF’S CHOICE TOGGLE */}
            <button
              onClick={() => setChefChoiceOnly(!chefChoiceOnly)}
              className={`px-5 py-2 rounded-full font-normal shadow transition flex items-center gap-1 cursor-pointer ${
                chefChoiceOnly
                  ? "bg-[#B3905E] text-white"
                  : "bg-white hover:bg-[#B3905E] hover:text-white"
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
                className="px-4 py-2 rounded-full font-semibold shadow bg-red-400 text-white hover:bg-red-500 transition cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </FilteringBar>

          {/* MENU ITEMS */}
          {loading ? (
            <Spinner name="Menu Items" />
          ) : filteredCategories.length === 0 ? (
            <p className="text-lg mt-12">No items match your filters.</p>
          ) : (
            filteredCategories.map((category) => {
              const items = getItemsByCategory(category);
              return (
                <section key={category} className="mb-16 scroll-mt-24" id={category}>
                  <div className="flex items-center justify-center mb-6">
                    <hr className="border-t border-gold w-1/5" />
                    <span className="mx-4 text-lg md:text-2xl font-semibold uppercase tracking-wide">
                      {category}
                    </span>
                    <hr className="border-t border-gold w-1/5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => {
                      const hasError = imgErrors[item.id] || false;

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col hover:-translate-y-1 transform"
                        >
                          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group">
                            {!hasError && item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name || "Menu Item"}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                                priority
                                onError={() =>
                                  setImgErrors((prev) => ({ ...prev, [item.id]: true }))
                                }
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                                <span className="text-gray-400 text-center font-semibold">
                                  No Image
                                </span>
                              </div>
                            )}

                            {item.chef_choice && (
                              <div
                                className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 font-semibold text-sm shadow-lg"
                                title="Chef's Choice"
                              >
                                Chef's Choice
                              </div>
                            )}
                          </div>

                          <h3 className="!text-xl font-semibold">{item.name}</h3>
                          <p className="!text-gray-700 mt-1 flex-grow">{item.description}</p>

                          <div className="flex justify-between items-center mt-6">
                            <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                            <Button
                              onClick={() => handleAddClick(item)}
                              size="md"
                              className={`
                                border border-gold/30
                                flex items-center gap-2 px-3 py-2 text-base
                                hover:scale-105
                                focus:ring-burgundy/30
                                ${addingId === item.id ? "scale-95 shadow-inner" : ""}
                              `}
                            >
                              <MdPedalBike size={20} />
                              {addingId === item.id ? "Added to Cart!" : "Order"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
