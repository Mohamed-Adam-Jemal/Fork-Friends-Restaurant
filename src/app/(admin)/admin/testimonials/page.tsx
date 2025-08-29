'use client';

import { useEffect, useState } from 'react';
import { Trash2, Star, StarHalf } from 'lucide-react';
import FilteringBar from '@/components/ui/FilteringBar';
import Spinner from '@/components/ui/Spinner';
import ConfirmDialog from '@/components/ConfirmDialog';
import SomethingWentWrong from '@/components/SomethingWentWrong';

type Testimonial = {
  id: number;
  name: string;
  photo: string;
  rating: number;
  content: string;
  created_at: string;
};

export default function AdminTestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = testimonials.filter((t) => {
      const matchesName = t.name.toLowerCase().includes(searchName.trim().toLowerCase());
      const matchesDate = searchDate
        ? t.created_at &&
          !isNaN(new Date(t.created_at).getTime()) &&
          new Date(t.created_at).toISOString().split('T')[0] === searchDate
        : true;
      return matchesName && matchesDate;
    });
    setFilteredTestimonials(filtered);
  }, [testimonials, searchName, searchDate]);

  const deleteTestimonial = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      fetchTestimonials();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while deleting.');
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalf key={i} size={16} className="text-yellow-500 fill-yellow-500" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <FilteringBar className="w-full mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
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
          <Spinner name="testimonials" />
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {filteredTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 min-w-[280px]"
              >
                {/* Header: photo + name */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <h2 className="!text-lg font-semibold text-[#B3905E]">{t.name}</h2>
                    {renderStars(t.rating)}
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-gray-600 mb-1 font-semibold">Testimonial:</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 text-gray-800 text-sm whitespace-pre-wrap break-words">
                  {t.content}
                </div>

                {/* Footer: created date + actions */}
                <div className="flex justify-between items-center mt-5">
                  <span className="text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleString()}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(t.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                      disabled={deletingId === t.id}
                    >
                      <Trash2 size={14} />
                      {deletingId === t.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          show={!!showDeleteConfirm}
          title="Confirm Deletion"
          message="Are you sure you want to delete this testimonial? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteTestimonial(showDeleteConfirm!)}
          loading={deletingId === showDeleteConfirm}
        />
      )}

      {error && (
        <SomethingWentWrong
          message={error}
          onRetry={() => {
            setError(null);
            fetchTestimonials();
          }}
        />
      )}
    </main>
  );
}
