"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FaPlus, FaShoppingBasket } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button"; 
import PageTransition from "@/components/PageTransition";

const menuItems = [
  // Appetizers
  {
    id: 1,
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, and house dressing.",
    price: "$10",
    image: "/dishes/pizza.jpg",
    category: "Appetizers",
  },
  {
    id: 2,
    name: "Bruschetta",
    description: "Grilled bread with tomato, garlic, basil, and olive oil.",
    price: "$7",
    image: "/dishes/pizza.jpg",
    category: "Appetizers",
  },
  {
    id: 3,
    name: "Stuffed Mushrooms",
    description: "Mushrooms filled with cheese and herbs.",
    price: "$9",
    image: "/dishes/pizza.jpg",
    category: "Appetizers",
  },
  {
    id: 4,
    name: "Garlic Knots",
    description: "Freshly baked knots brushed with garlic butter.",
    price: "$6",
    image: "/dishes/pizza.jpg",
    category: "Appetizers",
  },
  {
    id: 5,
    name: "Caprese Skewers",
    description: "Mozzarella, cherry tomato, and basil on skewers.",
    price: "$8",
    image: "/dishes/pizza.jpg",
    category: "Appetizers",
  },

  // Main Dishes
  {
    id: 6,
    name: "Pizza Margherita",
    description: "Fresh mozzarella, basil, and tomato sauce.",
    price: "$12",
    image: "/dishes/pizza.jpg",
    category: "Main Dishes",
  },
  {
    id: 7,
    name: "Spaghetti Bolognese",
    description: "Rich beef ragù with handmade pasta.",
    price: "$14",
    image: "/dishes/pizza.jpg",
    category: "Main Dishes",
  },
  {
    id: 8,
    name: "Lasagna",
    description: "Layers of pasta, cheese, and meat sauce baked to perfection.",
    price: "$15",
    image: "/dishes/pizza.jpg",
    category: "Main Dishes",
  },
  {
    id: 9,
    name: "Chicken Parmesan",
    description: "Breaded chicken breast topped with marinara and cheese.",
    price: "$16",
    image: "/dishes/pizza.jpg",
    category: "Main Dishes",
  },
  {
    id: 10,
    name: "Fettuccine Alfredo",
    description: "Creamy Alfredo sauce with fettuccine pasta.",
    price: "$13",
    image: "/dishes/pizza.jpg",
    category: "Main Dishes",
  },
  {
    id: 11,
    name: "Eggplant Parmigiana",
    description: "Breaded eggplant baked with marinara and cheese.",
    price: "$14",
    image: "/dishes/pizza.jpg",
    category: "Main Dishes",
  },
  {
    id: 12,
    name: "Risotto Primavera",
    description: "Creamy risotto with fresh spring vegetables.",
    price: "$15",
    image: "/dishes/pizza.jpg",
    category: "Main Dishes",
  },

  // Sides
  {
    id: 13,
    name: "Garlic Bread",
    description: "Toasted baguette with garlic and herbs.",
    price: "$5",
    image: "/dishes/pizza.jpg",
    category: "Sides",
  },
  {
    id: 14,
    name: "French Fries",
    description: "Crispy golden fries with sea salt.",
    price: "$5",
    image: "/dishes/pizza.jpg",
    category: "Sides",
  },
  {
    id: 15,
    name: "Steamed Vegetables",
    description: "Seasonal vegetables steamed to perfection.",
    price: "$6",
    image: "/dishes/pizza.jpg",
    category: "Sides",
  },
  {
    id: 16,
    name: "Side Salad",
    description: "Mixed greens with light vinaigrette.",
    price: "$6",
    image: "/dishes/pizza.jpg",
    category: "Sides",
  },
  {
    id: 17,
    name: "Mozzarella Sticks",
    description: "Breaded and fried mozzarella cheese sticks.",
    price: "$7",
    image: "/dishes/pizza.jpg",
    category: "Sides",
  },
  {
    id: 18,
    name: "Onion Rings",
    description: "Crispy fried onion rings with dipping sauce.",
    price: "$6",
    image: "/dishes/pizza.jpg",
    category: "Sides",
  },

  // Desserts
  {
    id: 19,
    name: "Tiramisu",
    description: "Classic Italian dessert with mascarpone cream.",
    price: "$8",
    badge: "Chef's Choice",
    image: "/dishes/pizza.jpg",
    category: "Desserts",
  },
  {
    id: 20,
    name: "Panna Cotta",
    description: "Creamy vanilla panna cotta with berry sauce.",
    price: "$7",
    image: "/dishes/pizza.jpg",
    category: "Desserts",
  },
  {
    id: 21,
    name: "Gelato",
    description: "Assorted Italian-style ice cream flavors.",
    price: "$6",
    image: "/dishes/pizza.jpg",
    category: "Desserts",
  },
  {
    id: 22,
    name: "Cannoli",
    description: "Crispy pastry filled with sweet ricotta cream.",
    price: "$7",
    image: "/dishes/pizza.jpg",
    category: "Desserts",
  },
  {
    id: 23,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center.",
    price: "$9",
    image: "/dishes/pizza.jpg",
    category: "Desserts",
  },
  {
    id: 24,
    name: "Affogato",
    description: "Espresso poured over vanilla gelato.",
    price: "$6",
    image: "/dishes/pizza.jpg",
    category: "Desserts",
  },
];

