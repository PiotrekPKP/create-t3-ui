import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="absolute bottom-12 right-12 h-16 w-16 p-4 dark:bg-gray-700 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle;
