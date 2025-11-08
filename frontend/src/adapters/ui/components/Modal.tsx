import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/40 dark:bg-black/70 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      {/* ===== Modal Container ===== */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-[var(--color-border)] 
                   bg-[var(--color-surface)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] 
                   transition-all duration-500 animate-scaleIn overflow-hidden"
      >
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95">
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-primary)] tracking-tight">
            {title}
          </h3>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-[var(--color-subtext)] hover:text-[var(--color-primary)] 
                       hover:bg-[var(--color-surface)]/60 transition-all duration-200"
          >
            <span className="text-xl font-bold leading-none">&times;</span>
          </button>
        </div>

        {/* ===== Body ===== */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh] text-[var(--color-text)]">
          {children}
        </div>

        {/* ===== Footer Gradient Shadow ===== */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--color-bg)]/95 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};