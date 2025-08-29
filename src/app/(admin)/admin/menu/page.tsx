"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { compressImage } from "@/utils/compressImage";
import FilteringBar from "@/components/ui/FilteringBar";
import Spinner from "@/components/ui/Spinner";
import { Edit3, PlusCircle } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import SomethingWentWrong from "@/components/SomethingWentWrong";
import Dropdown from "@/components/ui/Dropdown";

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  chef_choice: boolean;
  featured: boolean;
  cuisine?: string;
};

const categories = ["All Categories", "Appetizers", "Main Dishes", "Sides", "Desserts"];

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteMenuItemId, setDeleteMenuItemId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);



  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(categories[1]); // Default to first real category
  const [chefChoice, setChefChoice] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [cuisine, setCuisine] = useState(""); // new cuisine field
  const [imageFile, setImageFile] = useState<File | null>(null); // new state for uploaded file

  // Filter states
  const [filterCategory, setFilterCategory] = useState<string | null>(
    categories.length > 0 ? categories[0] : null
  );

  const [filterChefChoice, setFilterChefChoice] = useState(false);
  const [searchName, setSearchName] = useState("");

  // Category dropdown open state & ref
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchMenu() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      setMenuItems(data);
    } catch (err: any) {
      setError(err.message || "Error fetching menu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  function openAddForm() {
    setEditingItem(null);
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory(categories[1]);
    setChefChoice(false);
    setFeatured(false);
    setCuisine(""); // reset cuisine when opening add form
    setImageFile(null); // reset image file
    setShowForm(true);
  }

  function openEditForm(item: MenuItem) {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price.toString());
    setImage(item.image || "");
    setCategory(item.category);
    setChefChoice(item.chef_choice);
    setFeatured(item.featured);
    setCuisine(item.cuisine || ""); // set cuisine for editing
    setImageFile(null); // reset image file on edit open
    setShowForm(true);
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setSaving(true);
  // validation skipped here for brevity...

  let imageUrl = image; // existing image URL

  if (imageFile) {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload-image/menu-items", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        setError("Image upload failed");
        return;
      }

      const uploadData = await uploadRes.json();
      if (!uploadData?.signedUrl) {
        setError("Failed to get image URL from server");
        return;
      }

      imageUrl = uploadData.signedUrl;
      console.log("Image uploaded successfully:", imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError("An error occurred while uploading the image");
    }
  }

  const payload = {
    name: name.trim(),
    description: description?.trim() || "",
    price: Number(price),
    image: imageUrl?.trim() || "",
    category: category.trim(),
    chef_choice: chefChoice,
    cuisine: cuisine?.trim() || "",
  };

  try {
    let res;
    if (editingItem) {
      res = await fetch(`/api/menu/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save menu item");
    }

    setShowForm(false);
    fetchMenu();
  } catch (err: any) {
    setError(err.message || "Error saving menu item");
  }
  setSaving(false);
}


  
async function handleDelete(id: number) {
  setDeletingId(id); // start loading for this item
  try {
    const res = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    setMenuItems(prev => prev.filter(r => r.id !== id));
  } catch (err: any) {
    console.error("Delete failed:", err);
    setError(err?.message || "Something went wrong while deleting");
  } finally {
    setDeleteMenuItemId(null); // close modal
    setDeletingId(null); // stop loading
  }
}



  // Filtered items based on filters
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      filterCategory === "All Categories" || item.category === filterCategory;
    const matchesChefChoice = !filterChefChoice || item.chef_choice === filterChefChoice;
    const matchesName =
      item.name.toLowerCase().includes(searchName.trim().toLowerCase());

    return matchesCategory && matchesChefChoice && matchesName;
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <button
        onClick={openAddForm}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition cursor-pointer flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle size={23} /> Add New Menu Item
      </button>

      {/* Filter bar */}
      <FilteringBar>
        {/* Category dropdown */}
        <Dropdown
          label="Category"
          options={categories}
          selected={filterCategory}
          onSelect={(value) => setFilterCategory(value)}
          buttonClassName="w-45 hover:bg-[#B3905E] hover:text-white transition"
          listClassName="z-30"
        />
        {/* Chef's Choice toggle */}
        <button
          onClick={() => setFilterChefChoice(!filterChefChoice)}
          className={`px-5 py-2 rounded-full shadow transition flex items-center gap-1 cursor-pointer ${
            filterChefChoice
              ? "bg-[#B3905E] text-white"
              : "bg-white hover:bg-[#B3905E] hover:text-white"
          }`}
        >
          Chef's Choice Only
        </button>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
        />
      </FilteringBar>

      {loading && <Spinner name="menu items" />}
      {error && <SomethingWentWrong message={error} onRetry={fetchMenu} />}

      <div className="mb-10 max-h-[60vh] overflow-y-auto pr-2.5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 && !loading && (
            <p className="col-span-full text-center text-gray-500">
              No menu items match your filters.
            </p>
          )}

          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col hover:-translate-y-1 transform"
            >
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group">
                {item.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image} // or member.image
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>

                ) : (
                  <div className="bg-gray-200 w-full h-full rounded-xl flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <h3 className="font-semibold">{item.name}</h3>
              <p className="!text-gray-700 mt-1 flex-grow">{item.description}</p>
              {item.cuisine && (
                <p className="text-sm italic text-[#7b3f00] mt-1">Cuisine: {item.cuisine}</p>
              )}

              <div className="flex gap-2 mt-2 flex-wrap">
                {item.chef_choice && (
                  <span className="inline-block bg-[#B3905E] text-white px-3 py-1 rounded-full text-xs font-semibold drop-shadow-lg">
                    Chef's Choice
                  </span>
                )}
                {item.featured && (
                  <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold drop-shadow-lg">
                    Featured Menu
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
                <span className="text-lg font-semibold text-charcoal">
                  ${item.price.toFixed(2)}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteMenuItemId(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
                    disabled={deletingId === item.id} // disable while deleting
                  >
                    {deletingId === item.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/10 bg-opacity-50 backdrop-blur-lg">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto
                 border border-white/40
                 text-gray-900
                 transition-transform duration-300 ease-in-out
                 hover:scale-[1.02]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#B3905E] tracking-wide">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <FiX size={24} className='hover:text-[#B3905E] transition cursor-pointer' />
              </button>
            </div>

            <label className="block mb-6 font-semibold text-lg">
              Name <span className="text-red-600">*</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
                required
              />
            </label>

            <label className="block mb-6 font-semibold text-lg">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 resize-y min-h-[80px] focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
              />
            </label>

            <label className="block mb-6 font-semibold text-lg">
              Cuisine
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
              />
            </label>

            <label className="block mb-6 font-semibold text-lg">
              Price (USD) <span className="text-red-600">*</span>
              <input
                type="number"
                value={price}
                min="0.01"
                step="0.01"
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
                required
              />
            </label>

            <label className="block mb-6 font-semibold text-lg">
              Category <span className="text-red-600">*</span>
              <Dropdown
                label="Select category"
                options={categories.slice(1)}
                selected={category}
                onSelect={(value: string | null) => setCategory(value || "")}  
                buttonClassName="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60 transition"
                listClassName="w-full"
              />

            </label>

            <label className="flex items-center mb-6 cursor-pointer select-none">
              <div className="flex gap-8 mb-6">
                {/* Chef's Choice toggle */}
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={chefChoice}
                    onChange={(e) => setChefChoice(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                      chefChoice ? "bg-[#B3905E]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        chefChoice ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                  <span className="ml-3 font-semibold text-gray-900">Chef's Choice</span>
                </label>

                {/* Featured Menu toggle */}
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                      featured ? "bg-[#B3905E]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        featured ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                  <span className="ml-3 font-semibold text-gray-900">Featured Menu</span>
                </label>
              </div>

            </label>

            {/* Enhanced Image Upload Field */}
            <label className="block mb-6 font-semibold text-lg">
              Upload Image
              <ImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                existingImage={image}
                setImage={setImage}
              />
            </label>

            {error && (
              <p className="text-red-600 text-center mb-4">{error}</p>
            )}

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#B3905E] hover:bg-[#a37847] text-white font-semibold transition cursor-pointer flex items-center justify-center gap-2"
                disabled={saving} // disable while saving
              >
                {saving ? (
                  <>
                    Saving...
                  </>
                ) : (
                  editingItem ? "Save Changes" : "Add Item"
                )}
              </button>

            </div>
          </form>
        </div>
      )}
      <ConfirmDialog
        show={!!deleteMenuItemId}
        title="Confirm Deletion"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={!!deletingId} // show loading while deleting
        onCancel={() => setDeleteMenuItemId(null)}
        onConfirm={() => deleteMenuItemId && handleDelete(deleteMenuItemId)}
      />


    </main>
  );
}

type ImageUploadProps = {
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  existingImage: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
};

function ImageUpload({ imageFile, setImageFile, existingImage, setImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

 async function handleFiles(files: FileList | null) {
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
}


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
            <p className="text-gray-600 text-sm">Click or drag & drop to upload an image</p>
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
}
