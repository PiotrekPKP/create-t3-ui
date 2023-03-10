import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="fixed bottom-12 right-12 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 p-4 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle;
