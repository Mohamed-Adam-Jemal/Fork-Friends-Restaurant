"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import FilteringBar from "@/components/ui/FilteringBar";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ConfirmDialog";

type Reservation = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string; // match API
  occasion?: string;
  seating: string;
  table_id?: {  // optional in case null
    id: number;
    table_number: number;
    seats: number;
    type: string;
    availability: boolean;
  } | null;
};


export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteReservationId, setDeleteReservationId] = useState<number | null>(null);
  


  const [viewDate, setViewDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [viewTime, setViewTime] = useState<string>("");

  useEffect(() => {
    fetchReservations();
  }, [viewDate, viewTime]);

  async function fetchReservations() {
    const query = new URLSearchParams();
    if (viewDate) query.append("date", viewDate);
    if (viewTime) query.append("time", viewTime);

    try {
      const res = await fetch(`/api/reservations?${query.toString()}`);
      const data: Reservation[] = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  }

const [deleteLoading, setDeleteLoading] = useState(false);

async function handleDelete(id: number) {
  setDeleteLoading(true); // start loading
  try {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    setReservations(prev => prev.filter(r => r.id !== id));
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Something went wrong while deleting.");
  } finally {
    setDeleteLoading(false); // stop loading
    setDeleteReservationId(null); // close modal
  }
}

  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Filter bar */}
      <FilteringBar>
        {/* Date filter */}
        <div className="flex flex-col">
          <input
            type="date"
            value={viewDate}
            onChange={(e) => setViewDate(e.target.value)}
            className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-48 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
          />
        </div>

        {/* Time dropdown */}
        <div className="flex flex-col relative z-30">
          <button
            type="button"
            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
            className="bg-white px-5 py-2 w-48 rounded-full shadow-md flex items-center justify-between text-black cursor-pointer hover:bg-[#B3905E]/50 hover:text-white transition font-semibold"
          >
            {viewTime || "All Times"}
            <svg
              className={`h-5 w-5 ml-2 transition-transform ${timeDropdownOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <ul
            className={`absolute w-full mt-12 bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
              timeDropdownOpen ? "max-h-96 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95 pointer-events-none"
            }`}
          >
            {["", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map((time) => (
              <li
                key={time || "all"}
                onClick={() => {
                  setViewTime(time);
                  setTimeDropdownOpen(false);
                }}
                className={`px-5 py-2 cursor-pointer hover:bg-[#B3905E]/50 hover:text-white ${
                  viewTime === time ? "bg-[#B3905E] text-white font-semibold" : ""
                }`}
              >
                {time || "All Times"}
              </li>
            ))}
          </ul>
        </div>

        {/* Refresh button */}
        <div className="flex items-end">
          <Button onClick={fetchReservations} variant="secondary" className="!rounded-full">
            Refresh
          </Button>
        </div>
      </FilteringBar>

      {/* Reservation cards */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
  {reservations.length > 0 ? (
    reservations.map((res) => (
      <div
        key={res.id}
        className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 min-w-[280px]"
      >
        {/* Delete button */}
        <button
          onClick={() => setDeleteReservationId(res.id)}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          title="Delete Reservation"
        >
          <Trash2 size={23} strokeWidth={1.8} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#B3905E] flex items-center justify-center text-lg font-bold text-white shadow-md min-w-[56px]">
            {`${res.first_name?.[0] ?? ""}${res.last_name?.[0] ?? ""}`}
          </div>
          <div>
            <h2 className="!text-lg font-semibold text-gray-900">{res.first_name} {res.last_name}</h2>
            <p className="text-sm text-gray-500 break-all">{res.email}</p>
            <p className="text-sm text-gray-500">{res.phone}</p>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="flex flex-col gap-1 text-sm text-gray-700 mt-3">
          <p><span className="font-semibold text-gray-800">Date:</span> {res.date.split("T")[0]}</p>
          <p><span className="font-semibold text-gray-800">Time:</span> {res.time}</p>
          <p><span className="font-semibold text-gray-800">Guests:</span> {res.guests}</p>
          <p><span className="font-semibold text-gray-800">Occasion:</span> {res.occasion || "N/A"}</p>
          <p><span className="font-semibold text-gray-800">Seating:</span> {res.seating}</p>
          <p><span className="font-semibold text-gray-800">Special Requests:</span> {res.special_requests || "None"}</p>
        </div>

        {/* Table Info */}
        <div className="mt-4 p-3 bg-[#FDF6EC] rounded-xl flex justify-between items-center border border-[#F0E2D0]">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500">Table ID</span>
            <span className="text-lg font-bold text-gray-900">{res.table_id?.id ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500">Table Number</span>
            <span className="text-lg font-bold text-gray-900">{res.table_id?.table_number ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500">Seats</span>
            <span className="text-lg font-bold text-gray-900">{res.table_id?.seats ?? "N/A"}</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 col-span-full text-center mt-10">No reservations found.</p>
  )}
</div>

{/* Modal */}
{modalOpen && selectedReservation && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
        onClick={() => setModalOpen(false)}
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold text-[#B3905E] mb-4">Reservation Details</h2>

      <div className="space-y-2 text-sm text-gray-800">
        <p><strong>Name:</strong> {selectedReservation.first_name} {selectedReservation.last_name}</p>
        <p><strong>Email:</strong> {selectedReservation.email}</p>
        <p><strong>Phone:</strong> {selectedReservation.phone}</p>
        <p><strong>Date:</strong> {selectedReservation.date.split("T")[0]}</p>
        <p><strong>Time:</strong> {selectedReservation.time}</p>
        <p><strong>Guests:</strong> {selectedReservation.guests}</p>
        <p><strong>Occasion:</strong> {selectedReservation.occasion || "N/A"}</p>
        <p><strong>Seating:</strong> {selectedReservation.seating}</p>
        <p><strong>Special Requests:</strong> {selectedReservation.special_requests || "None"}</p>
        <hr className="my-3" />
        <div className="p-3 bg-[#FDF6EC] rounded-xl flex justify-between items-center border border-[#F0E2D0]">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500">Table Number</span>
            <span className="text-lg font-bold text-gray-900">{selectedReservation.table_id?.table_number ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500">Seats</span>
            <span className="text-lg font-bold text-gray-900">{selectedReservation.table_id?.seats ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500">Type</span>
            <span className="text-lg font-bold text-gray-900">{selectedReservation.table_id?.type ?? "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
<ConfirmDialog
  show={!!deleteReservationId}
  title="Confirm Deletion"
  message="Are you sure you want to delete this reservation? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  onCancel={() => setDeleteReservationId(null)}
  onConfirm={() => deleteReservationId && handleDelete(deleteReservationId)}
  loading={deleteLoading} // pass the loading prop
/>


    </main>
  );
}
