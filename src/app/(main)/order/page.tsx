"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function OrderPage() {
  const { cart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // User info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!name || !email || !phone || !address) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        email,
        phone,
        address,
        total: parseFloat(totalPrice.toFixed(2)),
        items: cart.map(({ id, name, price, quantity }) => ({
          id,
          name,
          price,
          quantity,
        })),
      };

      console.log("Sending order:", payload);

      const response = await fetch("api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error("Error response:", data);
        throw new Error(data.error || "Failed to place order.");
      }

      setOrderPlaced(true);
      clearCart();

      setTimeout(() => router.push("/"), 3500);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto mt-30 mb-13 p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="!text-2xl font-bold mb-4 !text-green-700">Thank you for your order!</h1>
        <p className=" mb-2">Your order has been placed successfully.</p>
        <p className="">You will be redirected to the home page shortly.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-30 mb-13 p-8 bg-white rounded-lg shadow text-center">
        <h1 className="!text-xl font-bold mb-6">Your cart is empty.</h1>
        <Button asChild variant="primary" onClick={() => router.push("/menu")}>
          Order from menu
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto mt-25 p-8 bg-white rounded-lg shadow-lg mb-12">
      <h1 className="!text-4xl font-extrabold mb-8 text-burgundy">Order Summary</h1>

      <ul className="divide-y divide-gray-200 mb-10">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center py-4">
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div className="flex-grow ml-6">
              <h2 className="!font-semibold !text-lg">{item.name}</h2>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-700 font-semibold">${item.price}</p>
            </div>
            <div className="text-lg font-bold text-burgundy">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-2xl font-extrabold mb-10 border-t pt-6 border-gray-300">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePlaceOrder();
        }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="name" className="block font-semibold mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy transition"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy transition"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-semibold mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy transition"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block font-semibold mb-2">
            Shipping Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, City, State, ZIP"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy transition"
            required
          />
        </div>

        {error && (
          <p className="text-red-600 font-semibold text-center">{error}</p>
        )}

        <Button
        variant="secondary"
          type="submit"
          disabled={loading}
          className={`
            max-w-xs mx-auto block w-full py-4 rounded-xl font-bold text-white transition
            ${loading
              ? "bg-[#B3905E]/40 cursor-not-allowed"
              : "bg-[#B3905E] hover:bg-[#B3905E]/90 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/50"
            }
            select-none
            duration-200
          `}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </main>
  );
}
