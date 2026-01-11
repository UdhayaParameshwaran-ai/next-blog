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
  initialUser: User | undefined;
}) {
  const [user, setUser] = useState<User>(initialUser ?? null);

  useEffect(() => {
    setUser(initialUser ?? null);
  }, [initialUser]);

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
