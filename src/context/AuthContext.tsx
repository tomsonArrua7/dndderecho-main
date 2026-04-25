import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface ProfileInfo {
  role: string;
  full_name: string | null;
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
      const { data, error } = await supabase.from("profiles").select("role, full_name").eq("id", userId).maybeSingle();
      if (error) {
        console.error("Supabase profile error:", error);
      }
      setProfile((data as ProfileInfo) || { role: "estudiante", full_name: null });
    } catch (err) {
      console.error("Unexpected error in loadProfile:", err);
      setProfile({ role: "estudiante", full_name: null });
    }
  };

  useEffect(() => {
    // Fallback de seguridad: si getSession se traba (ej. deadlock entre pestañas), forzamos loading a false.
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      try {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        if (_event === 'INITIAL_SESSION') {
          clearTimeout(fallbackTimer);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in onAuthStateChange:", err);
      }
    });

    // Luego sesión inicial
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      try {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await loadProfile(s.user.id);
        }
      } catch (err) {
        console.error("Error loading initial session:", err);
      } finally {
        clearTimeout(fallbackTimer);
        setLoading(false);
      }
    }).catch((err) => {
      console.error("Critical error in getSession:", err);
      clearTimeout(fallbackTimer);
      setLoading(false);
    });

    return () => {
      clearTimeout(fallbackTimer);
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
