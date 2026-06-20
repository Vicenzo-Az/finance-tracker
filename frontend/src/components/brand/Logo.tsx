interface LogoProps {
  size?: number;
  className?: string;
  variant?: "moss" | "gold" | "light";
}

/**
 * Marca Valore — dois chevrons aninhados formando um "V",
 * representando camadas de organização financeira.
 */
export function ValoreMark({
  size = 32,
  className = "",
  variant = "moss",
}: LogoProps) {
  const colors = {
    moss: "#4C8A6A", // moss-400
    gold: "#C7A35A", // gold-500
    light: "#F7F8F5", // light background
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: colors[variant] }}
    >
      {/* V externo */}
      <path
        d="
      M18 18
      H38
      C40.5 18 42.7 19.3 44.1 21.4
      L50 30
      L55.9 21.4
      C57.3 19.3 59.5 18 62 18
      H82
      L57 74
      C55.7 76.9 52.9 79 50 79
      C47.1 79 44.3 76.9 43 74
      L18 18
    "
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* V interno */}
      <path
        d="
      M31 35
      H43
      C44.5 35 45.8 35.8 46.7 37
      L50 41.8
      L53.3 37
      C54.2 35.8 55.5 35 57 35
      H69
      L54 61
      C53 62.7 51.5 63.5 50 63.5
      C48.5 63.5 47 62.7 46 61
      L31 35
    "
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ValoreLogo({ size = 28, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 leading-none ${className}`}>
      <ValoreMark size={size} className="shrink-0" />
      <span
        className="font-display font-bold tracking-tight lowercase leading-none flex items-center"
        style={{ fontSize: size * 0.82, height: size }}
      >
        valore
      </span>
    </div>
  );
}
