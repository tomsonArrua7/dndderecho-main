import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MateriaNode, Conexion, EstadoMateria, PlanData, TIPO_CONFIG } from "@/data/planEstudiosData";
import { cn } from "@/lib/utils";
import { Check, BookOpen, Clock } from "lucide-react";

// ── Layout constants ──────────────────────────────────────────────────
const NODE_W = 160;
const NODE_H = 72;
const GAP_X  = 52;
const GAP_Y  = 64;
const PAD    = 24;

// Compute canvas size from data
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

// ── Arrow path ─────────────────────────────────────────────────────────
function buildArrowPath(from: MateriaNode, to: MateriaNode): string {
  const f = nodeCenter(from);
  const t = nodeCenter(to);

  // Exit bottom of from, enter top of to
  const fx = f.x;
  const fy = f.y + NODE_H / 2;
  const tx = t.x;
  const ty = t.y - NODE_H / 2;

  const cy1 = fy + (ty - fy) * 0.4;
  const cy2 = ty - (ty - fy) * 0.4;

  return `M ${fx} ${fy} C ${fx} ${cy1}, ${tx} ${cy2}, ${tx} ${ty}`;
}

// ── Arrow colour ───────────────────────────────────────────────────────
type ArrowState = "inactive" | "unlocked" | "active";

function arrowColour(state: ArrowState): string {
  switch (state) {
    case "active":   return "#22d3ee"; // cyan electric
    case "unlocked": return "#1d4ed8"; // blue
    default:         return "hsl(222 47% 22%)"; // dark muted
  }
}

// ── Node colours ───────────────────────────────────────────────────────
function nodeBg(estado: EstadoMateria, habilitada: boolean): string {
  if (estado === "aprobada")  return "#0f2c5e"; // deep navy approved
  if (estado === "cursando")  return "#1a0a0a"; // deep dark red tint
  if (habilitada)             return "#0c1f44"; // electric blue tint
  return "#0c1627";                              // blocked dark
}

function nodeBorder(estado: EstadoMateria, habilitada: boolean): string {
  if (estado === "aprobada")  return "#22d3ee";  // cyan
  if (estado === "cursando")  return "#ef4444";  // pure red
  if (habilitada)             return "#3b82f6";  // blue electric
  return "hsl(222 47% 22%)";                     // muted
}

function nodeTextColor(estado: EstadoMateria, habilitada: boolean): string {
  if (estado === "aprobada")  return "#7dd3fc";
  if (estado === "cursando")  return "#fca5a5";
  if (habilitada)             return "#e0f2fe";
  return "hsl(215 20% 45%)";
}

// ── Props ──────────────────────────────────────────────────────────────
interface MapaNodosProps {
  plan: PlanData;
  estados: Record<string, EstadoMateria>;
  onCycleEstado: (id: string) => void;
  saving: boolean;
}

// ── Component ─────────────────────────────────────────────────────────
export const MapaNodos: React.FC<MapaNodosProps> = ({ plan, estados, onCycleEstado, saving }) => {
  const { materias, conexiones } = plan;
  const { width, height } = getGridSize(materias);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Responsive: scale down on small screens
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

  // Pre-compute habilitada for each materia
  const habilitadaMap = useCallback((): Record<string, boolean> => {
    const result: Record<string, boolean> = {};
    materias.forEach(m => {
      result[m.id] = m.prereqs.every(pid => estados[pid] === "aprobada");
    });
    return result;
  }, [materias, estados])();

  // Arrow states
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

  // Cycle: pendiente → cursando → aprobada → pendiente
  const handleClick = (id: string) => {
    if (saving) return;
    onCycleEstado(id);
  };

  const anioLabels = [...new Set(materias.map(m => m.anio))].sort();

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <div
        style={{
          width,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          height: height * scale,
          position: "relative",
        }}
      >
        {/* Year label columns */}
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
                borderTop: "1px solid hsl(222 47% 18%)",
                paddingTop: 4,
                paddingLeft: 4,
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "hsl(215 20% 45%)",
                textTransform: "uppercase",
              }}>
                {anio}º Año
              </span>
            </div>
          );
        })}

        {/* SVG for arrows */}
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
              <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="1.5s" repeatCount="indefinite" />
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
                style={{ transition: "stroke 0.4s, stroke-width 0.4s, opacity 0.4s" }}
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
            <button
              key={m.id}
              onClick={() => handleClick(m.id)}
              title={
                estado === "aprobada"  ? `${m.nombre} — Aprobada ✓` :
                estado === "cursando"  ? `${m.nombre} — Cursando` :
                hab                    ? `${m.nombre} — Habilitada. Click para marcar cursando.` :
                                         `${m.nombre} — Bloqueada (faltan previas)`
              }
              style={{
                position:      "absolute",
                left:          x,
                top:           y,
                width:         NODE_W,
                height:        NODE_H,
                background:    bg,
                border:        `2px solid ${border}`,
                borderRadius:  8,
                padding:       "6px 10px",
                cursor:        isBlocked ? "not-allowed" : "pointer",
                display:       "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems:    "flex-start",
                zIndex:        2,
                transition:    "border-color 0.35s, box-shadow 0.35s, transform 0.2s",
                boxShadow: estado === "aprobada"
                  ? `0 0 12px 2px rgba(34,211,238,0.35), 0 4px 16px rgba(0,0,0,0.6)`
                  : estado === "cursando"
                  ? `0 0 12px 2px rgba(239,68,68,0.4), 0 4px 16px rgba(0,0,0,0.6)`
                  : hab
                  ? `0 0 8px 1px rgba(59,130,246,0.25), 0 4px 16px rgba(0,0,0,0.6)`
                  : `0 2px 8px rgba(0,0,0,0.4)`,
                transform: estado === "aprobada" ? "translateY(-1px)" : "none",
                opacity: isBlocked ? 0.6 : 1,
              }}
              className="group"
            >
              {/* Top row: tipo chip + status icon */}
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: tipoConf.border,
                  background: `${tipoConf.color}33`,
                  border: `1px solid ${tipoConf.border}55`,
                  borderRadius: 4,
                  padding: "1px 5px",
                }}>
                  {tipoConf.label}
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  {estado === "aprobada" && (
                    <span style={{ color: "#22d3ee", display: "flex" }}>
                      <Check size={13} strokeWidth={3} />
                    </span>
                  )}
                  {estado === "cursando" && (
                    <span style={{ color: "#ef4444", display: "flex" }}>
                      <BookOpen size={13} />
                    </span>
                  )}
                  {estado === "pendiente" && hab && (
                    <span style={{ color: "#3b82f6", display: "flex" }}>
                      <Clock size={11} />
                    </span>
                  )}
                </span>
              </div>

              {/* Subject name */}
              <span style={{
                fontSize:   11,
                fontWeight: 600,
                color:      textCol,
                lineHeight: 1.25,
                textAlign:  "left",
                maxWidth:   "100%",
                overflow:   "hidden",
                display:    "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                transition: "color 0.3s",
              }}>
                {m.nombre}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapaNodos;
