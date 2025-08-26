'use client';

import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import { FiX } from "react-icons/fi";
import { Minus, Plus } from "lucide-react";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const router = useRouter();
  const { cartCount, cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const [invalidFields, setInvalidFields] = useState({
  name: false,
  email: false,
  phone: false,
  address: false,
  acceptPolicy: false,
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const DELIVERY_COST = 5.0; // fixed delivery cost

  const totalItemsPrice = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => totalItemsPrice + DELIVERY_COST,
    [totalItemsPrice]
  );

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ Validate form fields
      if (e) e.preventDefault();
  setLoading(true);
  setError(null);

  const newInvalidFields = {
    name: !name,
    email: !email,
    phone: !phone,
    address: !address,
    acceptPolicy: !acceptPolicy,
  };

  setInvalidFields(newInvalidFields);

  // Stop if any field is invalid
  if (Object.values(newInvalidFields).some((v) => v)) {
    setLoading(false);
    return;
  }

      // 1️⃣ Submit order to backend
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
        deliveryCost: DELIVERY_COST,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }

      const data = await res.json();
      console.log("✅ Order created:", data);

      // 2️⃣ Send order confirmation email
      const emailRes = await fetch("/api/send-email/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          phone,
          address,
          total: payload.total,
          deliveryCost: payload.deliveryCost,
          items: payload.items,
          orderId: data.id,
        }),
      });

      if (!emailRes.ok) {
        const err = await emailRes.json();
        console.error("❌ Email error:", err);
        setError("Order saved but email failed to send.");
      } else {
        console.log("📩 Confirmation email sent!");
      }

      // 3️⃣ Update UI
      setOrderPlaced(true);
      clearCart();
      setName(""); setEmail(""); setPhone(""); setAddress(""); setAcceptPolicy(false);

      setTimeout(() => {
        setOrderPlaced(false);
        setShowOrderForm(false);
        onClose();
        router.push("/");
      }, 3000);

    } catch (error: any) {
      console.error(error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
              className="text-gray-600 hover:text-[#B3905E] transition cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              <FiX size={24} />
            </button>
          </header>

          <div className="flex-1 relative overflow-hidden p-4">
            {/* Cart view */}
            <div
              className={`absolute inset-4 transition-all duration-500 ease-in-out transform ${
                showOrderForm ? "opacity-0 -translate-x-10 pointer-events-none" : "opacity-100 translate-x-0"
              }`}
            >
              {cartCount === 0 ? (
                <p className="text-center text-gray-500 mt-10">Your cart is empty. <br></br>Please make an order.</p>
              ) : (
                <ul className="space-y-4 overflow-y-auto h-full pr-2 no-scrollbar">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center space-x-4 justify-between border-b border-gray-300 last:border-b-0 pb-4 mb-4"
                    >

                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-start space-x-4 ">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={70}
                            height={70}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="!text-base font-semibold">{item.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full mt-2">
                          <div className="">
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                          </div>
                          <div>
                            <div className="flex flex-row items-center gap-2">
                              <button
                                onClick={() => decreaseQuantity(item.id)}
                                aria-label={`Decrease quantity of ${item.name}`}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-2 py-2 transition cursor-pointer"
                              >
                                <Minus size={18}/>
                              </button>
                              <button
                                onClick={() => increaseQuantity(item.id)}
                                aria-label={`Increase quantity of ${item.name}`}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-2 py-2 transition cursor-pointer"
                              >
                                <Plus size={18}/>
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                aria-label={`Remove ${item.name} from cart`}
                                className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-2 transition cursor-pointer"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                        </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Checkout form view */}
            <div
              className={`absolute inset-5 transition-all duration-500 ease-in-out transform flex flex-col justify-between align-items ${
                showOrderForm ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
              }`}
            >
              {orderPlaced && (
                <div className="absolute top-0 left-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center font-semibold mb-2 h-38">
                  Your order has been placed successfully! <br /> Please check your email inbox for the order summary.
                </div>
              )}

              {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setInvalidFields(prev => ({ ...prev, name: false }))}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      invalidFields.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#B3905E]"
                    }`}
                  />

                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInvalidFields(prev => ({ ...prev, email: false }))}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      invalidFields.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#B3905E]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setInvalidFields(prev => ({ ...prev, phone: false }))}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      invalidFields.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#B3905E]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Address <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={() => setInvalidFields(prev => ({ ...prev, address: false }))}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      invalidFields.address ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#B3905E]"
                    }`}
                  />
                </div>

                <div className="text-left font-semibold text-md mt-2">
                Items Total: ${totalItemsPrice.toFixed(2)}
                </div>
                <div className="text-left font-semibold text-md">
                  Delivery: ${DELIVERY_COST.toFixed(2)}
                </div>
                <div className="text-left font-bold text-lg mb-3">
                  Total: ${totalPrice.toFixed(2)}
                </div>
              </div>

              <div>
                {/* ✅ Checkbox for policy acceptance */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`p-1 rounded-lg ${invalidFields.acceptPolicy ? "border border-red-500" : ""}`}>
                    <Checkbox
                      label="I accept the delivery policy and terms"
                      checked={acceptPolicy}
                      onChange={(val) => {
                        setAcceptPolicy(val);
                        setInvalidFields(prev => ({ ...prev, acceptPolicy: false }));
                      }}
                      policyLink="/terms-and-conditions"
                    />
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-burgundy text-white py-3 rounded-xl font-semibold hover:bg-burgundy/90 transition"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>

                <button
                  onClick={() => setShowOrderForm(false)}
                  className="w-full text-gray-700 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer mt-2"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>

          {!showOrderForm && cartCount > 0 && (
            <footer className="p-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setShowOrderForm(true)}
                className="block w-full text-black text-center py-3 rounded-xl font-semibold cursor-pointer"
              >
                Go to Checkout
              </Button>
            </footer>
          )}
        </div>
      </aside>
    </>
  );
}
