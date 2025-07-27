// /app/admin/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Welcome, {session?.user?.email ?? "Guest"}</h1>
      {/* Your admin page content */}
    </main>
  );
}
