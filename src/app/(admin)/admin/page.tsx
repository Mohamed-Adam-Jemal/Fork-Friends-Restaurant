// app/(admin)/admin/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const userEmail = session.user.email;

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
      {/* Welcome Header */}
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 break-words">
        Welcome back, {userEmail}
      </h1>
      <p className="text-gray-500 mt-1">Here’s your overview for today.</p>
    </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Today's Orders" value="32" />
        <DashboardCard title="New Reservations" value="14" />
        <DashboardCard title="Team Online" value="5" />
        <DashboardCard title="Pending Reviews" value="7" />
      </div>

      {/* Revenue Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="!text-lg font-semibold text-gray-800 mb-4">Revenue Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RevenueCard label="Today" amount="$1,250" />
          <RevenueCard label="This Week" amount="$8,450" />
          <RevenueCard label="This Month" amount="$32,100" />
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="!text-lg font-semibold text-gray-800 mb-4">Upcoming Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 font-medium text-gray-600">Time</th>
                <th className="px-4 py-2 font-medium text-gray-600">Guests</th>
              </tr>
            </thead>
            <tbody>
              <ReservationRow name="John Doe" time="6:30 PM" guests={4} />
              <ReservationRow name="Alice Smith" time="7:00 PM" guests={2} />
              <ReservationRow name="Mark Lee" time="7:30 PM" guests={6} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders in Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="!text-lg font-semibold text-gray-800 mb-4">Orders in Progress</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600">Order ID</th>
                <th className="px-4 py-2 font-medium text-gray-600">Items</th>
                <th className="px-4 py-2 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow id="#1023" items="Pasta, Salad" status="Preparing" />
              <OrderRow id="#1024" items="Pizza, Coke" status="Cooking" />
              <OrderRow id="#1025" items="Burger, Fries" status="Out for delivery" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-start">
      <h3 className="!text-lg font-medium">{title}</h3>
      <p className="mt-2 !text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function RevenueCard({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-gray-500">{label}</p>
      <p className="!text-xl font-bold text-gray-800 mt-1">{amount}</p>
    </div>
  );
}

function ReservationRow({ name, time, guests }: { name: string; time: string; guests: number }) {
  return (
    <tr className="border-t border-gray-100">
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{time}</td>
      <td className="px-4 py-2">{guests}</td>
    </tr>
  );
}

function OrderRow({ id, items, status }: { id: string; items: string; status: string }) {
  return (
    <tr className="border-t border-gray-100">
      <td className="px-4 py-2">{id}</td>
      <td className="px-4 py-2">{items}</td>
      <td className="px-4 py-2">{status}</td>
    </tr>
  );
}
