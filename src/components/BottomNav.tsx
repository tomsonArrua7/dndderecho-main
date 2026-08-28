import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Search, 
  Trophy, 
  User, 
  Sparkles 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { QuickSearchModal } from "./home/QuickSearchModal";

export const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const currentPath = location.pathname;

  const NAV_ITEMS = [
    {
      label: "Inicio",
      to: "/",
      icon: Home,
      isActive: currentPath === "/",
    },
    {
      label: "Estudiar",
      to: "/apuntes",
      icon: BookOpen,
      isActive: currentPath.startsWith("/apuntes") || currentPath.startsWith("/plan"),
    },
    {
      label: "Buscar",
      onClick: () => setIsSearchModalOpen(true),
      icon: Search,
      isSpecial: true,
    },
    {
      label: "Trivia",
      to: "/trivia",
      icon: Trophy,
      isActive: currentPath.startsWith("/trivia"),
    },
    {
      label: user ? "Perfil" : "Ingresar",
      to: user ? "/mi-espacio" : "/auth",
      icon: User,
      isActive: currentPath.startsWith("/mi-espacio") || currentPath.startsWith("/auth"),
    },
  ];

  return (
    <>
      <nav
        aria-label="Navegación Móvil Inferior"
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-40",
          "bg-background/95 backdrop-blur-xl border-t border-border/80 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]",
          "px-2 py-1.5 transition-all duration-300"
        )}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center py-1 px-3 text-muted-foreground hover:text-accent active:scale-90 transition-all select-none"
                  aria-label="Buscar"
                >
                  <div className="p-2 rounded-2xl bg-accent text-white shadow-md shadow-accent/30 mb-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold tracking-tight text-foreground">
                    {item.label}
                  </span>
                </button>
              );
            }

            const active = item.isActive;

            return (
              <Link
                key={item.label}
                to={item.to!}
                className={cn(
                  "flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-90 select-none relative",
                  active ? "text-accent font-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5 transition-transform", active ? "scale-110 text-accent" : "")} strokeWidth={active ? 2.5 : 2} />
                  {active && (
                    <motion.div
                      layoutId="bottomNavDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    />
                  )}
                </div>
                <span className={cn("text-[10px] font-bold mt-1 tracking-tight", active ? "text-accent" : "")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Search Modal for Mobile */}
      <QuickSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};
