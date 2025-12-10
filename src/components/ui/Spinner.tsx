import React from "react";

interface SpinnerProps {
  size?: number;
  className?: string;
  name?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 51, className = "", name = "" }) => {
  return (
    <div className="flex flex-col justify-center items-center py-10 gap-4">
      {/* Elegant ring spinner */}
      <div
        className={`animate-spin rounded-full border-[4px] border-[#B3905E] border-t-transparent border-b-transparent ${className}`}
        style={{ width: size, height: size }}
      />

      {/* Subtle text */}
      <p className="text-lg font-medium font-semibold text-black-700 tracking-wide text-[#B3905E]">
        {name}
      </p>
    </div>
  );
};

export default Spinner;
