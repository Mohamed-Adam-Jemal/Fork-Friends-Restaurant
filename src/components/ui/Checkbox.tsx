"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  policyLink?: string; // optional link for terms/policy
}

export default function Checkbox({ label, checked = false, onChange, policyLink }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    setIsChecked(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={toggle}
        className={`min-w-6 min-h-6 max-w-6 max-h-6 rounded-lg flex items-center justify-center transition-all duration-200 
          ${isChecked ? "bg-[#B3905E] text-white" : "bg-white border-2 border-gray-400"} 
          hover:scale-110 shadow-sm`}
      >
        {isChecked && <Check size={16} strokeWidth={3}/>}
      </div>
      <span className="text-sm text-gray-800">
        {label}
        {policyLink && (
          <>
            {" "}
            <a
              href={policyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B3905E] underline hover:text-[#8C6A42]"
            >
              Policy and terms
            </a>
          </>
        )}
      </span>
    </label>
  );
}
