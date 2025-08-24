"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";
import Dropdown from "@/components/ui/Dropdown";

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
    occasion: "",
    seating: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [noTableModalOpen, setNoTableModalOpen] = useState(false);
  const [reservedTableNumber, setReservedTableNumber] = useState<number | null>(null);

  // Separate dropdown open states:
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [seatingDropdownOpen, setSeatingDropdownOpen] = useState(false);
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const [occasionDropdownOpen, setOccasionDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage("");
  setReservedTableNumber(null);

  try {
    // 1️⃣ Submit reservation to your backend
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        guests: parseInt(formData.guests, 10),
      }),
    });

    if (res.status === 409) {
      // No table available
      setNoTableModalOpen(true);
      return;
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit reservation");
    }

    const data = await res.json();
    setReservedTableNumber(data.table_id.table_number);
    console.log("Reservation created:", data);
    setShowConfirmation(true);

    // 2️⃣ Send email with reservation details
    await fetch("/api/send-email/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email, // dynamic recipient
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        seating: formData.seating,
        occasion: formData.occasion,
        specialRequests: formData.specialRequests,
        tableNumber: data.table_id.table_number, // include assigned table
      }),
    });

  } catch (error: any) {
    setErrorMessage(error.message || "Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[#333333] opacity-70 z-10" />
      <img
        src="/images/bg-reservation.jpg" // <-- replace with your actual image path
        alt="Background"
        className="w-full h-full object-cover z-0"
      />
    </div>
        {/* Hero Section */}
        <section className="relative pt-16 pb-10 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white">
              Reserve Your Table
            </h1>
            <p className="text-xl  max-w-2xl mx-auto !text-white">
              Join us for an unforgettable dining experience. Book your table and let us create memorable moments for you.
            </p>
          </div>
        </section>

        {/* Reservation Form */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gold/20">
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="!text-xl font-semibold border-b border-[#333333] pb-2">
                        Personal Information
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                          Seating Preference *
                        </label>
                        <Dropdown
                          label={formData.seating || "Select seating preference"}
                          isOpen={seatingDropdownOpen}
                          onToggle={() => setSeatingDropdownOpen(prev => !prev)}
                          onSelect={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              seating: value ?? ""
                            }));
                            setSeatingDropdownOpen(false);
                          }}
                          selected={formData.seating}
                          options={["Indoor", "Outdoor"]}
                          buttonClassName="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300 text-left"
                          listClassName="w-full"
                        />
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="space-y-6">
                      <h3 className="!text-xl font-semibold border-b border-[#333333] pb-2">
                        Reservation Details
                      </h3>

                      <div>
                        <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                          Preferred Time *
                        </label>
                        <Dropdown
                          label={formData.time || "Select a time"}
                          isOpen={timeDropdownOpen}
                          onToggle={() => setTimeDropdownOpen(prev => !prev)}
                          onSelect={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              time: value ?? ""
                            }));
                            setTimeDropdownOpen(false);
                          }}
                          selected={formData.time}
                          options={[
                            "6:00 PM",
                            "6:30 PM",
                            "7:00 PM",
                            "7:30 PM",
                            "8:00 PM",
                            "8:30 PM",
                            "9:00 PM",
                          ]}
                          buttonClassName="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300 text-left"
                          listClassName="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                          Number of Guests *
                        </label>
                        <Dropdown
                          label={`${formData.guests} ${formData.guests === "1" ? "Guest" : "Guests"}`}
                          isOpen={guestsDropdownOpen}
                          onToggle={() => setGuestsDropdownOpen(prev => !prev)}
                          onSelect={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              guests: value ?? "1"
                            }));
                            setGuestsDropdownOpen(false);
                          }}
                          selected={formData.guests}
                          options={[...Array(12)].map((_, i) => (i + 1).toString())}
                          buttonClassName="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300 text-left"
                          listClassName="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                          Special Occasion (Optional)
                        </label>
                        <Dropdown
                          label={formData.occasion || "Select an occasion"}
                          isOpen={occasionDropdownOpen}
                          onToggle={() => setOccasionDropdownOpen(prev => !prev)}
                          onSelect={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              occasion: value ?? ""
                            }));
                            setOccasionDropdownOpen(false);
                          }}
                          selected={formData.occasion}
                          options={[
                            "Birthday",
                            "Anniversary",
                            "Business",
                            "Celebration",
                            "Other",
                          ]}
                          buttonClassName="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300 text-left"
                          listClassName="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-8">
                    <label className="block text-base font-semibold text-neutral-800 dark:text-white mb-2">
                      Special Requests or Dietary Requirements (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300 resize-none"
                      placeholder="Please let us know about any allergies, dietary restrictions, or special requests..."
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-red-600 mb-6 text-center font-medium">{errorMessage}</p>
                  )}

                  {/* Submit Button */}
                  <div className="text-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="xl"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    >
                      Confirm Reservation
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-8 p-6 bg-gold/10 rounded-lg border border-gold/20">
                    <h4 className="font-semibold mb-2">Please Note:</h4>
                    <ul className="text-sm  space-y-1">
                      <li>• Reservations are held for 15 minutes past the reserved time</li>
                      <li>• For parties of 8 or more, please call us directly at (555) 123-4567</li>
                      <li>• Cancellations must be made at least 2 hours in advance</li>
                      <li>• We accommodate dietary restrictions with advance notice</li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* No Table Available Modal */}
      {noTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h2 className="!text-2xl font-bold mb-4">No Tables Available</h2>
            <p className="mb-6">
              Sorry, we currently have no available tables for your selected date and time.
              Please try another time or date. <br></br> For further assistance, call us at <br></br> (111) 111-1111. Thank you for your understanding!
            </p>
            <Button
              variant="primary"
              onClick={() => setNoTableModalOpen(false)}
              size="md"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred Background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full z-50">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
              onClick={() => setShowConfirmation(false)}
            >
              &times;
            </button>

            <h1 className="!text-3xl md:text-4xl font-bold mb-4 text-center text-[#B3905E]">
              Reservation Successfully Made!
            </h1>

            <p className="text-center mb-6 text-neutral-800">
              Thank you, <span className="font-semibold">{formData.firstName}</span>! Your table for <span className="font-semibold">{formData.guests} {formData.guests === "1" ? "guest" : "guests"}</span> has been reserved.
              <br />
              <strong className="text-[#B3905E]">Table Number: {reservedTableNumber}</strong>
            </p>

            <div className="bg-gold/10 rounded-lg p-6 mb-6 border border-gold/20 shadow-sm">
              <h3 className="font-semibold mb-3 text-lg text-neutral-900">Reservation Details:</h3>
              <div className="space-y-2 text-neutral-700">
                <p><span className="font-medium font-semibold">Date:</span> {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><span className="font-medium font-semibold">Time:</span> {formData.time}</p>
                <p><span className="font-medium font-semibold">Party Size:</span> {formData.guests} {formData.guests === "1" ? "guest" : "guests"}</p>
                <p><span className="font-medium font-semibold">Contact Email:</span> {formData.email}</p>
                <p><span className="font-medium font-semibold">Seating:</span> {formData.seating || "No preference"}</p>
                {formData.occasion && <p><span className="font-medium font-semibold">Occasion:</span> {formData.occasion}</p>}
                {formData.specialRequests && <p><span className="font-medium font-semibold">Special Requests:</span> {formData.specialRequests}</p>}
              </div>
            </div>

            <p className="mb-6 text-center text-neutral-800">
              A summary of your reservation has been sent to <span className="font-medium">{formData.email}</span> with all the details above. Please check your inbox for reference. We look forward to welcoming you!
            </p>

            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setShowConfirmation(false);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    date: "",
                    time: "",
                    guests: "2",
                    specialRequests: "",
                    occasion: "",
                    seating: ""
                  });
                }}
              >
                Make Another Reservation
              </Button>
            </div>
          </div>
        </div>
      )}

          </PageTransition>
        );
      }
      