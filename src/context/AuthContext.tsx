import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface ProfileInfo {
  role: string;
  full_name: string | null;
  is_banned: boolean;
  anio_ingreso?: number | null;
  telefono?: string | null;
  avatar_url?: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: ProfileInfo | null;
  loading: boolean;
  signIn: (email: string, password: string, captchaToken?: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, anioIngreso: number, captchaToken?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("role, full_name, is_banned, anio_ingreso, telefono, avatar_url").eq("id", userId).maybeSingle();
      if (error) {
        console.error("Supabase profile error:", error);
      }
      const prof = (data as ProfileInfo) || { role: "estudiante", full_name: null, is_banned: false, anio_ingreso: null, telefono: null, avatar_url: null };
      
      if (prof.is_banned) {
        console.warn("User is banned. Signing out...");
        await supabase.auth.signOut();
        return;
      }
      
      setProfile(prof);
    } catch (err) {
      console.error("Unexpected error in loadProfile:", err);
      setProfile({ role: "estudiante", full_name: null, is_banned: false, anio_ingreso: null, telefono: null, avatar_url: null });
    }
  };

  useEffect(() => {
    // Safety fallback timer to prevent infinite loading on network stall
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

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
            clearTimeout(timer);
            setLoading(false);
          }, 100);
        } else {
          setProfile(null);
          clearTimeout(timer);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in onAuthStateChange:", err);
        clearTimeout(timer);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, captchaToken?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? { captchaToken } : undefined,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, anioIngreso: number, captchaToken?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        captchaToken,
        data: { 
          full_name: fullName,
          anio_ingreso: anioIngreso
        },
      },
    });
    return { error };
  };


  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const reloadProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, reloadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
