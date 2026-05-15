import { Button } from "@/components/ui/button";
import { useUser } from "@/context";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/landing");
  }

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold">
        Bem-vindo{user?.name ? `, ${user.name}` : ""}!
      </h2>

      <div className="flex items-center gap-2">
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

        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
