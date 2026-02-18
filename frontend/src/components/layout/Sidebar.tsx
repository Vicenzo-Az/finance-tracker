import { CreditCard, LayoutDashboard, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const baseStyle =
    "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <aside
      className="h-screen w-64
    bg-emerald-900 text-emerald-50
    dark:bg-emerald-950
    border-r border-emerald-800/50 p-6"
    >
      <h1 className="text-lg font-semibold tracking-tight mb-8">
        Finance Tracker
      </h1>

      <nav className="space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-700/70 text-white"
                : "text-emerald-100 hover:bg-emerald-800/60"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-700/70 text-white"
                : "text-emerald-100 hover:bg-emerald-800/60"
            }`
          }
        >
          <CreditCard size={18} />
          Transactions
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-700/70 text-white"
                : "text-emerald-100 hover:bg-emerald-800/60"
            }`
          }
        >
          <User size={18} />
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? "bg-emerald-700/70 text-white"
                : "text-emerald-100 hover:bg-emerald-800/60"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
