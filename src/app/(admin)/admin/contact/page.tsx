'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import FilteringBar from '@/components/ui/FilteringBar';
import Spinner from '@/components/ui/Spinner';
import ConfirmDialog from '@/components/ConfirmDialog';
import SomethingWentWrong from '@/components/SomethingWentWrong';

type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
};

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = contacts.filter((c) => {
      const matchesPhone = c.phone.toLowerCase().includes(searchPhone.trim().toLowerCase());
      const matchesDate = searchDate
        ? c.created_at &&
          !isNaN(new Date(c.created_at).getTime()) &&
          new Date(c.created_at).toISOString().split('T')[0] === searchDate
        : true;
      return matchesPhone && matchesDate;
    });
    setFilteredContacts(filtered);
  }, [contacts, searchPhone, searchDate]);

  const deleteContact = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete contact');
      fetchContacts();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while deleting.');
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <FilteringBar className="w-full mb-6">
        <input
          type="text"
          placeholder="Search by phone number..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black cursor-pointer"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
        />
      </FilteringBar>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spinner name="contacts" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 min-w-[280px]"
              >
                <h2 className="!text-xl font-semibold text-[#B3905E] mb-2">
                  {contact.first_name} {contact.last_name}
                </h2>
                <p className="!text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Email:</span> {contact.email}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Phone:</span> {contact.phone}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Subject:</span> {contact.subject}
                </p>
                {/* Message */}
                <p className="text-sm text-gray-600 mb-1 font-semibold">Message:</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 text-gray-800 text-sm whitespace-pre-wrap break-words">
                    {contact.message}
                </div>
                <div className="flex justify-between items-center mt-5">
                    {/* Timestamp */}
                <span className="text-xs text-gray-400">
                    {new Date(contact.created_at).toLocaleString()}
                </span>
                {/* Delete Button */}
                <div className="flex gap-2 flex-wrap">
                    <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(contact.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    disabled={deletingId === contact.id}
                    >
                    <Trash2 size={14} />
                    {deletingId === contact.id ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
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
          message="Are you sure you want to delete this contact? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteContact(showDeleteConfirm!)}
          loading={deletingId === showDeleteConfirm}
        />
      )}

      {error && (
        <SomethingWentWrong
          message={error}
          onRetry={() => {
            setError(null);
            fetchContacts();
          }}
        />
      )}
    </main>
  );
}
