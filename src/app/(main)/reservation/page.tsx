"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";
import Dropdown from "@/components/ui/Dropdown";
import { FiX } from "react-icons/fi";

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
  const [backendReason, setBackendReason] = useState<string | null>(null);

  // Separate dropdown open states
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [seatingDropdownOpen, setSeatingDropdownOpen] = useState(false);
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const [occasionDropdownOpen, setOccasionDropdownOpen] = useState(false);

  const [invalidFields, setInvalidFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    date: false,
    time: false,
    guests: false,
    seating: false,
  });

  // Refs for scroll
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const seatingRef = useRef<HTMLDivElement>(null);

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
    setBackendReason(null);

    // Validate required fields
    const newInvalidFields = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !formData.email,
      phone: !formData.phone,
      date: !formData.date,
      time: !formData.time,
      guests: !formData.guests,
      seating: !formData.seating,
    };
    setInvalidFields(newInvalidFields);

    // Scroll to first invalid field
    if (Object.values(newInvalidFields).some(Boolean)) {
      if (newInvalidFields.firstName) firstNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newInvalidFields.lastName) lastNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newInvalidFields.email) emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newInvalidFields.phone) phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newInvalidFields.date) dateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newInvalidFields.time) timeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newInvalidFields.guests) guestsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newInvalidFields.seating) seatingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guests: parseInt(formData.guests, 10),
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setBackendReason(data.reason || "No tables available for the selected time.");
        setNoTableModalOpen(true);
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong");
        setBackendReason(data.reason || null);
        setNoTableModalOpen(true);
        setIsSubmitting(false);
        return;
      }

      setReservedTableNumber(data.table_id.table_number);
      setShowConfirmation(true);

      // Optionally, send email
      await fetch("/api/send-email/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          seating: formData.seating,
          occasion: formData.occasion,
          specialRequests: formData.specialRequests,
          tableNumber: data.table_id.table_number,
        }),
      });

    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
      setNoTableModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = ["6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM"];

  const getAvailableTimes = () => {
    if (!formData.date) return timeOptions;
    const selectedDate = new Date(formData.date);
    const now = new Date();

    if (
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate()
    ) {
      return timeOptions.filter(timeStr => {
        const [hourStr, minuteStr] = timeStr.split(/:| /);
        const period = timeStr.includes("PM") ? "PM" : "AM";
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        const timeDate = new Date();
        timeDate.setHours(hour, minute, 0, 0);

        return timeDate > now;
      });
    }

    return timeOptions;
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#333333] opacity-70 z-10" />
          <img
            src="/images/bg-reservation.jpg"
            alt="Background"
            className="w-full h-full object-cover z-0"
          />
        </div>

        <section className="relative pt-16 pb-10 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 !text-white">
              Reserve Your Table
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto !text-white">
              Join us for an unforgettable dining experience. Book your table and let us create memorable moments for you.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gold/20">
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Personal Info */}
                    <div className="space-y-6">
                      <h3 className="!text-xl font-semibold border-b border-[#333333] pb-2">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-semibold mb-2">First Name *</label>
                          <input
                            ref={firstNameRef}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onFocus={() => setInvalidFields(prev => ({ ...prev, firstName: false }))}
                            placeholder="John"
                            className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                              invalidFields.firstName ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-base font-semibold mb-2">Last Name *</label>
                          <input
                            ref={lastNameRef}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onFocus={() => setInvalidFields(prev => ({ ...prev, lastName: false }))}
                            placeholder="Doe"
                            className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                              invalidFields.lastName ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold mb-2">Email Address *</label>
                        <input
                          ref={emailRef}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          onFocus={() => setInvalidFields(prev => ({ ...prev, email: false }))}
                          className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                            invalidFields.email ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold mb-2">Phone Number *</label>
                        <input
                          ref={phoneRef}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                          onFocus={() => setInvalidFields(prev => ({ ...prev, phone: false }))}
                          className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                            invalidFields.phone ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                          }`}
                        />
                      </div>

                      <div ref={seatingRef}>
                        <label className="block text-base font-semibold mb-2">Seating Preference *</label>
                        <Dropdown
                          label={formData.seating || "Select seating preference"}
                          isOpen={seatingDropdownOpen}
                          onToggle={() => setSeatingDropdownOpen(prev => !prev)}
                          onSelect={(value) => {
                            setFormData(prev => ({ ...prev, seating: value ?? "" }));
                            setSeatingDropdownOpen(false);
                            setInvalidFields(prev => ({ ...prev, seating: false }));
                          }}
                          selected={formData.seating}
                          options={["Indoor", "Outdoor"]}
                          buttonClassName={`w-full px-4 py-3 border rounded-lg transition-all duration-300 text-left ${
                            invalidFields.seating ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                          }`}
                          listClassName="w-full"
                        />
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="space-y-6">
                      <h3 className="!text-xl font-semibold border-b border-[#333333] pb-2">Reservation Details</h3>

                      <div>
                        <label className="block text-base font-semibold mb-2">Preferred Date *</label>
                        <input
                          ref={dateRef}
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          onFocus={() => setInvalidFields(prev => ({ ...prev, date: false }))}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                            invalidFields.date ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                          }`}
                        />
                      </div>

                      <div ref={timeRef}>
                        <label className="block text-base font-semibold mb-2">Preferred Time *</label>
                        <Dropdown
                          label={formData.time || "Select a time"}
                          isOpen={timeDropdownOpen}
                          onToggle={() => setTimeDropdownOpen(prev => !prev)}
                          onSelect={(value) => {
                            setFormData(prev => ({ ...prev, time: value ?? "" }));
                            setTimeDropdownOpen(false);
                            setInvalidFields(prev => ({ ...prev, time: false }));
                          }}
                          selected={formData.time}
                          options={getAvailableTimes()}
                          buttonClassName={`w-full px-4 py-3 border rounded-lg transition-all duration-300 text-left ${
                            invalidFields.time ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                          }`}
                          listClassName="w-full"
                        />
                      </div>

                      <div ref={guestsRef}>
                        <label className="block text-base font-semibold mb-2">Number of Guests *</label>
                        <Dropdown
                          label={`${formData.guests} ${formData.guests === "1" ? "Guest" : "Guests"}`}
                          isOpen={guestsDropdownOpen}
                          onToggle={() => setGuestsDropdownOpen(prev => !prev)}
                          onSelect={(value) => {
                            setFormData(prev => ({ ...prev, guests: value ?? "1" }));
                            setGuestsDropdownOpen(false);
                            setInvalidFields(prev => ({ ...prev, guests: false }));
                          }}
                          selected={formData.guests}
                          options={["1","2","3","4","5","6","7","8","9","10"]}
                          buttonClassName={`w-full px-4 py-3 border rounded-lg transition-all duration-300 text-left ${
                            invalidFields.guests ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                          }`}
                          listClassName="w-full !max-h-110"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold mb-2">Special Occasion (Optional)</label>
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
                          options={["Business","Anniversary","Celebration","Other"]}
                          buttonClassName="w-full px-4 py-3 border border-[#333333] rounded-lg transition-all duration-300 text-left"
                          listClassName="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-8">
                    <label className="block text-base font-semibold mb-2">Special Requests or Dietary Requirements (Optional)</label>
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

                  <div className="text-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
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
                      <li>• For reservations of more than 10 guests, please call us directly at (555) 123-4567</li>
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

      {/* No Table Modal */}
      {noTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-[90%] sm:w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Sorry, no tables available</h2>
            {backendReason && <p className="mb-4 text-gray-700">{backendReason}</p>}
            <button
              onClick={() => setNoTableModalOpen(false)}
              className="mt-4 px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && reservedTableNumber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-[90%] sm:w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Reservation Confirmed!</h2>
            <p className="mb-4">Your table number is <span className="font-semibold">{reservedTableNumber}</span>.</p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="mt-4 px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PageTransition>
  );
}

