'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import FilteringBar from '@/components/ui/FilteringBar';
import Spinner from '@/components/ui/Spinner'; // Assuming you have your Spinner component

type Order = {
  id: number;
  name: string;
  email: string;
  phone: string;
  total: number;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  createdAt: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = orders.filter((order) => {
    const matchesName = order.name.toLowerCase().includes(searchName.trim().toLowerCase());

    const matchesDate = searchDate
      ? order.createdAt &&
        !isNaN(new Date(order.createdAt).getTime()) && // valid date check
        new Date(order.createdAt).toISOString().split('T')[0] === searchDate
      : true;

    return matchesName && matchesDate;
  });

    setFilteredOrders(filtered);
  }, [orders, searchName, searchDate]);

  const deleteOrder = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;

    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    fetchOrders();
  };

  return (
    <main className="h-screen flex flex-col p-6 max-w-7xl mx-auto">
      <h1 className="!text-3xl font-bold mb-8">Manage Orders</h1>

      {/* Filter bar */}
      <FilteringBar className="w-full">
        {/* Search by name */}
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black cursor-pointer"
        />

        {/* Filter by date */}
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
        />
      </FilteringBar>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spinner name="orders" />
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.length === 0 && (
              <p className="text-center col-span-full text-gray-500 text-lg">No orders found.</p>
            )}

            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              >
                <div>
                  <h2 className="!text-xl font-semibold text-[#B3905E] mb-2">{order.name}</h2>
                  <p className="!text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Email:</span> {order.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Phone:</span> {order.phone}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Address:</span> {order.address}
                  </p>

                  <p className="text-sm text-gray-700 mt-3 font-semibold">Items Ordered:</p>
                  <ul className="list-disc list-inside overflow-y-auto max-h-28 pr-2 text-gray-700 text-sm mb-3">
                    {order.items.map((item, idx) => (
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
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition font-semibold flex items-center gap-2 cursor-pointer"
                    aria-label={`Delete order from ${order.name}`}
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
