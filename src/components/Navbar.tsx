import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Menu, Scale, ShieldCheck, Sun, Moon, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DndMark } from "@/components/DndMark";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import logoDndNuevoFondoBlanco from "@/assets/logo-dnd-nuevo-fondo-blanco.png";

import { Home, Newspaper, BookOpen, Repeat2, LayoutDashboard, GraduationCap, CalendarDays, Settings, User, Bot, Users, Trophy } from "lucide-react";

const publicLinks = [
  { to: "/noticias",        label: "Noticias",       icon: Newspaper },
  { to: "/apuntes",         label: "Biblioteca",     icon: BookOpen },
  { to: "/asistente",       label: "Asistente DND",  icon: Bot },
  { to: "/permutero",       label: "Permutero",      icon: Repeat2 },
  { to: "/servicios",       label: "Info Útil",      icon: ShieldCheck },
  { to: "/quienes-somos",   label: "Quiénes Somos",  icon: Users },
];

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = publicLinks;
  const isLight = resolvedTheme === "light";
  const logoSrc = isLight ? logoDndNuevoFondoBlanco : "/LogoDNDnuevo.png";

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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md shadow-lg border-b",
          isLight
            ? "bg-white/95 border-slate-200/90 text-slate-900"
            : "bg-gradient-to-r from-[#060A18]/90 via-[#10132B]/85 to-[#4A0E17]/90 border-white/10 text-white selection:bg-accent/30"
        )}
      >
        <div className="w-full px-3 md:px-8 flex h-16 items-center justify-between gap-2">

          {/* ── Logo + Subtext ── */}
          <Link
            to="/"
            className="flex items-center gap-2 group shrink-0 transition-transform duration-300 hover:scale-105"
            onClick={() => setOpen(false)}
          >
            <img src={logoSrc} alt="Dnd." className="h-5 md:h-6 w-auto object-contain" />
            <div className="leading-[1.15] flex flex-col text-left font-display">
              <span className={cn("text-[9px] md:text-[10px] font-black tracking-widest uppercase", isLight ? "text-[#0B132B]" : "text-white")}>
                DEFENDAMOS
              </span>
              <span className="text-red-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                NUESTRO DERECHO
              </span>
            </div>
          </Link>

          {/* ── Nav desktop (Cápsula Flotante Glassmorphism) ── */}
          <nav className="hidden lg:flex items-center flex-1 justify-center min-w-0 px-2">
            <div
              className={cn(
                "inline-flex items-center gap-1 p-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg",
                isLight
                  ? "bg-slate-100/90 border-slate-200/90 shadow-slate-200/50"
                  : "bg-white/[0.04] border-white/10 shadow-black/40"
              )}
            >
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 group transition-all duration-300 select-none",
                      "text-[11px] xl:text-[11.5px] font-extrabold uppercase tracking-[0.08em] whitespace-nowrap",
                      isActive
                        ? (isLight ? "text-slate-950" : "text-white")
                        : (isLight ? "text-slate-600 hover:text-slate-950" : "text-white/60 hover:text-white")
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active floating background pill (Framer Motion) */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className={cn(
                            "absolute inset-0 rounded-full shadow-md z-0",
                            isLight
                              ? "bg-white border border-slate-200/80 shadow-slate-200"
                              : "bg-gradient-to-r from-red-600/35 via-red-500/25 to-red-600/35 border border-red-500/40 shadow-[0_0_12px_rgba(220,38,38,0.35)]"
                          )}
                        />
                      )}

                      {/* Icon */}
                      <l.icon
                        className={cn(
                          "h-3.5 w-3.5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                          isActive
                            ? "text-red-500"
                            : (isLight ? "text-slate-500 group-hover:text-red-500" : "text-white/40 group-hover:text-red-400")
                        )}
                        strokeWidth={2.2}
                      />

                      {/* Label */}
                      <span className="relative z-10">{l.label}</span>

                      {/* Badge IA for Asistente DND */}
                      {l.to === "/asistente" && (
                        <span
                          className={cn(
                            "relative z-10 text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-tighter uppercase leading-none border transition-all duration-300",
                            isActive
                              ? "bg-red-500 text-white border-red-400 shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                              : "bg-red-500/20 text-red-400 border-red-500/30 group-hover:bg-red-500 group-hover:text-white"
                          )}
                        >
                          IA
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2 xl:gap-4 shrink-0">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className={cn(
                "p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer",
                isLight
                  ? "text-slate-700 hover:bg-slate-100 border border-slate-200"
                  : "text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
              )}
              aria-label="Cambiar tema"
            >
              {resolvedTheme === "light" ? (
                <Moon className="h-4 w-4 text-indigo-500 fill-indigo-500/10" strokeWidth={2} />
              ) : (
                <Sun className="h-4 w-4 text-amber-400 fill-amber-400/10" strokeWidth={2} />
              )}
            </motion.button>

            {/* Auth button / User Menu */}
            {user ? (
              <div className="relative hidden sm:block" onMouseLeave={() => setDropdownOpen(false)}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    "inline-flex items-center gap-2 h-9 px-4 xl:px-5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-md",
                    isLight
                      ? "bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-red-500/50"
                      : "bg-black/40 border border-white/20 text-white hover:bg-white/10 hover:border-red-500/50"
                  )}
                >
                  <User className="h-4 w-4 text-red-500" strokeWidth={2.5} /> 
                  <span>Mi Perfil</span>
                </motion.button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 pt-3 w-56 z-50"
                    >
                      <div className="bg-[#0A0E1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 flex flex-col overflow-hidden">
                        <Link to="/mi-espacio" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-xs font-bold text-white/60 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-all duration-300">
                          <LayoutDashboard size={16} strokeWidth={2}/> Mi Espacio
                        </Link>
                        <Link to="/plan" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-xs font-bold text-white/60 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-all duration-300">
                          <GraduationCap size={16} strokeWidth={2}/> Plan de Estudios
                        </Link>
                        <Link to="/calendario" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-xs font-bold text-white/60 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-all duration-300">
                          <CalendarDays size={16} strokeWidth={2}/> Calendario
                        </Link>
                        {(profile?.role === 'admin' || profile?.role === 'escritor') && (
                          <Link to="/panel-escritor" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-xs font-bold text-white/60 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-all duration-300">
                            <Newspaper size={16} strokeWidth={2}/> Panel Redacción
                          </Link>
                        )}
                        {profile?.role === 'admin' && (
                          <>
                            <Link to="/trivia" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-xs font-bold text-amber-400 hover:bg-amber-500/10 flex items-center gap-3 transition-all duration-300">
                              <Trophy size={16} strokeWidth={2}/> Trivia Jurídica (Beta)
                            </Link>
                            <Link to="/admin" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-xs font-bold text-white/60 hover:bg-accent/10 hover:text-accent flex items-center gap-3 transition-all duration-300">
                              <Settings size={16} strokeWidth={2}/> Panel Admin
                            </Link>
                          </>
                        )}
                        <div className="h-px bg-white/5 my-1" />
                        <button onClick={async () => { await signOut(); navigate("/"); }} className="px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all duration-300 w-full text-left">
                          <LogOut size={16} strokeWidth={2}/> Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onClick={() => navigate("/auth")}
                className={cn(
                  "hidden sm:inline-flex items-center gap-2 h-9 px-4 xl:px-5 rounded-full text-[11px] font-black uppercase tracking-widest",
                  "bg-black/40 border border-white/20 text-white hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 shadow-md"
                )}
              >
                <User className="h-4 w-4 text-red-500" strokeWidth={2.5} />
                <span>Mi Perfil</span>
              </motion.button>
            )}

            {/* Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 border border-white/5 transition-all duration-300"
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer Panel ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md lg:hidden"
            />
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-[70] h-full w-[80%] max-w-sm flex flex-col lg:hidden border-l border-white/10 bg-[#0A0E1A]/95 backdrop-blur-2xl shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/5 shrink-0">
                <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                  <DndMark size={32} />
                  <span className="font-display font-black text-lg tracking-tight text-white">DND</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 pl-2">Navegación</div>
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300",
                          isActive
                            ? "bg-accent/10 text-accent font-black border border-accent/20"
                            : "text-white/40 hover:text-white hover:bg-white/5 font-bold"
                        )
                      }
                    >
                      <l.icon className="h-5 w-5" strokeWidth={2} />
                      <span className="text-[13px] uppercase tracking-widest">{l.label}</span>
                    </NavLink>
                  </motion.div>
                ))}

                {user && (
                  <div className="pt-8 space-y-2">
                    <div className="h-px bg-white/5 my-6" />
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 pl-2">Área Personal</div>
                    {[
                      { to: "/mi-espacio", label: "Mi Perfil", icon: LayoutDashboard },
                      { to: "/plan", label: "Plan Estudios", icon: GraduationCap },
                      { to: "/calendario", label: "Calendario", icon: CalendarDays },
                    ].map((l, i) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
                            isActive ? "bg-white/10 text-white" : "text-white/30 hover:text-white"
                          )
                        }
                      >
                        <l.icon className="h-4 w-4" strokeWidth={2} />
                        <span className="text-[12px] uppercase tracking-widest font-bold">{l.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer footer */}
              <div className="p-6 border-t border-white/5 space-y-4 shrink-0 bg-black/20">
                {!user && (
                  <button
                    onClick={() => { setOpen(false); navigate("/auth"); }}
                    className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-accent text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20"
                  >
                    <LogIn className="h-4 w-4" strokeWidth={2.5} /> Ingresar
                  </button>
                )}
                {user && (
                  <button
                    onClick={async () => { await signOut(); setOpen(false); navigate("/"); }}
                    className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2} /> Cerrar Sesión
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
