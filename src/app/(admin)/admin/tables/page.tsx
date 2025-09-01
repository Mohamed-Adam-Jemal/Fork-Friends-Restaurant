'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit3, X, PlusCircle } from 'lucide-react';
import FilteringBar from '@/components/ui/FilteringBar';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ConfirmDialog';
import SomethingWentWrong from '@/components/SomethingWentWrong';
import Dropdown from '@/components/ui/Dropdown';
import { FiX } from 'react-icons/fi';

type Table = {
  id: number;
  table_number: number;
  seats: number;
  type: string;
  availability: boolean;
  created_at: string;
};

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [searchTableNum, setSearchTableNum] = useState('');
  const [searchSeats, setSearchSeats] = useState('');
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [searchAvailability, setSearchAvailability] = useState<'all' | 'available' | 'reserved'>('all');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  type FormData = {
    table_number: number;
    seats: number;
    type: string;
    availability: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    table_number: 0,
    seats: 0,
    type: '',
    availability: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tables');
      if (!res.ok) throw new Error('Failed to fetch tables');
      const data = await res.json();
      setTables(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = tables.filter((table) => {
      const matchesTable = table.table_number
        .toString()
        .includes(searchTableNum.trim());

      const matchesSeats = searchSeats
        ? table.seats.toString().includes(searchSeats.trim())
        : true;

      const matchesAvailability =
        searchAvailability === 'all'
          ? true
          : searchAvailability === 'available'
          ? table.availability
          : !table.availability;

      return matchesTable && matchesSeats && matchesAvailability;
    });

    setFilteredTables(filtered);
  }, [tables, searchTableNum, searchSeats, searchAvailability]);



  const deleteTable = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/tables/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete table');
      fetchTables();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while deleting.');
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const toggleAvailability = async (table: Table) => {
    setUpdatingId(table.id);
    setError(null);
    const newAvailability = !table.availability;
    try {
      const res = await fetch(`/api/tables/${table.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newAvailability }),
      });
      if (!res.ok) throw new Error('Failed to update availability');
      fetchTables();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while updating availability.');
    } finally {
      setUpdatingId(null);
    }
  };

  const openEditForm = (table: Table | null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        table_number: table.table_number,
        seats: table.seats,
        type: table.type,
        availability: table.availability,
      });
    } else {
      setEditingTable(null);
      setFormData({
        table_number: 0,
        seats: 0,
        type: '',
        availability: true,
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let res;
      if (editingTable) {
        // Editing an existing table (PUT)
        res = await fetch(`/api/tables/${editingTable.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Adding a new table (POST)
        res = await fetch(`/api/tables`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error('Failed to save table');

      setShowForm(false);
      fetchTables();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">

        <button
        onClick={() => openEditForm(null)}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition cursor-pointer flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle size={23} /> Add New Table
      </button>


      <FilteringBar className="w-full mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by table number..."
          value={searchTableNum}
          onChange={(e) => setSearchTableNum(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black cursor-pointer"
        />

        <input
          type="text"
          placeholder="Search by seats..."
          value={searchSeats}
          onChange={(e) => setSearchSeats(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black cursor-pointer"
        />
        <Dropdown
          label="Filter by availability"
          options={["All", "Available", "Reserved"]}
          selected={
            searchAvailability === "all"
              ? "All"
              : searchAvailability === "available"
              ? "Available"
              : "Reserved"
          }
          onSelect={(value) => {
            if (value === "Available") setSearchAvailability("available");
            else if (value === "Reserved") setSearchAvailability("reserved");
            else setSearchAvailability("all");
          }}
          buttonClassName="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 text-left focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition cursor-pointer"
          listClassName="w-full"
        />
      </FilteringBar>
      


      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spinner name="tables" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 min-w-[280px]"
              >
                <div className="relative flex flex-row justify-between items-start">
                  <div>
                    <h2 className="!text-xl font-semibold text-[#B3905E] mb-2">
                      Table {table.table_number}
                    </h2>
                    <p className="!text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Seats:</span> {table.seats}
                    </p>
                    <p className="!text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Type:</span> {table.type}
                    </p>
                    <span className="text-xs text-gray-400">
                      Created: {new Date(table.created_at).toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`relative top-0 right-0 w-fit px-3 py-2 rounded-full text-xs font-semibold transition-colors duration-300 ${
                      table.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {table.availability ? 'Available' : 'Reserved'}
                  </span>
                </div>

                <div className="mt-5 flex justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => openEditForm(table)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(table.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    disabled={deletingId === table.id}
                  >
                    <Trash2 size={14} />
                    {deletingId === table.id ? 'Deleting…' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAvailability(table)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer disabled:opacity-50"
                    disabled={updatingId === table.id}
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          show={!!showDeleteConfirm}
          title="Confirm Deletion"
          message="Are you sure you want to delete this table? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteTable(showDeleteConfirm!)}
          loading={deletingId === showDeleteConfirm}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-95 p-7 rounded-3xl shadow-2xl w-full max-w-90 max-h-[90vh] overflow-auto border border-white/40"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#B3905E]">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <FiX size={24} className='hover:text-[#B3905E] transition cursor-pointer' />
              </button>
            </div>

            <label className="block mb-4 font-semibold">
              Seats <span className="text-red-500">*</span>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B3905E]"
                required
              />
            </label>

            <label className="block mb-4 font-semibold">
            Table Type <span className="text-red-500">*</span>
            <div className="mt-1">
              <Dropdown
                label="Select type"
                options={["Indoor", "Outdoor"]}
                selected={formData.type}
                onSelect={(value) => setFormData({ ...formData, type: value || "" })}
                buttonClassName="w-full border border-gray-300 rounded-xl px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-[#B3905E]"
                listClassName="w-full"
              />
            </div>
          </label>

            <label className="flex items-center cursor-pointer select-none mb-4">
              <input
                type="checkbox"
                checked={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.checked })
                }
                className="sr-only"
              />
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                  formData.availability ? 'bg-[#B3905E]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                    formData.availability ? 'translate-x-6' : ''
                  }`}
                />
              </div>
              <span className="ml-3 font-semibold text-gray-900">Availability</span>
            </label>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <Button
                variant="secondary"
                type="submit"
                className="px-4 py-2 bg-[#B3905E] text-white hover:bg-[#a37847] rounded-lg cursor-pointer flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? 'Saving...' : editingTable ? 'Save Changes' : 'Add Table'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <SomethingWentWrong
          message={error}
          onRetry={() => {
            setError(null);
            fetchTables();
          }}
        />
      )}
    </main>
  );
}
