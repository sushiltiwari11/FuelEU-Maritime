import React, { useState } from "react";

interface Tab {
  name: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* ===== Tabs Header ===== */}
      <nav
        className="flex flex-wrap gap-3 sm:gap-5 border-b border-[var(--color-border)] mb-6 bg-[var(--color-surface)] rounded-t-2xl shadow-[var(--shadow-soft)] backdrop-blur-lg transition-all duration-300"
        aria-label="Dashboard Tabs"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              aria-selected={isActive}
              className={`relative py-2.5 px-4 sm:px-5 text-sm sm:text-base font-medium rounded-t-xl transition-all duration-300
                ${
                  isActive
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-inner"
                    : "text-[var(--color-subtext)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]/60"
                }
              `}
            >
              {/* Active Tab Background Highlight */}
              {isActive && (
                <span className="absolute inset-0 bg-[var(--color-primary)]/5 rounded-t-xl animate-fadeIn" />
              )}

              {/* Tab Label */}
              <span className="relative z-10">{tab.name}</span>

              {/* Animated Underline Indicator */}
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full transition-all duration-300 ease-in-out
                  ${
                    isActive
                      ? "bg-[var(--color-primary)] opacity-100 scale-x-100"
                      : "bg-[var(--color-border)] opacity-0 scale-x-50"
                  }`}
              ></span>
            </button>
          );
        })}
      </nav>

      {/* ===== Tabs Content ===== */}
      <div className="pt-4 sm:pt-6 bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-4 sm:p-6 transition-all duration-500">
        <div
          key={activeTab}
          className="animate-fadeIn transition-opacity duration-300 ease-in-out"
        >
          {tabs[activeTab].content}
        </div>
      </div>
    </div>
  );
};