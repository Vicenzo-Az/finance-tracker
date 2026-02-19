import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold">Welcome, User!</h2>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </header>
  );
}
