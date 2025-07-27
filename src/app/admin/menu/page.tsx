// app/admin/menu/page.tsx
"use client";

import React, { useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, available: true },
    { id: 2, name: "Caesar Salad", category: "Salad", price: 8.99, available: false },
  ]);

  const handleEdit = (id: number) => {
    alert(`Edit menu item ${id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-burgundy">Menu Management</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price ($)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Available</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map(({ id, name, category, price, available }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {available ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => handleEdit(id)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {menuItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
