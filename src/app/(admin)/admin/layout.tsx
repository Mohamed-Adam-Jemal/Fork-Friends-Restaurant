'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUsers,
  FaUtensils,
  FaCalendarAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <FaHome /> },
  { href: "/admin/team", label: "Team", icon: <FaUsers /> },
  { href: "/admin/menu", label: "Menu", icon: <FaUtensils /> },
  { href: "/admin/reservations", label: "Reservations", icon: <FaCalendarAlt /> },
  { href: "/admin/orders", label: "Orders", icon: <FaClipboardList /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-[#C8AD82] text-white flex items-center justify-between px-4 py-4 shadow-lg">
        <h2 className="text-xl font-extrabold tracking-wide">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none">
          {sidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 md:h-screen h-full w-64 bg-white text-[#B3905E] flex flex-col p-6 shadow-xl transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="hidden md:block mb-10">
          <h2 className="text-3xl font-extrabold tracking-wide text-center text-[#B3905E] drop-shadow-md">
            Admin Panel
          </h2>
        </div>

        <nav className="flex flex-col gap-4">
          {navLinks.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-semibold text-lg ${
                  isActive
                    ? "bg-[#C8AD82] text-white shadow"
                    : "text-[#B3905E] hover:bg-[#F1E8D8] hover:text-[#B3905E]"
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-100 hover:bg-red-200 transition text-red-700 font-semibold shadow-sm"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </Link>

          <p className="text-sm text-[#B3905E] text-center mt-6">
            &copy; {new Date().getFullYear()} Fork & Friends
          </p>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Content */}
      <main className="h-screen flex-1 p-6 md:px-10 pt-0 bg-[#F1E8D8] overflow-hidden">
        {children}
      </main>

    </div>
  );
}
