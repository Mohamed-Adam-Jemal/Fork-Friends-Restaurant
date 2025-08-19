'use client';

import { useEffect, useState, useMemo } from 'react';
import FilteringBar from '@/components/ui/FilteringBar';
import Spinner from '@/components/ui/Spinner';
import Dropdown from '@/components/ui/Dropdown';

type TeamMember = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  quote?: string;
  image?: string;
};

const roles = ['All Roles', 'Admin', 'Chef', 'Waiter', 'Manager'];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState(roles[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/team');
        if (!res.ok) throw new Error('Failed to fetch team members');
        const data: TeamMember[] = await res.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  // Filter members by name or email & role
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchLower = filterName.trim().toLowerCase();
      const nameMatch = member.name.toLowerCase().includes(searchLower);
      const emailMatch = member.email.toLowerCase().includes(searchLower);
      const matchesRole = filterRole === 'All Roles' || member.role === filterRole;
      return (nameMatch || emailMatch) && matchesRole;
    });
  }, [members, filterName, filterRole]);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="!text-3xl font-bold mb-8 text-[#B3905E]">Manage Team Members</h1>

      {/* Filter Bar */}
      <FilteringBar>
        {/* Search by Name or Email */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
        />

        <Dropdown
          label="Filter by Role"
          options={roles}
          selected={filterRole === "All Roles" ? null : filterRole} // pass null if "All Roles"
          onSelect={(value) => setFilterRole(value ?? "All Roles")}
          buttonClassName="bg-white px-5 py-2 w-48 rounded-full shadow-md flex items-center justify-between text-black"
          listClassName="text-black"
        />


      </FilteringBar>

      {/* Loading/Error */}
      {loading && <Spinner name='Loading team members...' />}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member) => {
          const initials = member.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center text-3xl text-gray-400 select-none">
                  {initials}
                </div>
              )}

              <h2 className="!text-lg font-semibold text-[#B3905E]">{member.name}</h2>
              <p className="!text-gray-600 text-sm mb-1">{member.email}</p>
              <p className="!text-gray-600 text-sm mb-1">{member.phone}</p>
              <p className="!text-gray-500 text-xs uppercase tracking-wide">{member.role}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
