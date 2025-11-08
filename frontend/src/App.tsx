import { useEffect, useState } from "react";
import {
  Settings,
  LayoutGrid,
  LineChart,
  Database,
  Layers,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  UserCircle2,
} from "lucide-react";
import { ApiProvider } from "infrastructure/api/ApiContext";
import { RoutesTab } from "adapters/ui/pages/RoutesTab";
import { CompareTab } from "adapters/ui/pages/CompareTab";
import { BankingTab } from "adapters/ui/pages/BankingTab";
import { PoolingTab } from "adapters/ui/pages/PoolingTab";
import { ThemeToggle } from "adapters/ui/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const dashboardTabs = [
  { name: "Routes", icon: LayoutGrid, content: <RoutesTab /> },
  { name: "Compare", icon: LineChart, content: <CompareTab /> },
  { name: "Banking", icon: Database, content: <BankingTab /> },
  { name: "Pooling", icon: Layers, content: <PoolingTab /> },
];

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed") || "false")
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <ApiProvider>
      <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text)] transition-all duration-500">
        {/* ===== Sidebar ===== */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col justify-between bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-[var(--shadow-soft)] transition-all duration-500 ${
            sidebarCollapsed ? "w-20" : "w-64"
          } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Top Section */}
          <div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              {!sidebarCollapsed && (
                <h1 className="text-lg font-semibold text-[var(--color-primary)] whitespace-nowrap overflow-hidden transition-all duration-500">
                  FuelEU Maritime
                </h1>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-[var(--color-bg)]/50 transition"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-[var(--color-subtext)]" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-[var(--color-subtext)]" />
                )}
              </button>
              {/* Mobile Close */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg)]/50 transition"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5 text-[var(--color-subtext)]" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-1 mt-4 px-2">
              {dashboardTabs.map((tab, index) => {
                const isActive = index === activeTab;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => {
                      setActiveTab(index);
                      setMobileSidebarOpen(false);
                    }}
                    className={`relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 group ${
                      isActive
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "text-[var(--color-subtext)] hover:bg-[var(--color-bg)]/60 hover:text-[var(--color-primary)]"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{tab.name}</span>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {sidebarCollapsed && (
                      <span className="absolute left-16 opacity-0 group-hover:opacity-100 text-xs px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-md text-[var(--color-text)] whitespace-nowrap transition">
                        {tab.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[var(--color-border)] p-4 flex items-center justify-center gap-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            {!sidebarCollapsed && (
              <button className="p-2 rounded-lg hover:bg-[var(--color-primary)]/10 transition-all duration-300 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[var(--color-subtext)] hover:text-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-subtext)]">Settings</span>
              </button>
            )}
          </div>
        </aside>

        {/* ===== Main Content Area ===== */}
        <div className="flex flex-col flex-1 overflow-x-hidden">
          {/* ===== Header ===== */}
          <header className="sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur-lg border-b border-[var(--color-border)] shadow-[var(--shadow-soft)] transition-all duration-500">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg)]/50 transition"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5 text-[var(--color-text)]" />
                </button>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {dashboardTabs[activeTab].name}
                </h2>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-1.5">
                  <Search className="w-4 h-4 text-[var(--color-subtext)]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none text-sm text-[var(--color-text)] ml-2 w-32 sm:w-44"
                  />
                </div>
                <UserCircle2 className="w-7 h-7 text-[var(--color-subtext)] hover:text-[var(--color-primary)] transition" />
              </div>
            </div>
          </header>

          {/* ===== Animated Page Content ===== */}
          <main className="flex-1 px-6 py-8 overflow-y-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-glow)]"
            >
              <AnimatePresence mode="wait">
                {dashboardTabs[activeTab].content}
              </AnimatePresence>
            </motion.div>
          </main>

          {/* ===== Footer ===== */}
          <footer className="py-4 text-center text-xs text-[var(--color-subtext)] border-t border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
            © {new Date().getFullYear()} FuelEU Maritime — All Rights Reserved
          </footer>
        </div>
      </div>
    </ApiProvider>
  );
}