import { ValoreLogo } from "@/components/brand/Logo";
import {
  BarChart2,
  CreditCard,
  LayoutDashboard,
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
      className="h-screen w-64 flex flex-col overflow-y-auto"
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        color: "var(--sidebar-foreground)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 mb-2">
        <ValoreLogo size={32} className="text-[#7DB99A]" />
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
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
            "linear-gradient(90deg, rgba(199,163,90,0.3) 0%, rgba(255,255,255,0.04) 60%)",
        }}
      />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
                isActive
                  ? "border-[#C7A35A]/20 text-[#D9B36A]"
                  : "border-transparent hover:bg-white/[0.04]"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: "rgba(199,163,90,0.08)", color: "#D9B36A" }
                : { color: "rgba(255,255,255,0.45)" }
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2 : 1.75}
                  style={{ color: isActive ? "#C7A35A" : undefined }}
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
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <p
          className="text-[10px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.18)" }}
        >
          Valore · CSTSI / IFSul
          <br />© 2026
        </p>
      </div>
    </aside>
  );
}
