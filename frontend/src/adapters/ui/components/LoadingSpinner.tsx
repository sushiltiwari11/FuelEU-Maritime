import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
    {/* ===== Spinner Container ===== */}
    <div className="relative">
      {/* Base Circle (subtle border) */}
      <div className="h-14 w-14 rounded-full border-4 border-[var(--color-border)] opacity-60" />

      {/* Rotating Arc (primary color) */}
      <div className="absolute top-0 left-0 h-14 w-14 rounded-full border-4 border-t-[var(--color-primary)] border-l-transparent animate-spin-smooth" />

      {/* Soft Glow Layer */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_20px_var(--color-primary)] opacity-20 blur-sm" />
    </div>

    {/* ===== Text ===== */}
    <p className="mt-5 text-sm sm:text-base font-medium text-[var(--color-subtext)] animate-pulse">
      Loading, please wait...
    </p>
  </div>
);