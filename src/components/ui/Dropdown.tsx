import React, { useState } from "react";

export interface DropdownProps {
  label: string;
  onToggle?: () => void;
  onSelect: (value: string | null) => void;
  options: string[];
  allLabel?: string;
  selected?: string | null;
  buttonClassName?: string;
  listClassName?: string;
  isOpen?: boolean;
}

export default function Dropdown({
  label = "Select an option",
  options,
  allLabel = "Clear selection",
  onSelect,
  selected,
  isOpen: controlledIsOpen,
  onToggle,
  buttonClassName = "",
  listClassName = "",
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledIsOpen ?? internalOpen;

  const toggleDropdown = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const handleSelect = (value: string | null) => {
    onSelect(value);
    if (!controlledIsOpen) setInternalOpen(false);
  };

  return (
    <div className="relative w-auto">
      <button
        type="button"
        onClick={toggleDropdown}
        className={`px-5 py-2 rounded-full bg-white font-semibold shadow-md flex items-center justify-between gap-2 cursor-pointer ${buttonClassName}`}
      >
        {selected || label}
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <ul
        className={`z-50 absolute w-full mt-2 bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
          isOpen
            ? "max-h-96 opacity-100 scale-y-100"
            : "max-h-0 opacity-0 scale-y-95 pointer-events-none"
        } ${listClassName}`}
      >
        <li
          onClick={() => handleSelect(null)}
          className="px-5 py-2 cursor-pointer hover:bg-[#B3905E]/15 font-semibold"
        >
          {allLabel}
        </li>
        {options.map((option) => (
          <li
            key={option}
            onClick={() => handleSelect(option)}
            className={`px-5 py-2 cursor-pointer hover:bg-[#B3905E]/50 text-burgundy hover:text-white ${
              selected === option ? "bg-[#B3905E] text-white font-semibold" : ""
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
