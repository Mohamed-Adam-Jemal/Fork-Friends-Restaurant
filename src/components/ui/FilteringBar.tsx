import React, { ReactNode } from "react";

type FilteringBarProps = {
  children: ReactNode;
  className?: string;
};

export default function FilteringBar({ children, className = "" }: FilteringBarProps) {
  return (
    <div
      className={`bg-[#DECEB3] flex flex-wrap gap-4 py-4 mb-10 rounded-[30px] shadow-inner px-6 justify-center max-w-full mx-auto z-20 ${className}`}
    >
      {children}
    </div>
  );
}
