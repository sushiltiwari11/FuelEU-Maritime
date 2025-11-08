import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border border-[var(--color-border)] 
                 bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-soft)] 
                 animate-fadeIn transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle className="h-5 w-5 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)] animate-pulse-slow" />
      </div>

      {/* Message Content */}
      <div className="flex-1 text-sm leading-relaxed">
        <span className="font-semibold text-red-600 dark:text-red-400">Error:</span>{" "}
        <span className="text-[var(--color-text)]">{message}</span>
      </div>
    </div>
  );
};