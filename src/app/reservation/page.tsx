"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";

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
    occasion: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowConfirmation(true);
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
              <h1 className="text-4xl font-bold text-burgundy mb-4">Reservation Confirmed!</h1>
              <p className="text-xl text-charcoal mb-6">
                Thank you, {formData.firstName}! Your table for {formData.guests} guests has been reserved.
              </p>
              <div className="bg-gold/10 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-burgundy mb-3">Reservation Details:</h3>
                <div className="space-y-2 text-charcoal">
                  <p><span className="font-medium">Date:</span> {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><span className="font-medium">Time:</span> {formData.time}</p>
                  <p><span className="font-medium">Party Size:</span> {formData.guests} guests</p>
                  <p><span className="font-medium">Contact:</span> {formData.email}</p>
                </div>
              </div>
              <p className="text-charcoal/80 mb-8">
                A confirmation email has been sent to {formData.email}. We look forward to welcoming you to Fork & Friends!
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setShowConfirmation(false);
                  setFormData({
                    firstName: "", lastName: "", email: "", phone: "",
                    date: "", time: "", guests: "2", specialRequests: "", occasion: ""
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
    <div className="min-h-screen bg-[#B3905E]/15">
      {/* Hero Section */}
      <section className="relative py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-burgundy mb-4">
            Reserve Your Table
          </h1>
          <p className="text-xl text-charcoal max-w-2xl mx-auto">
            Join us for an unforgettable dining experience. Book your table and let us create memorable moments for you.
          </p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gold/20">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-burgundy to-burgundy/90 ">
                <h2 className="text-2xl font-bold text-white">Reservation Details</h2>
                <p className="text-white/90 mt-1">Please fill in your information below</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-burgundy border-b border-gold/30 pb-2">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Reservation Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-burgundy border-b border-gold/30 pb-2">
                      Reservation Details
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                      >
                        <option value="">Select a time</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="5:30 PM">5:30 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="7:30 PM">7:30 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="8:30 PM">8:30 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Number of Guests *
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Special Occasion (Optional)
                      </label>
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80"
                      >
                        <option value="">Select an occasion</option>
                        <option value="birthday">Birthday</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="date">Date Night</option>
                        <option value="business">Business Dinner</option>
                        <option value="celebration">Celebration</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Special Requests or Dietary Requirements (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-all duration-300 bg-white/80 resize-none"
                    placeholder="Please let us know about any allergies, dietary restrictions, or special requests..."
                  />
                </div>

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
                  <h4 className="font-semibold text-burgundy mb-2">Please Note:</h4>
                  <ul className="text-sm text-charcoal space-y-1">
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