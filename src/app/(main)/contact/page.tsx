"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/PageTransition";
import { FiX } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [invalidFields, setInvalidFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    subject: false,
    message: false,
  });

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

    const newInvalidFields = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !formData.email,
      phone: !formData.phone,
      subject: !formData.subject,
      message: !formData.message,
    };

    setInvalidFields(newInvalidFields);

    if (Object.values(newInvalidFields).some(v => v)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit message");
      }

      if (res.ok) {
        setSubmittedName(formData.firstName); // store the name
        setShowConfirmation(true);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
        }

    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative flex">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/bg-contact2.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" /> {/* Dark overlay */}
        </div>

        {/* Form Container */}
        <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-6 pt-15 sm:pt-18 sm:p-10">
          <div className="w-full max-w-2xl bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-black p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-[#B3905E]">
              Contact Us
            </h1>
            <p className="text-center mb-6 text-neutral-800">
              Have a question or suggestion? Fill out the form below and we’ll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-semibold mb-2">First Name *</label>
                  <input
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
                <label className="block text-base font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setInvalidFields(prev => ({ ...prev, email: false }))}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                    invalidFields.email ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-semibold mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setInvalidFields(prev => ({ ...prev, phone: false }))}
                  placeholder="(555) 123-4567"
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                    invalidFields.phone ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-semibold mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setInvalidFields(prev => ({ ...prev, subject: false }))}
                  placeholder="Your subject here"
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                    invalidFields.subject ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-semibold mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setInvalidFields(prev => ({ ...prev, message: false }))}
                  rows={6}
                  placeholder="Write your message..."
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border resize-none ${
                    invalidFields.message ? "border-red-500 focus:ring-red-500" : "border-[#333333] focus:ring-[#B3905E]"
                  }`}
                />
              </div>

              {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

              <div className="text-center">
                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} loading={isSubmitting}>
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full z-50">
              <button
                className="absolute top-4 right-4 text-gray-500 text-2xl font-bold cursor-pointer"
                onClick={() => setShowConfirmation(false)}
              >
                <FiX size={24} className="hover:text-[#B3905E]" />
              </button>

              <h1 className="!text-2xl md:text-4xl font-bold mb-4 text-center text-[#B3905E]">
                Message Sent!
              </h1>

              <p className="text-center mb-6 text-neutral-800">
                Thank you, <span className="font-semibold">{submittedName}</span>. We received your message and will get back to you soon.
            </p>

              <div className="text-center">
                <Button variant="primary" size="lg" onClick={() => setShowConfirmation(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
