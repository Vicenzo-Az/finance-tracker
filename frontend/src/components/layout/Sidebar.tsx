import { NavLink } from "react-router-dom";

export function Sidebar() {
  const baseStyle = "block px-4 py-2 rounded-md text-sm transition-colors";

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6">
      <h1 className="text-lg font-semibold mb-8">Finance Tracker</h1>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-600/10 text-emerald-400"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`
          }
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
