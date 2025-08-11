// app/(admin)/admin/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  // Create server-side Supabase client
  const supabase = await createClient();

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const userEmail = session.user.email;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#B3905E]">
        Welcome, {userEmail}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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