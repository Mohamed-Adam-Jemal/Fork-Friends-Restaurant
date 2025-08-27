// components/ui/Button.tsx
"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "third";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-xl transition-all duration-300 ease-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

  const variants = {
    primary: `
      bg-white
      text-burgundy border
      hover:scale-105 hover:shadow-lg hover:shadow-gold/20
      focus:ring-burgundy/30
    `,
    secondary: `
      px-6 py-2 rounded-full bg-[#C8A983] text-white shadow-md hover:bg-[#B3905E] transition font-semibold
    `,
    third: `px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition cursor-pointer`
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-5 text-xl",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3 opacity-70"></div>
          <span className="opacity-70">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
