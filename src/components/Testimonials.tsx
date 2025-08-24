import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { FiUpload } from "react-icons/fi";
import Spinner from "./ui/Spinner";
import Button from "./ui/Button";
import Dropdown from "./ui/Dropdown";
import { compressImage } from "@/utils/compressImage";

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
            <FontAwesomeIcon key={i} icon={faStar} className="text-white" />
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

// ImageUpload Component
const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imageFile, 
  setImageFile, 
  existingImage, 
  setImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    console.log("handleFiles triggered", files);
    if (files && files[0]) {
      try {
        const compressedFile = await compressImage(files[0]);
        console.log("Original size (KB):", files[0].size / 1024);
        console.log("Compressed size (KB):", compressedFile.size / 1024);

        setImageFile(compressedFile);
        setImage(""); // clear existing image URL if any
      } catch (error) {
        console.error("Compression error:", error);
        // fallback to original file if compression fails
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
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-2 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer p-6 transition-colors
          ${dragActive ? "border-[#B3905E] bg-[#F5E6C0]" : "border-gray-300 bg-white"}
          hover:border-[#B3905E]
        `}
      >
        {imageFile ? (
          <div className="relative w-48 h-48">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Selected preview"
              className="object-cover w-full h-full rounded-xl"
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(imageFile))}
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
            <p className="text-gray-600 text-sm">Click or drag & drop to upload your photo</p>
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
  // Testimonials state
  const [testimonials, setTestimonials] = useState<TestimonialItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    photo: "",
    name: "",
    rating: 5,
    content: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>(""); // URL or base64 string

  // Fetch testimonials on component mount
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

  // Modal handlers
  const openModal = () => {
    setForm({ photo: "", name: "", rating: 5, content: "" });
    setImage("");
    setImageFile(null);
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Form handlers
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
    
    // Validation
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
      let imageUrl = image; // existing image URL

      // Upload image if new file is selected
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("file", imageFile);

          const uploadRes = await fetch("/api/upload-image/testimonials-users-images/route", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error("Image upload failed");
          }

          const uploadData = await uploadRes.json();
          if (!uploadData?.signedUrl) {
            throw new Error("Failed to get image URL from server");
          }

          imageUrl = uploadData.signedUrl;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (err) {
          console.error("Upload error:", err);
          throw new Error("An error occurred while uploading the image");
        }
      }

      // Submit testimonial with uploaded image URL
      const payload = {
        ...form,
        photo: imageUrl || "", // override photo field with uploaded image URL or empty string
      };

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

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner name="Testimonials" />
      </div>
    );
  }

  // Error state
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
            <Button variant="secondary" onClick={openModal}>
              + Add Review
            </Button>
          </div>

          {/* Testimonials Carousel */}
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
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white">
                Add Your Review
              </h3>
              
              {formError && (
                <p className="text-red-600 mb-3">{formError}</p>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
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
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block mb-1 font-medium">
                    Upload Photo
                  </label>
                  <ImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    existingImage={image}
                    setImage={setImage}
                  />
                </div>

                {/* Rating Dropdown */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="rating">
                    Rating <span className="text-red-600">*</span>
                  </label>
                  <Dropdown
                    label="Select Rating"
                    options={["5", "4", "3", "2", "1"]}
                    selected={form.rating ? form.rating.toString() : null}
                    onSelect={(value) => {
                      setForm((prev) => ({
                        ...prev,
                        rating: value ? Number(value) : 0,
                      }));
                    }}
                    buttonClassName="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition text-left"
                  />
                </div>

                {/* Review Content */}
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
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
                    placeholder="Write your review here..."
                  />
                </div>

                {/* Form Actions */}
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