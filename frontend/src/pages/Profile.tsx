import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context";
import api from "@/lib/api";
import type { UserResponse } from "@/types";
import { CheckCircle, Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const { user, setUser } = useUser();

  // Dados pessoais
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState("");

  // Senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  async function handleSaveInfo() {
    if (!name.trim()) {
      setInfoError("Nome obrigatório");
      return;
    }
    if (!email.trim()) {
      setInfoError("E-mail obrigatório");
      return;
    }
    setInfoError("");
    setIsSavingInfo(true);
    try {
      const { data } = await api.put<UserResponse>("/auth/me", { name, email });
      setUser(data);
      setInfoSuccess(true);
      setTimeout(() => setInfoSuccess(false), 3000);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      setInfoError(
        status === 409 ? "E-mail já cadastrado" : "Erro ao salvar alterações",
      );
    } finally {
      setIsSavingInfo(false);
    }
  }

  async function handleSavePassword() {
    if (!currentPassword) {
      setPasswordError("Senha atual obrigatória");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Nova senha deve ter pelo menos 8 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Senhas não coincidem");
      return;
    }
    setPasswordError("");
    setIsSavingPassword(true);
    try {
      await api.put("/auth/me", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setPasswordError(detail ?? "Erro ao alterar senha");
    } finally {
      setIsSavingPassword(false);
    }
  }

  const passwordStrength =
    newPassword.length === 0
      ? null
      : newPassword.length < 8
        ? "fraca"
        : newPassword.length < 12
          ? "média"
          : "forte";

  const strengthColor = {
    fraca: "bg-red-400",
    média: "bg-yellow-400",
    forte: "bg-emerald-400",
  };
  const strengthWidth = { fraca: "w-1/3", média: "w-2/3", forte: "w-full" };

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>

      {/* Avatar / identidade */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
            <User size={28} className="text-emerald-500" />
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dados pessoais */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-muted-foreground" />
            <h2 className="font-semibold">Dados pessoais</h2>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              Nome
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              E-mail
            </label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="pl-8"
              />
            </div>
          </div>

          {infoError && <p className="text-sm text-red-500">{infoError}</p>}

          {infoSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircle size={14} />
              Alterações salvas com sucesso
            </div>
          )}

          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={handleSaveInfo}
            disabled={isSavingInfo}
          >
            {isSavingInfo && (
              <Loader2 size={14} className="animate-spin mr-2" />
            )}
            Salvar alterações
          </Button>
        </CardContent>
      </Card>

      {/* Alterar senha */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-muted-foreground" />
            <h2 className="font-semibold">Alterar senha</h2>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              Senha atual
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              Nova senha
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            {passwordStrength && (
              <div className="mt-2">
                <div className="h-1 w-full rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthColor[passwordStrength]} ${strengthWidth[passwordStrength]}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Força:{" "}
                  <span
                    className={
                      passwordStrength === "forte"
                        ? "text-emerald-400"
                        : passwordStrength === "média"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {passwordStrength}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              Confirmar nova senha
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-500"
                  : ""
              }
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">Senhas não coincidem</p>
            )}
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircle size={14} />
              Senha alterada com sucesso
            </div>
          )}

          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={handleSavePassword}
            disabled={isSavingPassword}
          >
            {isSavingPassword && (
              <Loader2 size={14} className="animate-spin mr-2" />
            )}
            Alterar senha
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