const categories = ["Appetizers", "Main Dishes", "Sides", "Desserts"];

export default function MenuPage() {
  const [addingId, setAddingId] = useState<number | null>(null);
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [chefChoiceOnly, setChefChoiceOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priceRanges = [
    { label: "Under $8", min: 0, max: 8 },
    { label: "$8 - $12", min: 8, max: 12 },
    { label: "$12 - $16", min: 12, max: 16 },
    { label: "Above $16", min: 16, max: Infinity },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (priceRange) {
      const priceNum = Number(item.price.replace(/[^0-9.-]+/g, ""));
      const range = priceRanges.find((r) => r.label === priceRange);
      if (!range) return true;
      if (priceNum < range.min || priceNum > range.max) return false;
    }
    if (chefChoiceOnly && !item.badge) return false;
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
        <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-burgundy mb-6 drop-shadow-sm">
              Discover Our Menu
            </h1>
            <p className="text-lg md:text-xl text-charcoal/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              Crafted with passion, served with elegance — a symphony of flavors awaits you.
            </p>
          </div>

          {/* FILTER BAR */}
          <div className="z-20 bg-[#B3905E]/30 flex flex-wrap gap-4 py-4 mb-10 rounded-full shadow-inner px-6 justify-center max-w-full mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap shadow transition flex items-center gap-1 ${
                  selectedCategory === category
                    ? "bg-[#B3905E] text-white"
                    : "bg-white text-burgundy hover:bg-[#B3905E] hover:text-white"
                }`}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}

            {/* PRICE DROPDOWN */}
            <div className="relative w-auto z-30" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-2 rounded-full bg-white text-burgundy font-semibold shadow-md flex justify-between items-center transition"
              >
                {priceRange || "All Prices"}
                <svg
                  className={`h-5 w-5 text-burgundy transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Fluent transition dropdown */}
              <ul
                className={`absolute w-full mt-2 bg-white rounded-xl shadow-lg text-left z-40 overflow-hidden transform transition-all duration-700 ease-in-out 
                  ${isOpen ? "max-h-96 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95 pointer-events-none"}`}
                style={{ transitionProperty: 'max-height, opacity, transform' }}
              >
                <li
                  onClick={() => {
                    setPriceRange(null);
                    setIsOpen(false);
                  }}
                  className={`px-5 py-2 cursor-pointer hover:bg-[#B3905E]/15 text-burgundy font-semibold ${
                    !priceRange && "bg-[#B3905E] text-white"
                  }`}
                >
                  All Prices
                </li>
                {priceRanges.map((range) => (
                  <li
                    key={range.label}
                    onClick={() => {
                      setPriceRange(range.label);
                      setIsOpen(false);
                    }}
                    className={`px-5 py-2 cursor-pointer hover:bg-[#B3905E]/50 text-burgundy hover:text-white ${
                      priceRange === range.label && "bg-[#B3905E] text-white font-semibold"
                    }`}
                  >
                    {range.label}
                  </li>
                ))}
              </ul>
            </div>


            {/* CHEF’S CHOICE TOGGLE */}
            <button
              onClick={() => setChefChoiceOnly(!chefChoiceOnly)}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap shadow transition flex items-center gap-1 ${
                chefChoiceOnly
                  ? "bg-[#B3905E] text-white"
                  : "bg-white text-burgundy hover:bg-[#B3905E] hover:text-white cursor-pointer"
              }`}
              aria-pressed={chefChoiceOnly}
            >
              Chef's Choice
            </button>

            {/* CLEAR FILTERS */}
            {(selectedCategory || priceRange || chefChoiceOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setPriceRange(null);
                  setChefChoiceOnly(false);
                }}
                className="px-4 py-2 rounded-full font-semibold whitespace-nowrap shadow bg-red-400 text-white hover:bg-red-500 transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* MENU ITEMS */}
          {filteredCategories.length === 0 ? (
            <p className="text-charcoal/70 text-lg mt-12">No items match your filters.</p>
          ) : (
            filteredCategories.map((category) => {
              const items = getItemsByCategory(category);
              return (
                <section key={category} className="mb-16 scroll-mt-24">
                  <div className="relative mb-10">
                    <div className="flex items-center justify-center mb-4">
                      <hr className="border-t border-gold w-1/5" />
                      <span className="mx-4 text-burgundy text-xl font-semibold tracking-wide uppercase">
                        {category}
                      </span>
                      <hr className="border-t border-gold w-1/5" />
                    </div>
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
                          {item.badge && (
                            <span className="absolute top-3 left-3 bg-gold text-burgundy px-3 py-1 rounded-full text-xs font-semibold drop-shadow-lg select-none">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-burgundy drop-shadow-sm">{item.name}</h3>
                        <p className="text-gray-700 mt-1 flex-grow leading-relaxed">{item.description}</p>
                        <div className="flex justify-between items-center mt-6">
                          <span className="text-lg font-semibold text-charcoal drop-shadow-sm">
                            {item.price}
                          </span>
                          <Button
                            onClick={() => handleAddClick(item)}
                            variant="gold"
                            size="sm"
                            aria-label={`Add ${item.name} to order`}
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