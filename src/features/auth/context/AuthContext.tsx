import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuth, getUserRole } from "../services/authService";

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "admin" | "user";
};

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuth(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const role = await getUserRole(firebaseUser.uid);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);