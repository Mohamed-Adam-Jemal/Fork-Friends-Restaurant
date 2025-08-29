'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit3, X } from 'lucide-react';
import FilteringBar from '@/components/ui/FilteringBar';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ConfirmDialog';
import SomethingWentWrong from '@/components/SomethingWentWrong';

type Order = {
  id: number;
  name: string;
  email: string;
  phone: string;
  total: number;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  created_at: string;
  status: 'In Progress' | 'Done';
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  

  // Controlled form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  setLoading(true);
  setError(null); // reset error
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    setOrders(data);
  } catch (err: any) {
    console.error('Failed to fetch orders', err);
    setError(err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
  const filtered = orders.filter((order) => {
    const matchesPhone = order.phone
      .toLowerCase()
      .includes(searchPhone.trim().toLowerCase());
    const matchesDate = searchDate
      ? order.created_at &&
        !isNaN(new Date(order.created_at).getTime()) &&
        new Date(order.created_at).toISOString().split('T')[0] === searchDate
      : true;
    return matchesPhone && matchesDate;
  });
  setFilteredOrders(filtered);
}, [orders, searchPhone, searchDate]);


  const deleteOrder = async (id: number) => {
  setDeletingId(id);
  setError(null);
  try {
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete order');
    fetchOrders();
  } catch (err: any) {
    console.error(err);
    setError(err.message || 'Something went wrong while deleting the order.');
  } finally {
    setDeletingId(null);
    setShowDeleteConfirm(null);
  }
};

  const toggleStatus = async (e: React.MouseEvent, order: Order) => {
  e.preventDefault();
  setUpdatingId(order.id);
  setError(null);
  const newStatus = order.status === 'In Progress' ? 'Done' : 'In Progress';

  try {
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    fetchOrders();
  } catch (err: any) {
    console.error(err);
    setError(err.message || 'Something went wrong while updating status.');
  } finally {
    setUpdatingId(null);
  }
};


  const openEditForm = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      name: order.name,
      email: order.email,
      phone: order.phone,
      address: order.address,
    });
    setShowForm(true);
  };

  // Add this state at the top
const [saving, setSaving] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingOrder) return;

  setSaving(true);
  setError(null);
  try {
    const res = await fetch(`/api/orders/${editingOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error('Failed to save order changes');
    setShowForm(false);
    fetchOrders();
  } catch (err: any) {
    console.error(err);
    setError(err.message || 'Something went wrong while saving changes.');
  } finally {
    setSaving(false);
  }
};


  return (
    <main className="p-6 max-w-6xl mx-auto">
      <FilteringBar className="w-full mb-6">
        <input
          type="text"
          placeholder="Search by phone number..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black cursor-pointer"
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
        />
      </FilteringBar>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spinner name="orders" />
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
          {/* ... your filteredOrders grid ... */}
        </div>
      )}
        <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 relative min-w-[280px]"
              >
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
                    order.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {order.status}
                </span>

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
                        {item.name} × {item.quantity} (${Number(item.price).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold text-[#7b3f00]">
                    Total: ${order.total.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="mt-5 flex justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => openEditForm(order)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(order.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    disabled={deletingId === order.id}
                  >
                    <Trash2 size={14} />
                    {deletingId === order.id ? 'Deleting…' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => toggleStatus(e, order)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer disabled:opacity-50"
                    disabled={updatingId === order.id}
                  >
                    Toggle
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>

      {showDeleteConfirm && (
        <ConfirmDialog
        show={!!showDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setShowDeleteConfirm(null)}
        onConfirm={() => deleteOrder(showDeleteConfirm!)}
        loading={deletingId === showDeleteConfirm}
      />
      )}

      {showForm && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-95 p-8 rounded-3xl shadow-2xl w-full max-w-90 max-h-[90vh] overflow-auto border border-white/40"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#B3905E]">Edit Order</h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <label className="block mb-4 font-semibold">
              Customer Name <span className="text-red-500">*</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B3905E]"
                required
              />
            </label>

            <label className="block mb-4 font-semibold">
              Email <span className="text-red-500">*</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B3905E]"
              />
            </label>

            <label className="block mb-4 font-semibold">
              Phone <span className="text-red-500">*</span>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B3905E]"
              />
            </label>

            <label className="block mb-4 font-semibold">
              Address <span className="text-red-500">*</span>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B3905E]"
              />
            </label>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <Button
                variant='secondary'
                type="submit"
                className="px-4 py-2 bg-[#B3905E] text-white hover:bg-[#a37847] rounded-lg cursor-pointer flex items-center justify-center gap-2"
                disabled={saving} // disable while saving
              >
                {saving ? (
                  <>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

            </div>
          </form>
        </div>
      )}
      {error && (
  <SomethingWentWrong
    message={error}
    onRetry={() => {
      setError(null); // clear error
      fetchOrders();  // or any retry logic you prefer
    }}
  />
)}
    </main>
  );
}
