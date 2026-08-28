import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Play, 
  Users, 
  Medal,
  HelpCircle,
  Gamepad2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const LEADERBOARD_PREVIEW = [
  { pos: 1, name: "Facundo M.", points: "1,420 pts", streak: "12 días", badge: "🥇" },
  { pos: 2, name: "Lucía R.", points: "1,310 pts", streak: "9 días", badge: "🥈" },
  { pos: 3, name: "Agustín B.", points: "1,190 pts", streak: "7 días", badge: "🥉" },
];

export const CommunitySection = () => {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <section className="container py-12 md:py-16 relative z-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-500 mb-1">
            <Trophy className="w-4 h-4" />
            Comunidad y Gamificación
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
            Desafíos interactivos y Trivia Jurídica
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Poné a prueba tus conocimientos, competí sanamente con tus compañeros y acumulá insignias de cursada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* BANNER PRINCIPAL DE TRIVIA (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-7 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#1E1303] via-[#100F1B] to-[#04060E] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600/15 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Gamification Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Racha Semanal
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 text-[10px] font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-yellow-400" /> Insignias
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> +2,500 Preguntas
              </span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-4 !text-white">
              ¿Cuánto sabés de Derecho? Jugá la Trivia del Día
            </h3>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              Respondé preguntas de Romano, Civil, Penal, Constitucional y más materias de la UNLP. Sumá puntos para el ranking general y desbloqueá logros.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/30 px-8"
            >
              <Link to="/trivia" className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <Play className="w-4 h-4 fill-current" /> Jugar Ahora
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl"
            >
              <Link to="/hace-tu-historia" className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-indigo-400" /> Hacé Tu Historia
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* RANKING PREVIEW (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className={cn(
            "lg:col-span-5 rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all",
            isLight
              ? "bg-white border-slate-200/90 shadow-sm"
              : "bg-card/70 border-white/10 backdrop-blur-md shadow-lg"
          )}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                  <Medal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Top Estudiantes
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Tabla de posiciones de la semana
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-muted text-muted-foreground">
                En vivo
              </span>
            </div>

            {/* Lista del ranking */}
            <div className="space-y-2.5">
              {LEADERBOARD_PREVIEW.map((user) => (
                <div
                  key={user.name}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border transition-colors",
                    isLight ? "bg-slate-50 border-slate-200/80" : "bg-white/5 border-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{user.badge}</span>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                        {user.streak}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-500">
                    {user.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-border/60 text-center">
            <Link
              to="/trivia"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-accent hover:underline w-full"
            >
              Ver ranking general y tus estadísticas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
