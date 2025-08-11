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
    setReservedTableNumber(null); // reset before new submission

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guests: parseInt(formData.guests, 10),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit reservation");
      }

      const data = await res.json();
      setReservedTableNumber(data.tableNumber);  // <-- save the table number here
      setShowConfirmation(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#B3905E]/15">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-gold/20">
              <div className="w-20 h-20 bg-gradient-to-r from-burgundy to-burgundy/90 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">Reservation Confirmed!</h1>
              <p className="text-xl  mb-6">
                Thank you, {formData.firstName}! Your table for {formData.guests} guests has been reserved. <br />
                <strong>Your Table Number: {reservedTableNumber}</strong>
              </p>

              <div className="bg-gold/10 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold mb-3">Reservation Details:</h3>
                <div className="space-y-2 ">
                  <p><span className="font-medium">Date:</span> {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><span className="font-medium">Time:</span> {formData.time}</p>
                  <p><span className="font-medium">Party Size:</span> {formData.guests} guests</p>
                  <p><span className="font-medium">Contact:</span> {formData.email}</p>
                  <p><span className="font-medium">Seating :</span> {formData.seating}</p>
                </div>
              </div>
              <p className="mb-8">
                A confirmation email has been sent to {formData.email}. We look forward to welcoming you to Fork & Friends!
              </p>
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
      </div>
    );
  }

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
            <h1 className="text-5xl md:text-6xl font-bold mb-4 !text-white">
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
                          allLabel="Clear selection"
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
                          allLabel="Clear selection"
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
                          allLabel="Clear selection"
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
                          allLabel="Clear selection"
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
    </PageTransition>
  );
}
