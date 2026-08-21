import React, { useCallback, useLayoutEffect, useRef, useState, useMemo } from "react";
import { MateriaNode, EstadoMateria, PlanData, TIPO_CONFIG } from "@/data/planEstudiosData";
import { cn } from "@/lib/utils";
import { Check, BookOpen, Clock, Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";

// ── Layout constants ──────────────────────────────────────────────────
const NODE_W = 180;
const NODE_H = 76;
const GAP_X  = 64;
const GAP_Y  = 36;
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

  // Si están en la misma columna (mismo año), trazar curva lateral limpia
  if (from.col === to.col) {
    const fx = f.x + NODE_W / 2;
    const fy = f.y;
    const tx = t.x + NODE_W / 2 + 4;
    const ty = t.y;
    const offset = Math.min(50, 24 + Math.abs(fy - ty) * 0.15);
    const cx1 = fx + offset;
    const cx2 = tx + offset;
    return `M ${fx} ${fy} C ${cx1} ${fy}, ${cx2} ${ty}, ${tx} ${ty}`;
  }

  const fx = f.x + NODE_W / 2;
  const fy = f.y;
  const tx = t.x - NODE_W / 2 - 4;
  const ty = t.y;
  
  // Curva bezier suave de izquierda a derecha entre columnas
  const cx1 = fx + (tx - fx) * 0.4;
  const cx2 = tx - (tx - fx) * 0.4;
  return `M ${fx} ${fy} C ${cx1} ${fy}, ${cx2} ${ty}, ${tx} ${ty}`;
}

type ConnectionState = "normal" | "previa" | "posterior" | "hidden";

interface MapaNodosProps {
  plan: PlanData;
  estados: Record<string, EstadoMateria>;
  notas: Record<string, number | null>;
  saving: boolean;
}

export const MapaNodos: React.FC<MapaNodosProps> = ({ plan, estados, notas, saving }) => {
  const { materias, conexiones } = plan;
  const { width, height } = getGridSize(materias);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [autoScale, setAutoScale] = useState(1.0);
  const scale = autoScale * zoomFactor;

  const constraintsRef = useRef(null);

  // Selection & Hover states for interactive highlighting
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeNodeId = hoveredNodeId || selectedNodeId;

  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      if (cw < width) setAutoScale(cw / width);
      else setAutoScale(1);
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

  // Highlight relationships for active node
  const preReqsOfHovered = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const node = materias.find(m => m.id === activeNodeId);
    return new Set<string>(node?.prereqs || []);
  }, [activeNodeId, materias]);

  const postReqsOfHovered = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const posts = conexiones
      .filter(c => c.from === activeNodeId)
      .map(c => c.to);
    return new Set<string>(posts);
  }, [activeNodeId, conexiones]);

  const isNodeRelated = useCallback((id: string): boolean => {
    if (!activeNodeId) return true;
    return id === activeNodeId || preReqsOfHovered.has(id) || postReqsOfHovered.has(id);
  }, [activeNodeId, preReqsOfHovered, postReqsOfHovered]);

  const getConnectionState = useCallback((fromId: string, toId: string): ConnectionState => {
    if (!activeNodeId) return "normal";
    if (activeNodeId === fromId && postReqsOfHovered.has(toId)) return "posterior";
    if (activeNodeId === toId && preReqsOfHovered.has(fromId)) return "previa";
    return "hidden";
  }, [activeNodeId, preReqsOfHovered, postReqsOfHovered]);

  const handleClick = (id: string) => {
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(id);
    }
  };

  const anioLabels = [...new Set(materias.map(m => m.anio))].sort();

  return (
    <div 
      ref={containerRef} 
      onClick={() => setSelectedNodeId(null)}
      className="w-full h-[620px] overflow-hidden cursor-grab active:cursor-grabbing relative bg-slate-950 dark:bg-[hsl(222_47%_4%)] rounded-3xl border border-slate-200 dark:border-white/5 shadow-inner"
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1.5 bg-white/70 dark:bg-black/60 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10 z-10 shadow-elegant">
        <button
          onClick={(e) => { e.stopPropagation(); setZoomFactor(z => Math.max(0.4, z - 0.15)); }}
          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors text-xs font-bold cursor-pointer"
          title="Alejar"
        >
          -
        </button>
        <span className="text-[9px] font-mono font-bold tracking-wider px-2 text-slate-500 dark:text-slate-400 min-w-10 text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setZoomFactor(z => Math.min(2.5, z + 0.15)); }}
          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors text-xs font-bold cursor-pointer"
          title="Acercar"
        >
          +
        </button>
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/15 mx-1" />
        <button
          onClick={(e) => { e.stopPropagation(); setZoomFactor(1.0); }}
          className="px-2.5 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

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
        {/* Year dividers & Labels (Left to Right Columns) */}
        {anioLabels.map(anio => {
          const x = PAD + (anio - 1) * (NODE_W + GAP_X);
          return (
            <div
              key={anio}
              style={{
                position: "absolute",
                left: x,
                top: PAD - 20,
                width: NODE_W,
                textAlign: "center",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <span className="text-[10px] font-black tracking-[0.25em] text-slate-400 dark:text-white/20 uppercase">
                {anio}º Año
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
            let opacity = 0.0; // Hidden by default!

            if (activeNodeId) {
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
                opacity = 0.05; // Dim/unrelated
              }
            } else {
              // Hide completely when no node is hovered
              opacity = 0.0;
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
          
          const isHovered = activeNodeId === m.id;
          const isRelated = isNodeRelated(m.id);

          // Interactive border color based on relationship
          let borderStyle = "border-slate-200 dark:border-white/10";
          let nodeOpacity = 1.0;
          let shadow = "0 4px 6px -1px rgba(0,0,0,0.1)";

          if (activeNodeId) {
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
              onClick={(e) => { e.stopPropagation(); handleClick(m.id); }}
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
