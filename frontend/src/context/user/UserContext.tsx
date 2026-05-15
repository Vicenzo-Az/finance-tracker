import api from "@/lib/api";
import type { UserResponse } from "@/types";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { UserContext } from "./userInstance";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há sessão ativa ao carregar a aplicação
  const checkSession = useCallback(async () => {
    try {
      const { data } = await api.get<UserResponse>("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
