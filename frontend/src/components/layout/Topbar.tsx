import { useTheme } from "next-themes";

export function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-3 py-1 rounded-md border border-zinc-700 text-sm"
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}
