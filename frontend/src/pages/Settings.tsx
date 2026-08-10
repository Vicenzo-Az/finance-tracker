import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { Download, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] =
  [
    { value: "light", label: "Claro", icon: <Sun size={18} /> },
    { value: "dark", label: "Escuro", icon: <Moon size={18} /> },
    { value: "system", label: "Sistema", icon: <Monitor size={18} /> },
  ];

type ExportScope = "all" | "custom";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  async function handleExport() {
    if (exportScope === "custom" && !dateFrom && !dateTo) {
      setExportError(
        "Informe pelo menos uma data para o período personalizado.",
      );
      return;
    }
    setExportError("");
    setIsExporting(true);
    try {
      const params: Record<string, string> = {};
      if (exportScope === "custom") {
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
      }

      const response = await api.get("/transactions/export/csv", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const disposition = response.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1]
        : "valore_transacoes.csv";

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setExportError("Erro ao exportar transações. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  }

  const inputStyle = {
    background: "var(--surface-elevated)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-primary)",
    borderRadius: "0.75rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>

      {/* Aparência */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Aparência</h2>
            <p className="text-sm text-muted-foreground">
              Escolha como o Valore aparece para você.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                  ${
                    theme === option.value
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border hover:border-emerald-500/40 text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {option.icon}
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exportar dados */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <div>
            <h2 className="font-semibold mb-1">Exportar transações</h2>
            <p className="text-sm text-muted-foreground">
              Baixe suas transações em formato CSV para usar em planilhas ou
              outros sistemas.
            </p>
          </div>

          {/* Escopo */}
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="export_scope"
                  value="all"
                  checked={exportScope === "all"}
                  onChange={() => setExportScope("all")}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Todas as transações
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="export_scope"
                  value="custom"
                  checked={exportScope === "custom"}
                  onChange={() => setExportScope("custom")}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Período personalizado
                </span>
              </label>
            </div>

            {exportScope === "custom" && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label
                    className="text-xs font-medium block mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    De
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    max={dateTo || undefined}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-medium block mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Até
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom || undefined}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          {exportError && (
            <p className="text-sm" style={{ color: "#D98B7E" }}>
              {exportError}
            </p>
          )}

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "#4C8A6A",
              color: "#090B0A",
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            <Download size={15} />
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </button>
        </CardContent>
      </Card>

      {/* Moeda */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Moeda</h2>
            <p className="text-sm text-muted-foreground">
              Moeda utilizada em todo o sistema.
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
            <span className="text-2xl font-bold text-emerald-500">R$</span>
            <div>
              <p className="font-medium text-sm">Real Brasileiro (BRL)</p>
              <p className="text-xs text-muted-foreground">
                Suporte a outras moedas em breve
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sobre */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="font-semibold mb-1">Sobre</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Valore v1.0</p>
            <p>Domine suas finanças</p>
            <p>CSTSI — IFSul · 2026</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
