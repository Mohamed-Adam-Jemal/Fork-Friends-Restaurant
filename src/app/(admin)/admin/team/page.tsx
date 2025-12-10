'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import FilteringBar from '@/components/ui/FilteringBar';
import Spinner from '@/components/ui/Spinner';
import { Edit3, PlusCircle } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import SomethingWentWrong from '@/components/SomethingWentWrong';
import Dropdown from '@/components/ui/Dropdown';
import { FiX } from 'react-icons/fi';
import Button from '@/components/ui/Button';

type TeamMember = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  quote?: string;
  image?: string;
};

const roles = ['All Roles', 'Admin', 'Chef', 'Waiter', 'Manager'];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState(roles[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);


  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(roles[1]);
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);


  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/team');
      if (!res.ok) throw new Error('Failed to fetch team members');
      const data: TeamMember[] = await res.json();
      setMembers(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching team members');
      {error && !loading && (
      <SomethingWentWrong message={error} onRetry={fetchMembers} />
    )}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Open Add Modal
  const openAddForm = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole(roles[1]);
    setImage('');
    setImageFile(null);
    setShowForm(true);
  };

  // Open Edit Modal
  const openEditForm = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone || '');
    setRole(member.role);
    setImage(member.image || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id: number) => {
    setDeletingId(id); // start loading
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete member');
      fetchMembers(); // refresh list
    } catch (err: any) {
      setError(err.message || 'Error deleting member');
    } finally {
      setDeletingId(null); // stop loading
      setShowDeleteConfirm(null); // close dialog
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSaving(true); // start saving

  let imageUrl = image;

  if (imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      const uploadRes = await fetch('/api/upload-image/team-members', {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Image upload failed');
      const data = await uploadRes.json();
      imageUrl = data.signedUrl;
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
      {error && <SomethingWentWrong message={error} onRetry={() => {}} />}
      setSaving(false); // stop saving on error
      return;
    }
  }

  const payload = { name, email, phone, role, image: imageUrl };

  try {
    let res;
    if (editingMember) {
      res = await fetch(`/api/team/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    if (!res.ok) throw new Error('Failed to save member');
    setShowForm(false);
    fetchMembers();
  } catch (err: any) {
    setError(err.message || 'Error saving member');
  } finally {
    setSaving(false); // stop saving
  }
};

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchLower = filterName.trim().toLowerCase();
      const nameMatch = member.name.toLowerCase().includes(searchLower);
      const emailMatch = member.email.toLowerCase().includes(searchLower);
      const matchesRole = filterRole === 'All Roles' || member.role === filterRole;
      return (nameMatch || emailMatch) && matchesRole;
    });
  }, [members, filterName, filterRole]);

  return (
    <main className="p-6 max-w-7xl mx-auto">
    
      <button
        onClick={openAddForm}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition cursor-pointe flex items-center gap-2 cursor-pointer"
      >
        <PlusCircle size={23} /> Add new team member
      </button>

      {/* Filter */}
      <FilteringBar>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="bg-white px-5 py-2 rounded-full border border-gray-300 shadow-inner w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#B3905E] transition text-black"
        />
        <Dropdown
          label="Select role"
          options={roles}
          selected={filterRole}
          onSelect={(value) => {
            if (value) setFilterRole(value); // make sure not to pass null
          }}
          buttonClassName="w-36 hover:bg-[#B3905E] hover:text-white transition"
          listClassName="text-black"
        />
      </FilteringBar>

      {loading && <Spinner name="team members" />}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {filteredMembers.map((member) => {
          const initials = member.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-between text-center hover:shadow-lg transition-shadow duration-300 min-w-[190px] "
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center text-3xl text-gray-400 select-none">
                  {initials}
                </div>
              )}

              <h2 className="!text-lg font-semibold text-[#B3905E]">{member.name}</h2>
              <p className="!text-gray-600 text-sm mb-1 break-all">{member.email}</p>
              <p className="!text-gray-600 text-sm mb-1">{member.phone}</p>
              <p className="!text-gray-500 text-xs uppercase tracking-wide">{member.role}</p>

              {/* Edit/Delete */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEditForm(member)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
                  disabled={deletingId === member.id}
                >
                  {deletingId === member.id ? 'Deleting…' : 'Delete'}
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/10 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#B3905E]">
                {editingMember ? 'Edit Team Member' : 'Add new team member'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <FiX size={24} className='hover:text-[#B3905E] transition cursor-pointer' />
              </button>
            </div>

            <label className="block mb-4 font-semibold">
              Name <span className="text-red-500">*</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60"
                required
              />
            </label>

            <label className="block mb-4 font-semibold">
              Email <span className="text-red-500">*</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60"
                required
              />
            </label>

            <label className="block mb-4 font-semibold">
              Phone <span className="text-red-500">*</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60"
              />
            </label>

            <label className="block mb-4 font-semibold">
                Role <span className="text-red-500">*</span>
                <Dropdown
                  label="Select a role"
                  options={roles.slice(1)} // same as before
                  selected={role}
                  onSelect={(value) => setRole(value || "")}
                  buttonClassName="w-full mt-2 border border-gray-300 text-left rounded-xl px-4 py-2 focus:outline-none focus:ring-4 focus:ring-[#B3905E]/60"
                  listClassName="w-full"
                />
              </label>


            <label className="block mb-6 font-semibold">
              Upload Image
              <ImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                existingImage={image}
                setImage={setImage}
              />
            </label>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <Button
                variant='secondary'
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#B3905E] hover:bg-[#a37847] text-white font-semibold transition cursor-pointer"
                disabled={saving}
              >
                {saving ? (editingMember ? 'Saving…' : 'Adding…') : editingMember ? 'Save Changes' : 'Add Member'}
              </Button>
            </div>
          </form>
        </div>
      )}
      {showDeleteConfirm && (
    <ConfirmDialog
      show={!!showDeleteConfirm}
      title="Confirm Deletion"
      message="Are you sure you want to delete this team member? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      onCancel={() => setShowDeleteConfirm(null)}
      onConfirm={() => confirmDelete(showDeleteConfirm!)}
      loading={deletingId === showDeleteConfirm}
    />
  )}

    </main>
  );
}

// Reuse ImageUpload from Menu page
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
    if (files && files[0]) {
      setImageFile(files[0]);
      setImage('');
    } else {
      setImageFile(null);
      setImage('');
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
          ${dragActive ? 'border-[#B3905E] bg-[#F5E6C0]' : 'border-gray-300 bg-white'}
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
                setImage('');
              }}
              className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">Click or drag & drop to upload an image</p>
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
