import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categoryService";
import type { Category, CreateCategoryInput } from "@/types";
import { Loader2, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const COLOR_OPTIONS = [
  "#4C8A6A", "#C7A35A", "#3B9B95", "#C94A3F",
  "#8b5cf6", "#3b82f6", "#ec4899", "#f97316",
  "#84cc16", "#64748b", "#f43f5e", "#06b6d4",
];

const TYPE_OPTIONS = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
  { value: "both", label: "Ambos" },
];

function CategoryForm({
  initial,
  onSave,
  onCancel,
  isLoading,
}: {
  initial?: Partial<CreateCategoryInput>;
  onSave: (input: CreateCategoryInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "#4C8A6A");
  const [type, setType] = useState<"expense" | "income" | "both">(
    (initial?.type as "expense" | "income" | "both") ?? "expense"
  );
  const [error, setError] = useState("");

  function handleSave() {
    if (!name.trim()) { setError("Nome obrigatório"); return; }
    onSave({ name: name.trim(), color, type, icon: "tag" });
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Nome */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>
          Nome
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Academia, Streaming..."
          className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>
          Tipo
        </label>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value as "expense" | "income" | "both")}
              className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all"
              style={
                type === opt.value
                  ? {
                      border: "1px solid rgba(76,138,106,0.5)",
                      background: "rgba(76,138,106,0.1)",
                      color: "#4C8A6A",
                    }
                  : {
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-muted)",
                    }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cor */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>
          Cor
        </label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full transition-all"
              style={{
                backgroundColor: c,
                transform: color === c ? "scale(1.15)" : "scale(1)",
                boxShadow: color === c ? `0 0 0 2px white, 0 0 0 3px ${c}` : "none",
              }}
            />
          ))}
        </div>
        {/* Preview */}
        <div
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: `${color}20`, color }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          {name || "Prévia"}
        </div>
      </div>

      {error && <p className="text-sm" style={{ color: "#D98B7E" }}>{error}</p>}

      <div className="flex gap-2 pt-2">
        <button
          className="flex-1 py-2.5 rounded-xl text-sm transition-all"
          style={{ border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          style={{ background: "#4C8A6A", color: "#090B0A", opacity: isLoading ? 0.6 : 1 }}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          Salvar
        </button>
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
      style={{ background: `${category.color}15`, border: `1px solid ${category.color}30` }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: category.color }} />
      <span style={{ color: category.color }}>{category.name}</span>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState("");

  async function load() {
    try {
      const data = await getCategories();
      setCategories(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(input: CreateCategoryInput) {
    setIsSaving(true);
    try {
      const created = await createCategory(input);
      setCategories((prev) => [...prev, created]);
      setAddOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(input: CreateCategoryInput) {
    if (!editingCategory) return;
    setIsSaving(true);
    try {
      const updated = await updateCategory(editingCategory.id, input);
      setCategories((prev) => prev.map((c) => c.id === updated.id ? updated : c));
      setEditingCategory(null);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteError("");
    } catch {
      setDeleteError("Não é possível deletar uma categoria com transações vinculadas.");
    }
  }

  const systemCategories = categories.filter((c) => !c.user_id);
  const userCategories = categories.filter((c) => !!c.user_id);
  const systemExpense = systemCategories.filter((c) => c.type === "expense" || c.type === "both");
  const systemIncome = systemCategories.filter((c) => c.type === "income" || c.type === "both");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#7DB99A" }} />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Categorias
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Organize suas transações com categorias personalizadas
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#4C8A6A", color: "#090B0A" }}
        >
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      {/* Minhas categorias */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
          Minhas categorias
          <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
            style={{ background: "rgba(76,138,106,0.1)", color: "#4C8A6A" }}>
            {userCategories.length}
          </span>
        </h2>

        {userCategories.length === 0 ? (
          <div
            className="p-8 text-center rounded-2xl"
            style={{ background: "var(--surface-card)", border: "1px dashed var(--border-subtle)" }}
          >
            <div className="max-w-xs mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(76,138,106,0.1)" }}>
                <Tag size={22} style={{ color: "#7DB99A" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Nenhuma categoria personalizada ainda.
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "#4C8A6A", color: "#090B0A" }}
              >
                <Plus size={14} /> Criar categoria
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
            {userCategories.map((cat, i) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-5 py-3.5"
                style={{
                  borderBottom: i < userCategories.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  borderLeft: `3px solid ${cat.color}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {cat.name}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: cat.type === "income"
                        ? "rgba(76,138,106,0.1)"
                        : cat.type === "expense"
                          ? "rgba(201,74,63,0.1)"
                          : "rgba(199,163,90,0.1)",
                      color: cat.type === "income"
                        ? "#4C8A6A"
                        : cat.type === "expense"
                          ? "#C94A3F"
                          : "#C7A35A",
                    }}
                  >
                    {cat.type === "income" ? "Receita" : cat.type === "expense" ? "Despesa" : "Ambos"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: "var(--text-muted)" }}
                    onClick={() => setEditingCategory(cat)}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: "rgba(201,74,63,0.7)" }}
                    onClick={() => { setDeleteTarget(cat); setDeleteError(""); }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categorias do sistema */}
      <div>
        <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
          Categorias do sistema
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          Disponíveis para todos os usuários. Não podem ser editadas.
        </p>

        <div className="space-y-5">
          {systemExpense.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-3 uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>
                Despesas
              </p>
              <div className="flex flex-wrap gap-2">
                {systemExpense.map((cat) => (
                  <CategoryBadge key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          )}
          {systemIncome.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-3 uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>
                Receitas
              </p>
              <div className="flex flex-wrap gap-2">
                {systemIncome.map((cat) => (
                  <CategoryBadge key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog criar */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSave={handleCreate}
            onCancel={() => setAddOpen(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog editar */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initial={editingCategory}
              onSave={handleUpdate}
              onCancel={() => setEditingCategory(null)}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog deletar */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteError(""); } }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Tem certeza que deseja deletar a categoria{" "}
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {deleteTarget?.name}
              </span>
              ? As transações vinculadas não serão deletadas, mas perderão a categoria.
            </p>
            {deleteError && (
              <p className="text-sm rounded-xl px-3 py-2"
                style={{ color: "#D98B7E", background: "rgba(201,74,63,0.08)", border: "1px solid rgba(201,74,63,0.2)" }}>
                {deleteError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: "rgba(201,74,63,0.15)", border: "1px solid rgba(201,74,63,0.3)", color: "#D98B7E" }}
                onClick={handleDelete}
              >
                Deletar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
