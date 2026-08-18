import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/types";
import { getIcon } from "@/utils/categoryIcons";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}

export function CategoryPicker({
  categories,
  value,
  onChange,
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = categories.find((c) => c.id === value);
  const [, setHoveredId] = useState<string | null>(null);

  function handleSelect(id: string) {
    onChange(value === id ? "" : id);
    setOpen(false);
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all"
        style={{
          background: "var(--surface-elevated)",
          border: "1px solid var(--border-subtle)",
          color: selected ? selected.color : "var(--text-muted)",
        }}
        onClick={() => setOpen(true)}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = getIcon(selected.icon);
              return <Icon size={15} strokeWidth={1.75} />;
            })()}
            <span className="font-medium">{selected.name}</span>
          </div>
        ) : (
          <span>Opcional</span>
        )}
        <div
          className="flex items-center gap-1.5"
          style={{ color: "var(--text-muted)" }}
        >
          {selected && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown size={14} />
        </div>
      </button>

      {/* Modal centralizado */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setHoveredId(null); // reseta ao fechar
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Selecionar categoria</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2 mt-2 overflow-y-auto max-h-[60vh] pr-1">
            {categories.map((cat) => {
              const Icon = getIcon(cat.icon);
              const isSelected = cat.id === value;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelect(cat.id)}
                  className="category-chip flex flex-col items-center justify-center gap-2 rounded-xl border transition-all"
                  style={{
                    padding: "12px 8px",
                    minHeight: "72px",
                    background: isSelected
                      ? `${cat.color}20`
                      : `${cat.color}10`,
                    border: isSelected
                      ? `1.5px solid ${cat.color}`
                      : `1px solid ${cat.color}30`,
                    color: cat.color,
                    transition: "border 0.15s ease, transform 0.15s ease",
                  }}
                >
                  <Icon size={22} strokeWidth={1.75} />
                  <span
                    className="text-center font-medium leading-tight"
                    style={{
                      fontSize: "10px",
                      wordBreak: "normal",
                      overflowWrap: "anywhere",
                      hyphens: "auto",
                    }}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
