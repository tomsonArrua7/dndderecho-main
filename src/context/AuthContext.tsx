import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface ProfileInfo {
  role: string;
  full_name: string | null;
  is_banned: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: ProfileInfo | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("role, full_name, is_banned").eq("id", userId).maybeSingle();
      if (error) {
        console.error("Supabase profile error:", error);
      }
      const prof = (data as ProfileInfo) || { role: "estudiante", full_name: null, is_banned: false };
      
      if (prof.is_banned) {
        console.warn("User is banned. Signing out...");
        await supabase.auth.signOut();
        return;
      }
      
      setProfile(prof);
    } catch (err) {
      console.error("Unexpected error in loadProfile:", err);
      setProfile({ role: "estudiante", full_name: null, is_banned: false });
    }
  };

  useEffect(() => {
    // Only use onAuthStateChange for multi-tab robust sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      try {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          // Usamos setTimeout para salir del hilo actual y permitir que Supabase
          // libere el "lock" de la sesión antes de hacer la consulta a la DB.
          // Esto evita el error: 'Lock was released because another request stole it'
          setTimeout(async () => {
            await loadProfile(newSession.user.id);
            setLoading(false);
          }, 100);
        } else {
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in onAuthStateChange:", err);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
