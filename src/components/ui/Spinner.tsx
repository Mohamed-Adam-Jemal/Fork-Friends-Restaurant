import React from "react";

interface SpinnerProps {
  size?: number; 
  className?: string;
  name?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, className = "", name="" }) => {
  return (
    <div className="flex flex-col justify-center items-center py-10 gap-4">
        <div
            className={`animate-spin rounded-full border-4 border-t-transparent border-black ${className}`}
            style={{ width: size, height: size }}
        />
        <p className="font-bold text-black">Loading {name}</p>
    </div>

  );
};

export default Spinner;
