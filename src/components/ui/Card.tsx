"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-emerald-900/15 bg-[#edf5ee] shadow-[0_8px_24px_-18px_rgba(31,42,36,0.45)] transition-all duration-300 ease-out ${
        onClick
          ? "hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_32px_-20px_rgba(31,42,36,0.5)]"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
