'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUsers,
  FaUtensils,
  FaCalendarAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaTable,
  FaTableTennis,
  FaTablet,
  FaTabletAlt,
  FaDeskpro,
  FaDesktop,
  FaHeadSideMask,
  Fa500Px,
  FaAppStoreIos,
  FaPhoneSquare,
  FaNotesMedical,
} from "react-icons/fa";

import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/ui/Spinner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Fa4, FaClipboardQuestion, FaCodePullRequest, FaNoteSticky, FaPersonCircleQuestion, FaPersonDotsFromLine, FaRegNoteSticky } from "react-icons/fa6";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <FaHome /> },
  { href: "/admin/team", label: "Team", icon: <FaUsers /> },
  { href: "/admin/menu", label: "Menu", icon: <FaUtensils /> },
  { href: "/admin/reservations", label: "Reservations", icon: <FaCalendarAlt /> },
  { href: "/admin/orders", label: "Orders", icon: <FaClipboardList /> },
  { href: "/admin/tables", label: "Tables", icon: <FaTable/> },
  { href: "/admin/contact", label: "Contact", icon: <FaNoteSticky/> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    setLogoutConfirmOpen(false);
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-[#C8AD82] text-white flex items-center justify-between px-4 py-4 shadow-lg">
        <h2 className="!text-2xl font-extrabold tracking-wide !text-white">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none cursor-pointer">
          {sidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 md:h-screen h-full w-72 bg-white text-[#B3905E] flex flex-col p-6 shadow-xl transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="hidden md:block mb-10">
          <h2 className="!text-3xl font-extrabold tracking-wide text-center text-[#B3905E]">
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
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-semibold text-xl ${
                  isActive
                    ? "bg-[#C8AD82] text-white shadow"
                    : "text-[#B3905E] hover:bg-[#F1E8D8] hover:text-[#B3905E]"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <button
            onClick={() => setLogoutConfirmOpen(true)}
            className="flex justify-center items-center px-5 py-3 rounded-xl bg-red-100 hover:bg-red-200 transition text-red-700 font-semibold shadow-sm w-full cursor-pointer"
          >
            <FaSignOutAlt className="text-lg mr-2" />
            Logout
          </button>

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
      <main className="h-screen flex-1 p-6 md:px-10 pt-0 bg-[#F1E8D8] overflow-y-auto">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmDialog
        show={logoutConfirmOpen}
        title="Confirm Logout"
        message={"Are you sure you want to log out?"}
        confirmText="Logout"
        cancelText="Cancel"
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={handleSignOut}
        loading={loading}
      />
    </div>
  );
}
