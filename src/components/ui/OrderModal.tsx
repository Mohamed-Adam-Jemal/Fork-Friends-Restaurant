"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);

    try {
      // ✅ simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setOrderPlaced(true);
      clearCart();

      setTimeout(() => {
        setOrderPlaced(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Order failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
        {!orderPlaced ? (
          <>
            <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="mb-4 space-y-2 max-h-40 overflow-y-auto">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || cart.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Placing..." : "Confirm"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-green-600 font-semibold text-lg">
              ✅ Order placed successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
