import { ValoreLogo } from "@/components/brand/Logo";
import {
    BarChart2,
    CreditCard,
    LayoutDashboard,
    LayoutGrid,
    Settings,
    User,
    Wallet,
    X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/accounts", icon: Wallet, label: "Contas" },
  { to: "/transactions", icon: CreditCard, label: "Transações" },
  { to: "/categories", icon: LayoutGrid, label: "Categorias" },
  { to: "/analytics", icon: BarChart2, label: "Análises" },
  { to: "/profile", icon: User, label: "Perfil" },
  { to: "/settings", icon: Settings, label: "Configurações" },
];

interface Props {
  onClose?: () => void;
}

export function Sidebar({ onClose }: Props) {
  return (
    <aside
      className="relative h-screen w-64 flex flex-col overflow-y-auto shadow-[14px_0_40px_-28px_rgba(0,0,0,0.95)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.0) 28%), var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        color: "var(--sidebar-foreground)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        }}
      />

      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 mb-2">
        <ValoreLogo size={32} className="text-[#7DB99A]" />
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden rounded-md p-1.5 transition-colors hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.34)" }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Divisor com acento dourado */}
      <div
        className="mx-5 mb-4 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(216,184,107,0.28) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02) 100%)",
        }}
      />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
                isActive
                  ? "border-[#C7A35A]/20 text-[#E0C57D] shadow-[0_8px_24px_-18px_rgba(199,163,90,0.8)]"
                  : "border-transparent hover:border-white/5 hover:bg-white/[0.035]"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      "linear-gradient(90deg, rgba(199,163,90,0.11), rgba(199,163,90,0.04))",
                    color: "#E0C57D",
                  }
                : { color: "rgba(255,255,255,0.48)" }
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2 : 1.75}
                  style={{ color: isActive ? "#D8B86B" : undefined }}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 mt-auto">
        <div
          className="h-px mb-4"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <p
          className="text-[10px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          Valore · CSTSI / IFSul
          <br />© 2026
        </p>
      </div>
    </aside>
  );
}
