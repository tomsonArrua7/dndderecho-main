import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, Scale, X } from "lucide-react";
import { useState } from "react";
import { DndMark } from "@/components/DndMark";
import { cn } from "@/lib/utils";

const publicLinks = [
  { to: "/",                label: "Inicio" },
  { to: "/noticias",        label: "Noticias" },
  { to: "/apuntes",         label: "Apuntes" },
  { to: "/permutero",       label: "Permutero" },
  { to: "/recomendaciones", label: "Recomendaciones" },
];

const privateLinks = [
  { to: "/mi-espacio", label: "Mi Espacio" },
  { to: "/plan",       label: "Plan de Estudios" },
  { to: "/calendario", label: "Calendario" },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [...publicLinks, ...(user ? privateLinks : [])];

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-elegant">
      <div className="container flex h-12 items-center justify-between gap-3">

        {/* ── Logo: marca "D" + wordmark ── */}
        <Link
          to="/"
          className="flex items-center gap-2 group shrink-0"
          onClick={() => setOpen(false)}
        >
          {/* La D icónica — variante onBlue (fondo azul navy de la navbar) */}
          <DndMark size={32} />

          {/* Wordmark: "DND" + subtitle */}
          <div className="leading-tight hidden sm:block">
            <div className="font-display font-black text-sm tracking-tight text-white">DND</div>
            <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">
              Derecho UNLP
            </div>
          </div>
        </Link>

        {/* ── Nav desktop ── */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Acciones ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden md:flex items-center px-2 py-0.5 rounded border border-accent/60 bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-widest animate-pulse">
            Feria Activa
          </div>

          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => { await signOut(); navigate("/"); }}
              className="hidden sm:inline-flex h-7 text-xs text-white hover:bg-white/15 px-2"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Salir
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              className="hidden sm:inline-flex h-7 text-xs bg-white/10 text-white hover:bg-white/20 border border-white/20 px-3"
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5" /> Ingresar
            </Button>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-1.5 rounded text-white hover:bg-white/10"
            aria-label="Menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Menú móvil ── */}
      {open && (
        <div className="lg:hidden border-t border-white/15 bg-primary">
          <div className="container py-3 flex flex-col gap-0.5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded text-sm font-medium",
                    isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-white/15 mt-1">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-white hover:bg-white/15"
                  onClick={async () => { await signOut(); setOpen(false); navigate("/"); }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  onClick={() => { setOpen(false); navigate("/auth"); }}
                >
                  <Scale className="mr-2 h-4 w-4" /> Ingreso Estudiantil
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
