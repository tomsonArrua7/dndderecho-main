import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { MateriaNode, EstadoMateria, PlanData, TIPO_CONFIG } from "@/data/planEstudiosData";
import { cn } from "@/lib/utils";
import { Check, BookOpen, Clock, Maximize2, Minimize2 } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// ── Layout constants ──────────────────────────────────────────────────
const NODE_W = 160;
const NODE_H = 72;
const GAP_X  = 52;
const GAP_Y  = 64;
const PAD    = 24;

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
  const cy1 = fy + (ty - fy) * 0.4;
  const cy2 = ty - (ty - fy) * 0.4;
  return `M ${fx} ${fy} C ${fx} ${cy1}, ${tx} ${cy2}, ${tx} ${ty}`;
}

type ArrowState = "inactive" | "unlocked" | "active";

function arrowColour(state: ArrowState): string {
  switch (state) {
    case "active":   return "#22d3ee";
    case "unlocked": return "#1d4ed8";
    default:         return "hsl(222 47% 22%)";
  }
}

function nodeBg(estado: EstadoMateria, habilitada: boolean): string {
  if (estado === "aprobada")  return "#0f2c5e";
  if (estado === "cursando")  return "#1a0a0a";
  if (habilitada)             return "#0c1f44";
  return "#0c1627";
}

function nodeBorder(estado: EstadoMateria, habilitada: boolean): string {
  if (estado === "aprobada")  return "#22d3ee";
  if (estado === "cursando")  return "#ef4444";
  if (habilitada)             return "#3b82f6";
  return "hsl(222 47% 22%)";
}

function nodeTextColor(estado: EstadoMateria, habilitada: boolean): string {
  if (estado === "aprobada")  return "#7dd3fc";
  if (estado === "cursando")  return "#fca5a5";
  if (habilitada)             return "#e0f2fe";
  return "hsl(215 20% 45%)";
}

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

  const habilitadaMap = useCallback((): Record<string, boolean> => {
    const result: Record<string, boolean> = {};
    materias.forEach(m => {
      result[m.id] = m.prereqs.every(pid => estados[pid] === "aprobada");
    });
    return result;
  }, [materias, estados])();

  const arrowStateMap = useCallback((): Record<string, ArrowState> => {
    const result: Record<string, ArrowState> = {};
    conexiones.forEach(c => {
      const key = `${c.from}→${c.to}`;
      const fromAprobada = estados[c.from] === "aprobada";
      const toHabilitada = habilitadaMap[c.to];
      if (fromAprobada && toHabilitada) result[key] = "active";
      else if (fromAprobada)            result[key] = "unlocked";
      else                              result[key] = "inactive";
    });
    return result;
  }, [conexiones, estados, habilitadaMap])();

  const handleClick = (id: string) => {
    if (saving) return;
    onCycleEstado(id);
  };

  const anioLabels = [...new Set(materias.map(m => m.anio))].sort();

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[600px] overflow-hidden cursor-grab active:cursor-grabbing relative bg-[hsl(222_47%_4%)] rounded-2xl border border-white/5"
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
        }}
        className="relative"
      >
        {/* Year labels */}
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
                borderTop: "1px solid hsl(222 47% 12%)",
                paddingTop: 4,
                paddingLeft: 4,
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
                {anio}º Año
              </span>
            </div>
          );
        })}

        {/* Arrows */}
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
        >
          <defs>
            <marker id="arrow-inactive" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="hsl(222 47% 22%)" />
            </marker>
            <marker id="arrow-unlocked" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#1d4ed8" />
            </marker>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
            </marker>
            <filter id="glow-cyan">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {conexiones.map(c => {
            const fromM = materias.find(m => m.id === c.from);
            const toM   = materias.find(m => m.id === c.to);
            if (!fromM || !toM) return null;
            const key   = `${c.from}→${c.to}`;
            const state = arrowStateMap[key] || "inactive";
            const color = arrowColour(state);
            const path  = buildArrowPath(fromM, toM);

            return (
              <path
                key={key}
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={state === "active" ? 2.5 : 1.5}
                strokeDasharray={state === "inactive" ? "5,4" : undefined}
                markerEnd={`url(#arrow-${state})`}
                filter={state === "active" ? "url(#glow-cyan)" : undefined}
                opacity={state === "inactive" ? 0.4 : 1}
                className="transition-colors duration-300"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {materias.map(m => {
          const { x, y } = nodeTopLeft(m);
          const estado   = estados[m.id] || "pendiente";
          const hab      = habilitadaMap[m.id];
          const bg       = nodeBg(estado, hab);
          const border   = nodeBorder(estado, hab);
          const textCol  = nodeTextColor(estado, hab);
          const tipoConf = TIPO_CONFIG[m.tipo];
          const isBlocked = !hab && estado === "pendiente";

          return (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleClick(m.id)}
              style={{
                position:      "absolute",
                left:          x,
                top:           y,
                width:         NODE_W,
                height:        NODE_H,
                background:    bg,
                border:        `2px solid ${border}`,
                borderRadius:  12,
                padding:       "8px 12px",
                cursor:        isBlocked ? "not-allowed" : "pointer",
                display:       "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems:    "flex-start",
                zIndex:        2,
                boxShadow: estado === "aprobada"
                  ? `0 0 15px 2px rgba(34,211,238,0.2), 0 4px 12px rgba(0,0,0,0.5)`
                  : estado === "cursando"
                  ? `0 0 15px 2px rgba(239,68,68,0.25), 0 4px 12px rgba(0,0,0,0.5)`
                  : hab
                  ? `0 0 10px 1px rgba(59,130,246,0.15), 0 4px 12px rgba(0,0,0,0.5)`
                  : `0 2px 8px rgba(0,0,0,0.3)`,
                opacity: isBlocked ? 0.5 : 1,
              }}
              className="group select-none"
            >
              <div className="flex w-full justify-between items-center">
                <span style={{
                  fontSize: 8,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: tipoConf.border,
                  background: `${tipoConf.color}20`,
                  border: `1px solid ${tipoConf.border}40`,
                  borderRadius: 4,
                  padding: "1px 4px",
                }}>
                  {tipoConf.label}
                </span>

                <span className="flex items-center gap-1">
                  {estado === "aprobada" && <Check size={12} strokeWidth={4} className="text-cyan-400" />}
                  {estado === "cursando" && <BookOpen size={12} className="text-red-500" />}
                  {estado === "pendiente" && hab && <Clock size={10} className="text-blue-400" />}
                </span>
              </div>

              <span className="text-[11px] font-bold text-left leading-tight line-clamp-2" style={{ color: textCol }}>
                {m.nombre}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-4 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 pointer-events-none">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
          <Maximize2 size={10} /> Arrastrá para navegar el mapa
        </p>
      </div>
    </div>
  );
};

export default MapaNodos;
