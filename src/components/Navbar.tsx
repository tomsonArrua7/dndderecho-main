import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, Scale, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/dnd-logo.png";
import { cn } from "@/lib/utils";

const publicLinks = [
  { to: "/", label: "Inicio" },
  { to: "/noticias", label: "Noticias" },
  { to: "/apuntes", label: "Apuntes" },
  { to: "/permutero", label: "Permutero" },
];

const privateLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/plan", label: "Plan de Estudios" },
  { to: "/calendario", label: "Calendario" },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [...publicLinks, ...(user ? privateLinks : [])];

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-elegant">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-md p-1 shadow-paper">
            <img src={logo} alt="DND Defendamos Nuestro Derecho" className="h-8 w-8 object-contain" />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-display font-bold text-base tracking-tight text-white">DND</div>
            <div className="text-[10px] uppercase tracking-widest text-white/75">Derecho UNLP</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-white text-primary shadow-paper"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => { await signOut(); navigate("/"); }}
              className="hidden sm:inline-flex text-white hover:bg-white/15 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" /> Salir
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              className="hidden sm:inline-flex bg-white text-primary hover:bg-white/90 shadow-paper"
            >
              <LogIn className="mr-2 h-4 w-4" /> Ingreso Estudiantil
            </Button>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/15"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/15 bg-primary">
          <div className="container py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2.5 rounded-md text-sm font-medium",
                    isActive ? "bg-white text-primary" : "text-white/85 hover:bg-white/10"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-white/15 mt-2">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-white hover:bg-white/15 hover:text-white"
                  onClick={async () => { await signOut(); setOpen(false); navigate("/"); }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-white text-primary hover:bg-white/90"
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
