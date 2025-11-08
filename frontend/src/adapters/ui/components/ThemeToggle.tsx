import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 shadow-[var(--shadow-soft)]"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-[var(--color-primary)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--color-primary)]" />
      )}
    </button>
  );
};