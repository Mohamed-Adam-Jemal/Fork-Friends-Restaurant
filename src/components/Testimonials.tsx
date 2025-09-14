import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { FiUpload, FiX } from "react-icons/fi";
import Spinner from "./ui/Spinner";
import Button from "./ui/Button";
import Dropdown from "./ui/Dropdown";
import { compressImage } from "@/utils/compressImage";
import { FaPlus } from "react-icons/fa";

// Types
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

interface TestimonialItemProps {
  item: TestimonialItemType;
}

interface ImageUploadProps {
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  existingImage: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

// Utility functions
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

// Rating Component
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
            <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />
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
              className="text-gray-300 fill-white stroke-gray-300"
            />
          );
        }
      })}
    </span>
    {showLabel && <span>{rating.toFixed(1)}</span>}
  </p>
);

// TestimonialItem Component
const TestimonialItem: React.FC<TestimonialItemProps> = ({ item }) => {
  const { rating, content, photo, name } = item;
  const initials = getInitials(name);
  const bgColor = stringToColor(initials);

  return (
    <div
      className="bg-white rounded-[30px] p-6 mx-3 w-[280px] md:w-[300px] flex-shrink-0 
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

// ImageUpload Component
const ImageUpload: React.FC<ImageUploadProps> = ({
  imageFile,
  setImageFile,
  existingImage,
  setImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (files && files[0]) {
      try {
        const compressedFile = await compressImage(files[0]);
        setImageFile(compressedFile);
        setImage("");
      } catch (error) {
        console.error("Compression error:", error);
        setImageFile(files[0]);
        setImage("");
      }
    } else {
      setImageFile(null);
      setImage("");
    }
  };

  return (
    <>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-2 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer p-6 transition-colors
          ${
            dragActive
              ? "border-[#B3905E] bg-[#F5E6C0]"
              : "border-gray-300 bg-white"
          }
          hover:border-[#B3905E]"
        `}
      >
        {imageFile ? (
          <div className="relative w-48 h-48">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Selected preview"
              className="object-cover w-full h-full rounded-xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImageFile(null);
              }}
              className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 text-xs"
            >
              ✕
            </button>
          </div>
        ) : existingImage ? (
          <div className="relative w-48 h-48">
            <img
              src={existingImage}
              alt="Existing image"
              className="object-cover w-full h-full rounded-xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImage("");
              }}
              className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <FiUpload className="h-10 w-10 mb-2" />
            <p className="text-gray-600 text-sm">
              Click or drag & drop to upload your photo
            </p>
          </>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </>
  );
};

// Main Testimonial Component
const Testimonial: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  // Drag / manual scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>("");

  // Ref for the scroll track element
  const trackRef = useRef<HTMLDivElement>(null);

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

  // New useEffect hook to dynamically set animation duration
  useEffect(() => {
  if (!trackRef.current || testimonials.length === 0) return;
  let reqId: number;
  const track = trackRef.current;
  const speed = 0.5; // pixels per frame

  const animate = () => {
    if (!isDragging) {
      track.scrollLeft += speed;
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = 0; // loop seamlessly
      }
    }
    reqId = requestAnimationFrame(animate);
  };
  animate();
  return () => cancelAnimationFrame(reqId);
  }, [isDragging, testimonials]);


  const openModal = () => {
    setForm({ photo: "", name: "", rating: 5, content: "" });
    setImage("");
    setImageFile(null);
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      let imageUrl = image;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch(
          "/api/upload-image/testimonials-users-images",
          { method: "POST", body: formData }
        );
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        if (!uploadData?.signedUrl)
          throw new Error("Failed to get image URL from server");
        imageUrl = uploadData.signedUrl;
      }

      const payload = { ...form, photo: imageUrl || "" };
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit review");
      }
      const newTestimonial = await res.json();
      setTestimonials((prev) => [newTestimonial, ...prev]);
      setShowModal(false);
    } catch (error: any) {
      setFormError(error.message || "Failed to submit review");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner name="Testimonials" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Remove animation properties from CSS */
        .scroll-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
          padding: 20px 0;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .scroll-track {
          display: flex;
          width: max-content;
          animation: scroll-left linear infinite;
        }

        @keyframes scroll-left {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .scroll-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="relative">
        <div className="container relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-5 md:space-y-0">
            <div className="w-full md:w-2/3 lg:max-w-lg">
              <h2 className="font-bold text-2xl md:text-4xl leading-none mb-6">
                What Our Clients Say
              </h2>
              <p className="text-base leading-relaxed">
                Our clients' success stories speak volumes — hear directly from
                those who've experienced real growth and transformation working
                with us.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={openModal}
              className="flex items-center gap-2"
            >
              <FaPlus /> Add Review
            </Button>
          </div>

          {/* Testimonials Carousel with auto + manual scroll */}
          <div
            className="scroll-wrapper overflow-hidden cursor-grab mt-6 flex"
            ref={trackRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartX(e.pageX - (trackRef.current?.offsetLeft || 0));
              setScrollLeft(trackRef.current?.scrollLeft || 0);
            }}
            onMouseMove={(e) => {
              if (!isDragging || !trackRef.current) return;
              e.preventDefault();
              const x = e.pageX - trackRef.current.offsetLeft;
              const walk = (x - startX) * 1; // drag speed multiplier
              trackRef.current.scrollLeft = scrollLeft - walk;
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}

           onTouchStart={(e) => {
              setIsDragging(true);
              setStartX(e.touches[0].pageX - (trackRef.current?.offsetLeft || 0));
              setStartY(e.touches[0].pageY); // ✅ track vertical start
              setScrollLeft(trackRef.current?.scrollLeft || 0);
            }}

            onTouchMove={(e) => {
              if (!isDragging || !trackRef.current) return;

              const touch = e.touches[0];
              const x = touch.pageX - trackRef.current.offsetLeft;
              const walk = (x - startX) * 1;

              const deltaX = Math.abs(touch.pageX - startX);
              const deltaY = Math.abs(touch.pageY - startY);

              // ✅ Prevent vertical scroll if horizontal drag is stronger
              if (deltaX > deltaY) {
                e.preventDefault();
                trackRef.current.scrollLeft = scrollLeft - walk;
              }
            }}

            onTouchEnd={() => setIsDragging(false)}
            onTouchCancel={() => setIsDragging(false)}
          style={{ display: "flex" }}
          >
            {[...testimonials, ...testimonials].map((item, idx) => (
              <TestimonialItem key={item.id + "-" + idx} item={item} />
            ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-md 
                        p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl 
                        w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl 
                        max-h-[90vh] overflow-y-auto border border-white/40 
                        text-gray-900 transition-transform duration-300 ease-in-out hover:scale-[1.01]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#B3905E] tracking-wide">
                  Add your review
                </h3>
                <button type="button" onClick={() => setShowModal(false)}>
                  <FiX
                    size={22}
                    className="sm:size-6 hover:text-[#B3905E] transition cursor-pointer"
                  />
                </button>
              </div>

              {formError && <p className="text-red-600 mb-3">{formError}</p>}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name */}
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
                    className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block mb-1 font-medium">Upload Photo</label>
                  <ImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    existingImage={image}
                    setImage={setImage}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="rating">
                    Rating <span className="text-red-600">*</span>
                  </label>
                  <Dropdown
                    label="Select Rating"
                    options={["5", "4", "3", "2", "1"]}
                    selected={form.rating ? form.rating.toString() : null}
                    onSelect={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        rating: value ? Number(value) : 0,
                      }))
                    }
                    buttonClassName="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition text-left"
                  />
                </div>

                {/* Content */}
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
                    className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
                    placeholder="Write your review here..."
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0 mt-6">
                  <Button
                    type="submit"
                    disabled={submitLoading}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    {submitLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        Saving
                        <span className="w-4 h-4 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin inline-block"></span>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={closeModal}
                    variant="third"
                    disabled={submitLoading}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
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