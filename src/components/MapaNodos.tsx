import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { MateriaNode, EstadoMateria, PlanData, TIPO_CONFIG } from "@/data/planEstudiosData";
import { cn } from "@/lib/utils";
import { Check, BookOpen, Clock, Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";

// ── Layout constants ──────────────────────────────────────────────────
const NODE_W = 180;
const NODE_H = 76;
const GAP_X  = 64;
const GAP_Y  = 68;
const PAD    = 32;

function getGridSize(materias: MateriaNode[]) {
  const maxCol = Math.max(...materias.map(m => m.col));
  const maxRow = Math.max(...materias.map(m => m.row));
  return {
    width:  PAD * 2 + (maxCol + 1) * NODE_W + maxCol * GAP_X,
    height: PAD * 2 + (maxRow + 1) * NODE_H + maxRow * GAP_Y,
  };
}

function nodeCenter(m: MateriaNode) {
  return {
    x: PAD + m.col * (NODE_W + GAP_X) + NODE_W / 2,
    y: PAD + m.row * (NODE_H + GAP_Y) + NODE_H / 2,
  };
}

function nodeTopLeft(m: MateriaNode) {
  return {
    x: PAD + m.col * (NODE_W + GAP_X),
    y: PAD + m.row * (NODE_H + GAP_Y),
  };
}

function buildArrowPath(from: MateriaNode, to: MateriaNode): string {
  const f = nodeCenter(from);
  const t = nodeCenter(to);
  const fx = f.x;
  const fy = f.y + NODE_H / 2;
  const tx = t.x;
  const ty = t.y - NODE_H / 2;
  
  // Curva bezier suave de arriba a abajo
  const cy1 = fy + (ty - fy) * 0.4;
  const cy2 = ty - (ty - fy) * 0.4;
  return `M ${fx} ${fy} C ${fx} ${cy1}, ${tx} ${cy2}, ${tx} ${ty}`;
}

type ConnectionState = "normal" | "previa" | "posterior" | "hidden";

interface MapaNodosProps {
  plan: PlanData;
  estados: Record<string, EstadoMateria>;
  onCycleEstado: (id: string) => void;
  saving: boolean;
}

export const MapaNodos: React.FC<MapaNodosProps> = ({ plan, estados, onCycleEstado, saving }) => {
  const { materias, conexiones } = plan;
  const { width, height } = getGridSize(materias);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const constraintsRef = useRef(null);

  // Hover states for interactive highlighting
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      if (cw < width) setScale(cw / width);
      else setScale(1);
    };
    update();
    const obs = new ResizeObserver(update);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [width]);

  // Habilitada logic
  const habilitadaMap = useCallback((): Record<string, boolean> => {
    const result: Record<string, boolean> = {};
    materias.forEach(m => {
      result[m.id] = m.prereqs.every(pid => estados[pid] === "aprobada");
    });
    return result;
  }, [materias, estados])();

  // Highlight relationships for hovered node
  const preReqsOfHovered = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const node = materias.find(m => m.id === hoveredNodeId);
    return new Set<string>(node?.prereqs || []);
  }, [hoveredNodeId, materias]);

  const postReqsOfHovered = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const posts = conexiones
      .filter(c => c.from === hoveredNodeId)
      .map(c => c.to);
    return new Set<string>(posts);
  }, [hoveredNodeId, conexiones]);

  const isNodeRelated = useCallback((id: string): boolean => {
    if (!hoveredNodeId) return true;
    return id === hoveredNodeId || preReqsOfHovered.has(id) || postReqsOfHovered.has(id);
  }, [hoveredNodeId, preReqsOfHovered, postReqsOfHovered]);

  const getConnectionState = useCallback((fromId: string, toId: string): ConnectionState => {
    if (!hoveredNodeId) return "normal";
    if (hoveredNodeId === fromId && postReqsOfHovered.has(toId)) return "posterior";
    if (hoveredNodeId === toId && preReqsOfHovered.has(fromId)) return "previa";
    return "hidden";
  }, [hoveredNodeId, preReqsOfHovered, postReqsOfHovered]);

  const handleClick = (id: string) => {
    if (saving) return;
    onCycleEstado(id);
  };

  const anioLabels = [...new Set(materias.map(m => m.anio))].sort();

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[620px] overflow-hidden cursor-grab active:cursor-grabbing relative bg-slate-950 dark:bg-[hsl(222_47%_4%)] rounded-3xl border border-slate-200 dark:border-white/5 shadow-inner"
    >
      <div ref={constraintsRef} className="absolute inset-0 pointer-events-none" />
      
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        initial={{ x: 0, y: 0 }}
        style={{
          width,
          height,
          transformOrigin: "top left",
          scale,
        }}
        className="relative"
      >
        {/* Year dividers & Labels */}
        {anioLabels.map(anio => {
          const anioMats = materias.filter(m => m.anio === anio);
          const minRow = Math.min(...anioMats.map(m => m.row));
          const y = PAD + minRow * (NODE_H + GAP_Y);
          return (
            <div
              key={anio}
              style={{
                position: "absolute",
                left: 0,
                top: y,
                width: "100%",
                borderTop: "1px dashed rgba(226, 232, 240, 0.1)",
                paddingTop: 6,
                paddingLeft: 8,
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/20 uppercase">
                {anio}º Año de Cursada
              </span>
            </div>
          );
        })}

        {/* Connections SVG */}
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
        >
          <defs>
            {/* Markers for Arrowheads */}
            <marker id="arrow-normal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="rgba(148, 163, 184, 0.15)" />
            </marker>
            <marker id="arrow-previa" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-posterior" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill="#10b981" />
            </marker>

            {/* Glow filters */}
            <filter id="glow-previa">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-posterior">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {conexiones.map(c => {
            const fromM = materias.find(m => m.id === c.from);
            const toM   = materias.find(m => m.id === c.to);
            if (!fromM || !toM) return null;
            const key   = `${c.from}→${c.to}`;
            const connState = getConnectionState(c.from, c.to);

            let strokeColor = "rgba(148, 163, 184, 0.12)";
            let strokeWidth = 1.5;
            let filter = undefined;
            let opacity = 0.5;

            if (hoveredNodeId) {
              if (connState === "previa") {
                strokeColor = "#f59e0b"; // Orange (requires)
                strokeWidth = 3;
                filter = "url(#glow-previa)";
                opacity = 1.0;
              } else if (connState === "posterior") {
                strokeColor = "#10b981"; // Green (unlocks)
                strokeWidth = 3;
                filter = "url(#glow-posterior)";
                opacity = 1.0;
              } else {
                opacity = 0.05; // Hidden/unrelated
              }
            } else {
              // Normal state connections
              const fromAprobada = estados[c.from] === "aprobada";
              if (fromAprobada) {
                strokeColor = "rgba(59, 130, 246, 0.4)";
                strokeWidth = 1.8;
                opacity = 0.8;
              }
            }

            const path = buildArrowPath(fromM, toM);

            return (
              <path
                key={key}
                d={path}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                markerEnd={`url(#arrow-${connState})`}
                filter={filter}
                opacity={opacity}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Subject Node Cards */}
        {materias.map(m => {
          const { x, y } = nodeTopLeft(m);
          const estado   = estados[m.id] || "pendiente";
          const hab      = habilitadaMap[m.id];
          const tipoConf = TIPO_CONFIG[m.tipo];
          const isBlocked = !hab && estado === "pendiente";
          
          const isHovered = hoveredNodeId === m.id;
          const isRelated = isNodeRelated(m.id);

          // Interactive border color based on relationship
          let borderStyle = "border-slate-200 dark:border-white/10";
          let nodeOpacity = 1.0;
          let shadow = "0 4px 6px -1px rgba(0,0,0,0.1)";

          if (hoveredNodeId) {
            if (!isRelated) {
              nodeOpacity = 0.15;
            } else if (isHovered) {
              borderStyle = "border-accent dark:border-accent ring-2 ring-accent/50 scale-[1.04]";
              shadow = "0 10px 15px -3px rgba(190,18,60,0.3)";
            } else if (preReqsOfHovered.has(m.id)) {
              borderStyle = "border-amber-500 ring-2 ring-amber-500/30"; // Amber glow for prerequisites
              shadow = "0 10px 15px -3px rgba(245,158,11,0.2)";
            } else if (postReqsOfHovered.has(m.id)) {
              borderStyle = "border-emerald-500 ring-2 ring-emerald-500/30"; // Emerald glow for unlocked subjects
              shadow = "0 10px 15px -3px rgba(16,185,129,0.2)";
            }
          } else {
            // Normal styling
            if (estado === "aprobada") {
              borderStyle = "border-emerald-500 dark:border-emerald-500/60 bg-emerald-50/10 dark:bg-emerald-950/20";
              shadow = "0 0 12px 1px rgba(16,185,129,0.15)";
            } else if (estado === "cursando") {
              borderStyle = "border-blue-500 dark:border-blue-500/60 bg-blue-50/10 dark:bg-blue-950/20";
              shadow = "0 0 12px 1px rgba(59,130,246,0.15)";
            } else if (hab) {
              borderStyle = "border-slate-300 dark:border-white/20";
            } else {
              borderStyle = "border-slate-200 dark:border-white/5 opacity-40";
            }
          }

          return (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={() => setHoveredNodeId(m.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={() => handleClick(m.id)}
              style={{
                position:      "absolute",
                left:          x,
                top:           y,
                width:         NODE_W,
                height:        NODE_H,
                opacity:       nodeOpacity,
                zIndex:        isHovered ? 10 : 2,
              }}
              className={cn(
                "rounded-2xl p-3 flex flex-col justify-between items-start text-left transition-all duration-300 shadow-md cursor-pointer bg-white dark:bg-slate-900 border",
                borderStyle
              )}
            >
              {/* Top Row: Type & Status Badge */}
              <div className="flex w-full justify-between items-center text-[8px] font-black uppercase tracking-wider">
                <span 
                  style={{
                    color: tipoConf.border,
                    background: `${tipoConf.color}15`,
                    border: `1px solid ${tipoConf.border}25`,
                  }}
                  className="px-1.5 py-0.5 rounded"
                >
                  {tipoConf.label}
                </span>

                <span className="flex items-center gap-1.5 text-slate-400">
                  {estado === "aprobada" && (
                    <span className="flex items-center gap-0.5 text-emerald-500 font-bold">
                      <Check size={11} strokeWidth={4} /> APROBADA
                    </span>
                  )}
                  {estado === "cursando" && (
                    <span className="flex items-center gap-0.5 text-blue-500 font-bold animate-pulse">
                      <BookOpen size={11} /> CURSANDO
                    </span>
                  )}
                  {estado === "pendiente" && hab && (
                    <span className="flex items-center gap-0.5 text-indigo-500 dark:text-indigo-400 font-bold">
                      <Clock size={10} /> HABILITADA
                    </span>
                  )}
                </span>
              </div>

              {/* Subject Title */}
              <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 w-full mt-1.5">
                {m.nombre}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Interactive Legend Overlays */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/70 dark:bg-black/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 pointer-events-none">
        
        {/* Legends */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-wider text-slate-650 dark:text-white/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Aprobada
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Cursando
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Habilitada
          </div>
          {hoveredNodeId && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-amber-500 block" /> Requisito Previo (Necesitás)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-emerald-500 block" /> Habilita Posterior (Abre)
              </div>
            </>
          )}
        </div>

        {/* Navigation Note */}
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-accent animate-pulse">
          🔍 Arrastrá el panel para navegar • Pasa el mouse para correlativas
        </p>
      </div>
    </div>
  );
};
export default MapaNodos;
