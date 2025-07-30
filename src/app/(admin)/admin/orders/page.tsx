'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type Order = {
  id: number;
  name: string;
  email: string;
  phone: string;
  total: number;
  items: any[];
  createdAt: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
  };

  const deleteOrder = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;

    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    fetchOrders();
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#B3905E]">Admin Dashboard - Orders</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {orders.length === 0 && (
          <p className="text-center col-span-full text-gray-500 text-lg">No orders found.</p>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
          >
            <div>
              <h2 className="text-xl font-semibold text-[#B3905E] mb-2">{order.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {order.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Phone:</span> {order.phone}
              </p>

              <p className="text-sm text-gray-700 mt-3 font-semibold">Items Ordered:</p>
              <ul className="list-disc list-inside max-h-28 overflow-auto text-gray-700 text-sm mb-3">
                {Array.isArray(order.items) &&
                  order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} (${item.price.toFixed(2)})
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-semibold text-[#7b3f00]">
                Total: ${order.total.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              {/* Future: Edit button here */}
              <button
                onClick={() => deleteOrder(order.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition font-semibold flex items-center gap-2"
                aria-label={`Delete order from ${order.name}`}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
