"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cartCount, cartItems } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Floating Cart UI */}
      <aside
        className={`fixed top-0 right-0 h-full w-75 md:w-100 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-label="Shopping Cart"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button
              onClick={onClose}
              aria-label="Close Cart"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            {cartCount === 0 ? (
              <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">${item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="p-4 border-t border-gray-200">
            <Link
              href="/order"
              className="block w-full bg-burgundy text-white text-center py-3 rounded-xl font-semibold hover:bg-burgundy/90 transition"
              onClick={onClose}
            >
              Go to Checkout
            </Link>
          </footer>
        </div>
      </aside>
    </>
  );
}
