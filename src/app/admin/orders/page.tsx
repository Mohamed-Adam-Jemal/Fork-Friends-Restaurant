// app/admin/orders/page.tsx
import React from "react";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-burgundy">Orders</h1>
      <p>List of orders will be displayed here.</p>
      {/* You can add an orders table with status, customer info, total, etc. */}
    </div>
  );
}
