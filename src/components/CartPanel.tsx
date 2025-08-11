"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2 } from 'lucide-react';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cartCount, cart, decreaseQuantity, removeFromCart } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-75 md:w-100 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-label="Shopping Cart"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="!text-xl font-semibold">Your Cart</h2>
            <button
              onClick={onClose}
              aria-label="Close Cart"
              className="text-gray-600 hover:text-gray-900 transition cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            {cartCount === 0 ? (
              <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 justify-between border-b border-gray-300 last:border-b-0 pb-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="!text-xl font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">${item.price}</p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-3 py-1 transition cursor-pointer"
                      >
                        −
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-2 transition cursor-pointer"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="p-4 border-t border-gray-200">
            <Link
              href="/order"
              className="block w-full text-black text-center py-3 rounded-xl font-semibold hover:bg-burgundy/90 transition cursor-pointer transition-transform duration-200 hover:scale-110"
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
