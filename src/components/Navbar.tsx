import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Menu, Scale, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DndMark } from "@/components/DndMark";
import { cn } from "@/lib/utils";

import { Home, Newspaper, BookOpen, Repeat2, LayoutDashboard, GraduationCap, CalendarDays, Settings } from "lucide-react";

const publicLinks = [
  { to: "/",                label: "Inicio",    icon: Home },
  { to: "/noticias",        label: "Noticias",  icon: Newspaper },
  { to: "/apuntes",         label: "Apuntes",   icon: BookOpen },
  { to: "/permutero",       label: "Permutero", icon: Repeat2 },
];

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = publicLinks;

  /* Close drawer on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Prevent body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-50 border-b border-[hsl(215_30%_30%/0.5)]"
        style={{
          background: "hsl(222 80% 11% / 0.82)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
        }}
      >
        <div className="container flex h-12 items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0 pl-0.5"
            onClick={() => setOpen(false)}
          >
            <DndMark size={34} />
            <div className="leading-tight hidden sm:block">
              <div className="font-display font-black text-sm tracking-tight text-white">DND</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-white/45 font-medium">
                Derecho UNLP
              </div>
            </div>
          </Link>

          {/* ── Nav desktop ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative px-3 py-1 flex flex-col items-center group",
                    "text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap",
                    "transition-colors duration-200",
                    isActive ? "text-white" : "text-white/50 hover:text-white/90"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-1.5">
                      <l.icon className={cn("h-3.5 w-3.5 transition-opacity", isActive ? "opacity-100 text-accent" : "opacity-60")} strokeWidth={1.5} />
                      <span>{l.label}</span>
                    </div>

                    {/* Animated underline — slides in from left on hover */}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ease-out",
                        isActive
                          ? "w-full bg-accent"
                          : "w-0 bg-white/60 group-hover:w-full"
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Feria Activa badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent/50 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
              Feria Activa
            </div>

            {/* Auth button / User Menu */}
            {user ? (
              <div className="relative hidden sm:block" onMouseLeave={() => setDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setDropdownOpen(true)}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-semibold uppercase tracking-widest btn-app",
                    "text-white/80 hover:text-white transition-colors duration-200"
                  )}
                >
                  <User className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} /> Mi Espacio
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl py-1 flex flex-col animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: "hsl(222 80% 11%)" }}>
                    <Link to="/mi-espacio" onClick={() => setDropdownOpen(false)} className="px-3 py-2 text-xs text-white/80 hover:bg-accent/10 hover:text-accent flex items-center gap-2 transition-colors">
                      <LayoutDashboard size={14}/> Mi Perfil
                    </Link>
                    <Link to="/plan" onClick={() => setDropdownOpen(false)} className="px-3 py-2 text-xs text-white/80 hover:bg-accent/10 hover:text-accent flex items-center gap-2 transition-colors">
                      <GraduationCap size={14}/> Plan de Estudios
                    </Link>
                    <Link to="/calendario" onClick={() => setDropdownOpen(false)} className="px-3 py-2 text-xs text-white/80 hover:bg-accent/10 hover:text-accent flex items-center gap-2 transition-colors">
                      <CalendarDays size={14}/> Calendario
                    </Link>
                    {profile?.role?.toLowerCase()?.trim() === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="px-3 py-2 text-xs text-white/80 hover:bg-accent/10 hover:text-accent flex items-center gap-2 transition-colors">
                        <Settings size={14}/> Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-white/10 my-1" />
                    <button onClick={async () => { await signOut(); navigate("/"); }} className="px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors w-full text-left">
                      <LogOut size={14}/> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 h-8 px-4 rounded-md btn-app",
                  "text-[11px] font-semibold uppercase tracking-widest",
                  "border border-white/40 text-white/80",
                  "bg-transparent hover:bg-accent hover:border-accent hover:text-white",
                  "transition-all duration-250 ease-out"
                )}
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={1.5} /> Ingresar
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors btn-app"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer overlay ── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer panel ── */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 flex flex-col lg:hidden",
          "transition-transform duration-300 drawer-ease",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          background: "hsl(222 80% 11% / 0.97)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          borderLeft: "1px solid hsl(215 30% 30% / 0.5)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 shrink-0">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <DndMark size={28} />
            <span className="font-display font-black text-sm tracking-tight text-white">DND</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors btn-app"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg",
                  "text-xs font-semibold uppercase tracking-widest",
                  "transition-all duration-200",
                  open ? "animate-float-up" : "",
                  isActive
                    ? "bg-white/10 text-white border-l-2 border-accent pl-3.5"
                    : "text-white/55 hover:text-white hover:bg-white/8"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <l.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-accent" : "text-white/50")} strokeWidth={1.5} />
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
          {user && (
            <>
              <div className="h-px bg-white/10 my-2 mx-4" />
              <div className="px-4 py-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">Mi Espacio</div>
              {[
                { to: "/mi-espacio", label: "Mi Perfil", icon: LayoutDashboard },
                { to: "/plan", label: "Plan de Estudios", icon: GraduationCap },
                { to: "/calendario", label: "Calendario", icon: CalendarDays },
                ...(profile?.role?.toLowerCase()?.trim() === 'admin' ? [{ to: "/admin", label: "Admin Panel", icon: Settings }] : [])
              ].map((l, i) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2",
                      "text-xs font-semibold uppercase tracking-widest",
                      "transition-all duration-200",
                      isActive
                        ? "bg-white/10 text-white text-accent"
                        : "text-white/55 hover:text-white hover:bg-white/8"
                    )
                  }
                >
                  <l.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {l.label}
                </NavLink>
              ))}
            </>
          )}

        {/* Drawer footer */}
        <div className="px-4 py-5 border-t border-white/10 space-y-2 shrink-0">
          {/* Feria badge mobile */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
            Feria Judicial Activa
          </div>

          {user ? (
            <button
              className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-widest transition-all btn-app"
              onClick={async () => { await signOut(); setOpen(false); navigate("/"); }}
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} /> Cerrar sesión
            </button>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-white/30 text-white hover:bg-accent hover:border-accent text-xs font-semibold uppercase tracking-widest transition-all duration-200 btn-app"
              onClick={() => { setOpen(false); navigate("/auth"); }}
            >
              <Scale className="h-4 w-4" strokeWidth={1.5} /> Ingreso Estudiantil
            </button>
          )}
        </div>
      </div>
    </>
  );
};
