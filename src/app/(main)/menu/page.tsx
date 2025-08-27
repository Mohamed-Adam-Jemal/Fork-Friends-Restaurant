"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";
import FilteringBar from "@/components/ui/FilteringBar";
import Dropdown from "@/components/ui/Dropdown";
import Spinner from "@/components/ui/Spinner";
import { MdPedalBike } from "react-icons/md";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  cuisine: string;
  chef_choice: boolean;
};


const categories = ["Appetizers", "Salads","Main Dishes", "Sides", "Desserts", "Drinks", "Specials"];
const cuisines = ["Italian", "Turkish", "French", "Japanese", "Mexican"];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const { addToCart, basketRef } = useCart();

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
    { label: "$8 - $16", min: 8, max: 16 },
    { label: "$16 - $25", min: 16, max: 25 },
    { label: "Above $25", min: 25, max: Infinity },
  ];

  const categoryOptions = ["All Categories", ...categories];
  const cuisineOptions = ["All Cuisines", ...cuisines];
  const priceOptions = ["All Prices", ...priceRanges.map(r => r.label)];


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

      if (res.ok && Array.isArray(data)) {
        setMenuItems(data);
      } else {
        // Handle error response gracefully
        console.error("Error fetching menu items:", data.error || data);
        setMenuItems([]); // set empty array to avoid crashes
      }
    } catch (error) {
      console.error("Failed to fetch menu items", error);
      setMenuItems([]); // fallback
    } finally {
      setLoading(false);
    }
  }
  fetchMenuItems();
}, []);

// Before filtering, check if menuItems is array
const filteredItems = Array.isArray(menuItems)
  ? menuItems.filter((item) => {
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
    })
  : [];  // fallback empty array if menuItems is not an array


  const filteredCategories = categories.filter((cat) =>
    filteredItems.some((item) => item.category === cat)
  );

  const getItemsByCategory = (category: string) =>
    filteredItems.filter((item) => item.category === category);

  const handleAddClick = (item: MenuItem) => {
    setAddingId(item.id);
    addToCart(item);

    const basket = basketRef.current;
    const img = document.getElementById(`menu-item-img-${item.id}`) as HTMLElement;

    if (img && basket) {
      const imgRect = img.getBoundingClientRect();
      const basketRect = basket.getBoundingClientRect();

      // Clone the image
      const clone = img.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.top = `${imgRect.top}px`;
      clone.style.left = `${imgRect.left}px`;
      clone.style.width = `${imgRect.width}px`;
      clone.style.height = `${imgRect.height}px`;
      clone.style.borderRadius = "12px";
      clone.style.transition = "all 0.8s ease-in-out";
      clone.style.zIndex = "9999";
      document.body.appendChild(clone);

      // Trigger animation
      requestAnimationFrame(() => {
        clone.style.top = `${basketRect.top + basketRect.height / 2 - imgRect.height / 4}px`;
        clone.style.left = `${basketRect.left + basketRect.width / 2 - imgRect.width / 4}px`;
        clone.style.width = `${imgRect.width / 2}px`;
        clone.style.height = `${imgRect.height / 2}px`;
        clone.style.opacity = "0.5";
      });

      // Remove clone after animation
      clone.addEventListener("transitionend", () => {
        clone.remove();
      });
    }

    // Basket bounce effect
    if (basket) {
      basket.classList.add("animate-basket");
      setTimeout(() => {
        basket?.classList.remove("animate-basket");
      }, 500);
    }

    // Reset addingId for button text
    setTimeout(() => setAddingId(null), 1000);
  };

  return (
    <PageTransition>
      <main className="py-16 relative">
      {/* Background image */}
      {/* <div
        className="absolute inset-0 bg-contain z-0 bg-y-repeat"
        style={{ backgroundImage: 'url(/images/bg-menu13.png)' }}
        aria-hidden="true"
      ></div> */}

      {/* Black overlay */}
      {/* <div className="absolute inset-0 bg-black opacity-50 z-0" aria-hidden="true"></div> */}

      {/* Content */}
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
                  setSelectedCategory(value === "All Categories" ? null : value);
                  setIsOpen(null);
                }}
                options={categoryOptions}
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
                  setSelectedCuisine(value === "All Cuisines" ? null : value);
                  setIsOpen(null);
                }}
                options={cuisineOptions}
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
                  setPriceRange(value === "All Prices" ? null : value);
                  setIsOpen(null);
                }}
                options={priceOptions}
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
            <Spinner name="Menu Items"/>
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
                    {items.map((item) => (
                      <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col hover:-translate-y-1 transform"
                  >
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group">
                     <div className="relative w-full h-full">
                      <div className="relative w-full h-full">
                        <Image
                          id={`menu-item-img-${item.id}`}
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                          priority
                        />
                      </div>

                    </div>
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
                      <span className="text-lg font-semibold ">${item.price.toFixed(2)}</span>
                      <Button
                        onClick={() => handleAddClick(item)}
                        size="md"
                        className={`
                          flex items-center gap-2 px-3 py-2 text-base
                          hover:scale-105
                          ${addingId === item.id ? "scale-95 shadow-inner" : ""}
                        `}
                      >
                        <MdPedalBike size={20} />
                        {addingId === item.id ? "Added to Cart!" : "Order"} 
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
