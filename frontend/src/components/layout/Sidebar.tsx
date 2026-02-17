import { NavLink } from "react-router-dom";

export function Sidebar() {
  const baseStyle = "block px-4 py-2 rounded-md text-sm transition-colors";

  return (
    <aside className="w-64 border-r border-border bg-background p-6">
      <h1 className="text-lg font-semibold mb-8">Finance Tracker</h1>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-600/10 text-emerald-400"
                : "text-muted-foreground hover:text-white hover:bg-accent"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-600/10 text-emerald-400"
                : "text-muted-foreground hover:text-white hover:bg-accent"
            }`
          }
        >
          Transactions
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-600/10 text-emerald-400"
                : "text-muted-foreground hover:text-white hover:bg-accent"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-600/10 text-emerald-400"
                : "text-muted-foreground hover:text-white hover:bg-accent"
            }`
          }
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
