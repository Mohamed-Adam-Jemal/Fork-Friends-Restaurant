"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Reservation = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  occasion?: string;
  seating: string;
  tableNumber: number;
};

type Table = {
  number: number;
  seats: number;
  type: string;
  availability: boolean;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Record<number, Table>>({});
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

      const uniqueTableNumbers = Array.from(new Set(data.map(r => r.tableNumber)));
      const tablesData: Record<number, Table> = {};

      await Promise.all(
        uniqueTableNumbers.map(async (tableNum) => {
          try {
            const tableRes = await fetch(`/api/table/${tableNum}`);
            if (tableRes.ok) {
              const tableData: Table = await tableRes.json();
              tablesData[tableNum] = tableData;
            }
          } catch (err) {
            console.error(`Failed to fetch table ${tableNum}`, err);
          }
        })
      );

      setTables(tablesData);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  }

  async function handleDelete(id: number) {
  const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/reservation/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    setReservations(prev => prev.filter(r => r.id !== id));
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Something went wrong while deleting.");
  }
}


  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-[#B3905E] mb-8">Reservations Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-6 mb-8">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Filter by Date</label>
          <input
            type="date"
            value={viewDate}
            onChange={(e) => setViewDate(e.target.value)}
            className="border rounded px-3 py-2 w-48"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Filter by Time</label>
          <select
            value={viewTime}
            onChange={(e) => setViewTime(e.target.value)}
            className="border rounded px-3 py-2 w-48"
          >
            <option value="">All Times</option>
            <option>5:00 PM</option>
            <option>6:00 PM</option>
            <option>7:00 PM</option>
            <option>8:00 PM</option>
          </select>
        </div>

        <button
          onClick={fetchReservations}
          className="bg-[#B3905E] text-white px-6 py-2 rounded hover:bg-[#a28054]"
        >
          Refresh
        </button>
      </div>

      {/* Reservation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.length > 0 ? (
          reservations.map((res) => {
            const initials =
              (res.firstName?.[0] ?? "") + (res.lastName?.[0] ?? "");
            return (
              <div
                key={res.id}
                className="w-70 relative bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedReservation(res);
                  setModalOpen(true);
                }}
              >
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent modal from opening
                    handleDelete(res.id);
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors scale-120 cursor-pointer"
                  title="Delete Reservation"
                  aria-label="Delete Reservation"
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                </button>

                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center text-3xl text-gray-400 select-none">
                  {(res.firstName?.[0] ?? "") + (res.lastName?.[0] ?? "")}
                </div>

                <h2 className="text-lg font-semibold text-[#B3905E]">
                  {res.firstName} {res.lastName}
                </h2>
                <p className="text-gray-600 text-sm mb-1">{res.date.split("T")[0]} at {res.time}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Guests: {res.guests} • Table #{res.tableNumber}
                </p>
              </div>

            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center">No reservations found.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedReservation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-[#B3905E] mb-4">
              Reservation Details
            </h2>

            <div className="space-y-2 text-sm text-gray-800">
              <p><strong>Name:</strong> {selectedReservation.firstName} {selectedReservation.lastName}</p>
              <p><strong>Email:</strong> {selectedReservation.email}</p>
              <p><strong>Phone:</strong> {selectedReservation.phone}</p>
              <p><strong>Date:</strong> {selectedReservation.date.split("T")[0]}</p>
              <p><strong>Time:</strong> {selectedReservation.time}</p>
              <p><strong>Guests:</strong> {selectedReservation.guests}</p>
              <p><strong>Occasion:</strong> {selectedReservation.occasion || "N/A"}</p>
              <p><strong>Seating:</strong> {selectedReservation.seating}</p>
              <p><strong>Special Requests:</strong> {selectedReservation.specialRequests || "None"}</p>
              <hr className="my-2" />
              <p>
                <strong>Table Info:</strong> #{tables[selectedReservation.tableNumber]?.number ?? selectedReservation.tableNumber} —{" "}
                {tables[selectedReservation.tableNumber]?.type ?? "N/A"}, {tables[selectedReservation.tableNumber]?.seats ?? "N/A"} seats
              </p>
              <p>
                <strong>Available:</strong> {tables[selectedReservation.tableNumber]?.availability !== undefined
                  ? tables[selectedReservation.tableNumber]?.availability ? "Yes" : "No"
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
