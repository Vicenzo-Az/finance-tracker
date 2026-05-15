import { useContext } from "react";
import { UserContext } from "./userInstance";

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de UserProvider");
  }
  return context;
}
