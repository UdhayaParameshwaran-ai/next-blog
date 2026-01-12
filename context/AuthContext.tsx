"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

const AuthContext = createContext<
  { user: User; setUser: (u: User) => void } | undefined
>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  const normalizedUser = initialUser ?? null;
  const [user, setUser] = useState<User | null>(normalizedUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useUser must be used within AuthProvider");
  return context;
};
