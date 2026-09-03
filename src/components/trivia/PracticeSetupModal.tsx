import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, Check, GraduationCap, Play, X, ChevronRight } from "lucide-react";
import { CATEGORIAS_TRIVIA, TriviaCategory } from "@/data/triviaData";
import { cn } from "@/lib/utils";

interface PracticeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYearFilter: number;
  onSelectYear: (year: number) => void;
  selectedCategoria: string;
  onSelectCategoria: (catId: string) => void;
  questionsCount: number;
  onSelectQuestionsCount: (count: number) => void;
  onStartGame: () => void;
}

export const PracticeSetupModal: React.FC<PracticeSetupModalProps> = ({
  isOpen,
  onClose,
  selectedYearFilter,
  onSelectYear,
  selectedCategoria,
  onSelectCategoria,
  questionsCount,
  onSelectQuestionsCount,
  onStartGame
}) => {
  const filteredCategorias = selectedYearFilter === 0
    ? CATEGORIAS_TRIVIA
    : CATEGORIAS_TRIVIA.filter(c => c.anio === selectedYearFilter || c.id === "todas");

  const selectedCatObj = CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria);
  const selectedCatName = selectedCategoria === "todas" ? "Toda la Carrera" : (selectedCatObj?.nombre || "Materia");

  const handleStart = () => {
    onClose();
    onStartGame();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md md:max-w-lg bg-[#0A0E1A] text-white border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Modo Entrenamiento</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Configurá tu Práctica
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Elegí qué materias querés repasar y la cantidad de preguntas. Sin penalización de ELO.
          </DialogDescription>
        </DialogHeader>

        {/* SECCIÓN 1: SELECCIÓN DE ALCANCE / AÑO */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
            1. ¿Qué querés evaluar?
          </label>
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                onSelectYear(0);
                onSelectCategoria("todas");
              }}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 border",
                selectedYearFilter === 0 && selectedCategoria === "todas"
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
              )}
            >
              🎓 Toda la Carrera
            </button>
            {[1, 2, 3, 4, 5].map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onSelectYear(year);
                  // Si no hay categoría del año seleccionada, seleccionar la primera
                  const firstOfYear = CATEGORIAS_TRIVIA.find(c => c.anio === year);
                  if (firstOfYear) onSelectCategoria(firstOfYear.id);
                }}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 border",
                  selectedYearFilter === year
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                {year}º Año
              </button>
            ))}
          </div>

          {/* LISTA DE MATERIAS SI ELIGE UN AÑO */}
          {selectedYearFilter > 0 && (
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Materias de {selectedYearFilter}º Año:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredCategorias.filter(c => c.id !== "todas").map((cat) => {
                  const isSelected = selectedCategoria === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategoria(cat.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer",
                        isSelected
                          ? "bg-blue-500/20 border-blue-400 text-white shadow-md ring-1 ring-blue-500/40"
                          : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                      )}
                    >
                      <span className="truncate">{cat.nombre}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: CANTIDAD DE PREGUNTAS */}
        <div className="space-y-2.5 pt-1 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              2. Cantidad de preguntas
            </label>
            <span className="text-xs font-mono font-bold text-blue-400">
              {questionsCount} preguntas
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 20].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => onSelectQuestionsCount(cnt)}
                className={cn(
                  "py-2.5 rounded-xl border text-center transition-all cursor-pointer font-mono font-black text-sm",
                  questionsCount === cnt
                    ? "bg-blue-500/20 border-blue-400 text-white shadow-lg ring-1 ring-blue-500/40"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* RESUMEN Y BOTÓN DE INICIO */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Evaluación configurada:</span>
              <span className="font-black text-white">{selectedCatName}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
              {questionsCount} preguntas
            </span>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Comenzar Práctica Ahora</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
