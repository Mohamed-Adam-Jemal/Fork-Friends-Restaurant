import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

interface TestimonialItemType {
  id: number;
  photo: string;
  name: string;
  rating: number;
  content: string;
}

interface RatingProps {
  rating: number;
  showLabel?: boolean;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  rating,
  showLabel = false,
  className,
}) => (
  <p className={classNames("mb-6", className)}>
    <span>
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        if (index <= Math.floor(rating)) {
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className="text-yellow-500"
            />
          );
        } else if (rating > i && rating < index) {
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStarHalfAlt}
              className="text-yellow-500"
            />
          );
        } else {
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className="text-white"
            />
          );
        }
      })}
    </span>
    {showLabel && <span>{rating.toFixed(1)}</span>}
  </p>
);

interface TestimonialItemProps {
  item: TestimonialItemType;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 65%)`;
};

const TestimonialItem: React.FC<TestimonialItemProps> = ({ item }) => {
  const { rating, content, photo, name } = item;
  const initials = getInitials(name);
  const bgColor = stringToColor(initials);

  return (
    <div
      className="bg-white dark:bg-slate-800 shadow-lg rounded-[50px] p-6 mx-3 w-[300px] flex-shrink-0 
        transform transition-transform duration-300 hover:scale-105 cursor-pointer"
      style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <Rating rating={rating} showLabel={false} />
          <p className="opacity-70 mb-6 leading-relaxed">{content}</p>
        </div>
        <div className="flex items-center mt-auto">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="rounded-full"
              width={48}
              height={48}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-full text-white"
              style={{
                width: 48,
                height: 48,
                backgroundColor: bgColor,
                fontSize: "1.25rem",
                userSelect: "none",
              }}
              aria-label={`Initials of ${name}`}
            >
              {initials}
            </div>
          )}
          <h5 className="ml-3 text-xl font-semibold">{name}</h5>
        </div>
      </div>
    </div>
  );
};

const Testimonial: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    photo: "",
    name: "",
    rating: 5,
    content: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const openModal = () => {
    setForm({ photo: "", name: "", rating: 5, content: "" });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!form.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!form.content.trim()) {
      setFormError("Review content is required");
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      setFormError("Rating must be between 1 and 5");
      return;
    }
    setFormError(null);
    setSubmitLoading(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit review");
      }
      const newTestimonial = await res.json();

      // Add new testimonial to the list and close modal
      setTestimonials((prev) => [newTestimonial, ...prev]);
      setShowModal(false);
    } catch (error: any) {
      setFormError(error.message || "Failed to submit review");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <p>Loading testimonials...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .scroll-container {
          display: flex;
          width: calc(2 * 100%);
          animation: scroll-right 30s linear infinite;
        }
        .scroll-container:hover {
          animation-play-state: paused;
        }
        .scroll-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
          padding: 20px 0;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        /* Modal backdrop */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
      `}</style>
      <section className="ezy__testimonial light dark:bg-[#0b1727] text-zinc-900 dark:text-white relative">
        <div className="container relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-5 md:space-y-0">
            <div className="w-full md:w-2/3 lg:max-w-lg">
              <h2 className="font-bold text-3xl md:text-[45px] leading-none mb-6">
                What Our Clients Say
              </h2>
              <p className="text-lg leading-relaxed">
                Our clients’ success stories speak volumes — hear directly from
                those who’ve experienced real growth and transformation working
                with us.
              </p>
            </div>
            <button
              onClick={openModal}
              className="bg-[#B3905E] hover:bg-[#9f7a38] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
            >
              + Add Review
            </button>
          </div>

          <div className="scroll-wrapper">
            <div className="scroll-container">
              {[...testimonials, ...testimonials].map((item, idx) => (
                <TestimonialItem key={item.id + "-" + idx} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 max-w-lg w-full z-50"
              onClick={(e) => e.stopPropagation()} // prevent modal close on clicking inside
            >
              <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white">
                Add Your Review
              </h3>
              {formError && (
                <p className="text-red-600 mb-3">{formError}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium" htmlFor="name">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="photo">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    id="photo"
                    name="photo"
                    value={form.photo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="rating">
                    Rating <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={form.rating}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {[5,4,3,2,1].map((r) => (
                      <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="content">
                    Review <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full rounded border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    placeholder="Write your review here..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 cursor-pointer"
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#B3905E] hover:bg-[#9f7a38] text-white font-semibold px-4 py-2 rounded cursor-pointer transition"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Testimonial;
