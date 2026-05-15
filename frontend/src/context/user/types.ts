import type { UserResponse } from "@/types";

export interface UserContextType {
  user: UserResponse | null;
  isLoading: boolean;
  setUser: (user: UserResponse | null) => void;
  logout: () => Promise<void>;
}
