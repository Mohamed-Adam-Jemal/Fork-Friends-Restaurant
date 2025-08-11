'use client';

import { useEffect, useState, useMemo } from 'react';
import FilteringBar from "@/components/ui/FilteringBar";

type User = {
  id: number;
  email: string;
  password: string; // won't display
  firstName: string;
  name: string;
  age: number; // optionally display if you want
  role: string;
};

const roles = ['All Roles', 'Admin', 'Chef', 'Waiter', 'Manager'];

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState(roles[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filter users by name (firstName or name) & role
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.name}`.toLowerCase();
      const matchesName = fullName.includes(filterName.trim().toLowerCase());
      const matchesRole = filterRole === 'All Roles' || user.role === filterRole;
      return matchesName && matchesRole;
    });
  }, [users, filterName, filterRole]);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#B3905E]">Team Members</h1>

      {/* Filter Bar */}
      <FilteringBar>
        {/* Search by Name */}
        <input
          type="text"
          placeholder="Search by name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-white px-5 py-2 w-48 rounded-full shadow-md flex items-center justify-between text-black"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </FilteringBar>

      {/* Loading/Error */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredUsers.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">
            No users match your filters.
          </p>
        )}

        {filteredUsers.map((user) => {
          const initials = `${user.firstName.charAt(0)}${user.name.charAt(0)}`.toUpperCase();

          return (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center text-3xl text-gray-400 select-none">
                {initials}
              </div>

              <h2 className="text-lg font-semibold text-[#B3905E]">
                {user.firstName} {user.name}
              </h2>
              <p className="text-gray-600 text-sm mb-1">{user.email}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide">{user.role}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
