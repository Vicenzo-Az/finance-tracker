import { useTheme } from "next-themes";

type Variant = "highlight" | "income" | "expense" | "balance";

interface StatCardProps {
  title: string;
  value: string;
  variant?: Variant;
}

const variantConfig: Record<
  Variant,
  {
    accent: string;
    valueDark: string;
    valueLight: string;
    glow: string;
  }
> = {
  highlight: {
    accent: "#4C8A6A",
    valueDark: "#8FC4A6",
    valueLight: "#2D6A4F",
    glow: "rgba(76,138,106,0.06)",
  },
  income: {
    accent: "#4C8A6A",
    valueDark: "#8FC4A6",
    valueLight: "#2D6A4F",
    glow: "rgba(76,138,106,0.05)",
  },
  expense: {
    accent: "#C94A3F",
    valueDark: "#D98B7E",
    valueLight: "#A63A31",
    glow: "rgba(201,74,63,0.04)",
  },
  balance: {
    accent: "#C7A35A",
    valueDark: "#D9B36A",
    valueLight: "#8A6A2F",
    glow: "rgba(199,163,90,0.05)",
  },
};

export function StatCard({
  title,
  value,
  variant = "highlight",
}: StatCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const config = variantConfig[variant];
  const valueColor = isDark ? config.valueDark : config.valueLight;

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: isDark
          ? `radial-gradient(ellipse 80% 60% at 50% 0%, ${config.glow} 0%, transparent 70%), var(--surface-card)`
          : "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `3px solid ${config.accent}`,
        boxShadow: isDark
          ? "0 4px 24px -8px rgba(0,0,0,0.4)"
          : "0 2px 12px -4px rgba(0,0,0,0.08)",
      }}
    >
      <div className="p-4 md:p-5">
        <p
          className="text-xs font-medium mb-2 md:mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          {title}
        </p>
        <p
          className="text-lg md:text-2xl font-bold font-display"
          style={{ color: valueColor }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
