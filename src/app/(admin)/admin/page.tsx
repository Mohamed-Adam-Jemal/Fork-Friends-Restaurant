// app/(admin)/admin/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#B3905E]">Welcome, {session.user?.name || session.user?.email}!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example dashboard cards (customize as needed) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold">Today's Orders</h2>
          <p className="text-gray-500 mt-2 text-2xl">32</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold">New Reservations</h2>
          <p className="text-gray-500 mt-2 text-2xl">14</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold">Team Online</h2>
          <p className="text-gray-500 mt-2 text-2xl">5</p>
        </div>
      </div>
    </div>
  );
}
