import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import {
  Materia,
  EstadoMateria,
  DURACION_STYLE,
  ESTADO_STYLE,
  CONEXIONES_PLAN6,
  MATERIAS_PLAN6,
  NODE_W,
  NODE_H,
  getNodePos,
  getCanvasSize,
  getEstadoVisual,
} from "@/data/plan6Structure";
import { Check, BookOpen, Lock, Clock } from "lucide-react";

// ── Tipos ─────────────────────────────────────────────────────────────
interface MapaInteractivoProps {
  estados: Record<string, EstadoMateria>;
  onCycleEstado: (id: string) => void;
  saving: boolean;
  porcentaje: number;
}

// ── Tooltip ───────────────────────────────────────────────────────────
interface TooltipState {
  materiaId: string | null;
  x: number;
  y: number;
}

// ── Nodo individual ───────────────────────────────────────────────────
interface NodoProps {
  materia: Materia;
  estadoVisual: ReturnType<typeof getEstadoVisual>;
  onClick: () => void;
  onHover: (id: string | null, x: number, y: number) => void;
}

const Nodo: React.FC<NodoProps> = React.memo(({ materia, estadoVisual, onClick, onHover }) => {
  const durStyle   = DURACION_STYLE[materia.duracion];
  const estadoConf = ESTADO_STYLE[estadoVisual];
  const isBlocked  = estadoVisual === "bloqueada";
  const isAprobada = estadoVisual === "aprobada";
  const isCursando = estadoVisual === "cursando";
  const isHabilit  = estadoVisual === "habilitada";

  return (
    <button
      id={`node-${materia.id}`}
      onClick={!isBlocked ? onClick : undefined}
      onMouseEnter={e => onHover(materia.id, e.clientX, e.clientY)}
      onMouseLeave={() => onHover(null, 0, 0)}
      style={{
        position:      "absolute",
        left:          getNodePos(materia).x,
        top:           getNodePos(materia).y,
        width:         NODE_W,
        height:        NODE_H,
        background:    estadoConf.bgColor,
        border:        `2px solid ${estadoVisual === "pendiente" || estadoVisual === "bloqueada" ? durStyle.borderColor : estadoConf.borderColor}`,
        borderRadius:  10,
        padding:       "6px 9px",
        cursor:        isBlocked ? "not-allowed" : "pointer",
        display:       "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems:    "flex-start",
        zIndex:        2,
        opacity:       isBlocked ? 0.5 : 1,
        transition:    "border-color 0.35s, box-shadow 0.35s, opacity 0.35s, transform 0.2s",
        boxShadow: isAprobada
          ? `0 0 16px 3px ${ESTADO_STYLE.aprobada.glowColor}, 0 4px 12px rgba(0,0,0,0.5)`
          : isCursando
          ? `0 0 14px 3px ${ESTADO_STYLE.cursando.glowColor}, 0 4px 12px rgba(0,0,0,0.5)`
          : isHabilit
          ? `0 0 10px 2px ${ESTADO_STYLE.habilitada.glowColor}, 0 4px 12px rgba(0,0,0,0.4)`
          : "0 2px 8px rgba(0,0,0,0.35)",
        transform: isAprobada ? "translateY(-2px)" : "none",
      }}
    >
      {/* Fila superior: duración + icono estado */}
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize:         8.5,
          fontWeight:       700,
          letterSpacing:    "0.08em",
          textTransform:    "uppercase",
          color:            durStyle.accentColor,
          background:       `${durStyle.bgColor}cc`,
          border:           `1px solid ${durStyle.borderColor}66`,
          borderRadius:     4,
          padding:          "1px 5px",
          whiteSpace:       "nowrap",
        }}>
          {durStyle.label}
        </span>

        {/* Icono de estado */}
        <span style={{ flexShrink: 0, marginLeft: 4 }}>
          {isAprobada && <Check size={13} color="#22d3ee" strokeWidth={3} />}
          {isCursando && <BookOpen size={13} color="#ef4444" />}
          {isHabilit  && <Clock size={11} color="#3b82f6" />}
          {isBlocked  && <Lock size={11} color="#475569" />}
        </span>
      </div>

      {/* Nombre */}
      <span style={{
        fontSize:             11,
        fontWeight:           600,
        color:                estadoConf.textColor,
        lineHeight:           1.25,
        textAlign:            "left",
        overflow:             "hidden",
        display:              "-webkit-box",
        WebkitLineClamp:      2,
        WebkitBoxOrient:      "vertical",
        width:                "100%",
        transition:           "color 0.3s",
      }}>
        {materia.nombreCorto}
      </span>

      {/* Código */}
      <span style={{
        fontSize:   8,
        fontWeight: 500,
        color:      isBlocked ? "#2d3748" : "#334155",
        fontFamily: "monospace",
        letterSpacing: "0.05em",
      }}>
        #{materia.id}
      </span>
    </button>
  );
});

Nodo.displayName = "Nodo";

// ── Tooltip popup ─────────────────────────────────────────────────────
const TooltipPopup: React.FC<{
  materia: Materia | undefined;
  estadoVisual: string;
  x: number;
  y: number;
}> = ({ materia, estadoVisual, x, y }) => {
  if (!materia) return null;

  const prereqs = materia.requisitos.map(r => {
    const m = MATERIAS_PLAN6.find(m => m.id === r.id);
    return m ? `${m.nombreCorto} [${r.tipo}]` : r.id;
  });

  return (
    <div
      style={{
        position:   "fixed",
        left:       x + 14,
        top:        y - 8,
        zIndex:     9999,
        background: "hsl(222 47% 10%)",
        border:     "1px solid hsl(222 47% 22%)",
        borderRadius: 10,
        padding:    "10px 14px",
        maxWidth:   260,
        boxShadow:  "0 8px 32px rgba(0,0,0,0.6)",
        pointerEvents: "none",
      }}
    >
      <p style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 12, marginBottom: 4 }}>
        {materia.nombre}
      </p>
      <p style={{ color: "#94a3b8", fontSize: 10, marginBottom: 6 }}>
        Código: #{materia.id} · {materia.horas}h · {DURACION_STYLE[materia.duracion].label}
      </p>
      <p style={{ color:
        estadoVisual === "aprobada"  ? "#22d3ee" :
        estadoVisual === "cursando"  ? "#ef4444" :
        estadoVisual === "habilitada"? "#3b82f6" : "#64748b",
        fontSize: 10, fontWeight: 700, marginBottom: prereqs.length ? 6 : 0,
      }}>
        Estado: {estadoVisual.toUpperCase()}
      </p>
      {prereqs.length > 0 && (
        <>
          <p style={{ color: "#64748b", fontSize: 9, fontWeight: 700, marginBottom: 3, letterSpacing: "0.07em" }}>
            CORRELATIVAS REQUERIDAS:
          </p>
          {prereqs.map(p => (
            <p key={p} style={{ color: "#94a3b8", fontSize: 10, paddingLeft: 8 }}>• {p}</p>
          ))}
        </>
      )}
      {materia.requisitosEspeciales?.primerAnioCompleto && (
        <p style={{ color: "#f97316", fontSize: 10, marginTop: 4 }}>⚠ Requiere 1er Año completo aprobado</p>
      )}
      {materia.requisitosEspeciales?.porcentajeCarrera && (
        <p style={{ color: "#f97316", fontSize: 10, marginTop: 4 }}>
          ⚠ Requiere {materia.requisitosEspeciales.porcentajeCarrera}% de la carrera aprobado
        </p>
      )}
      <p style={{ color: "#475569", fontSize: 9, marginTop: 6, borderTop: "1px solid #1e293b", paddingTop: 5 }}>
        Click para ciclar: Pendiente → Cursando → Aprobada
      </p>
    </div>
  );
};

// ── Leyenda ───────────────────────────────────────────────────────────
const Leyenda: React.FC = () => (
  <div style={{
    display:        "flex",
    flexWrap:       "wrap",
    gap:            "10px 20px",
    alignItems:     "center",
    padding:        "10px 16px",
    background:     "hsl(222 47% 8%)",
    border:         "1px solid hsl(222 47% 16%)",
    borderRadius:   10,
    marginBottom:   16,
  }}>
    {/* Duración */}
    {(Object.entries(DURACION_STYLE) as [string, typeof DURACION_STYLE[keyof typeof DURACION_STYLE]][]).map(([, cfg]) => (
      <div key={cfg.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{
          width: 12, height: 12, borderRadius: 3,
          background: cfg.bgColor,
          border: `2px solid ${cfg.borderColor}`,
          display: "inline-block",
        }} />
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{cfg.label}</span>
      </div>
    ))}
    <div style={{ width: 1, height: 16, background: "#1e293b" }} />
    {/* Estado */}
    {([
      { label: "Aprobada",  color: ESTADO_STYLE.aprobada.borderColor  },
      { label: "Cursando",  color: ESTADO_STYLE.cursando.borderColor  },
      { label: "Habilitada",color: ESTADO_STYLE.habilitada.borderColor },
      { label: "Bloqueada", color: ESTADO_STYLE.bloqueada.borderColor },
    ]).map(({ label, color }) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{
          width: 10, height: 10, borderRadius: 2,
          border: `2px solid ${color}`,
          display: "inline-block",
        }} />
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{label}</span>
      </div>
    ))}
  </div>
);

// ── Inner canvas (necesita estar dentro de Xwrapper) ─────────────────
const CanvasInner: React.FC<{
  estados: Record<string, EstadoMateria>;
  estadosVisuales: Record<string, ReturnType<typeof getEstadoVisual>>;
  onCycleEstado: (id: string) => void;
  canvasW: number;
  canvasH: number;
  onHover: (id: string | null, x: number, y: number) => void;
}> = ({ estados, estadosVisuales, onCycleEstado, canvasW, canvasH, onHover }) => {
  const updateXarrow = useXarrow();

  return (
    <div
      style={{ position: "relative", width: canvasW, height: canvasH }}
      onScroll={updateXarrow}
    >
      {/* Year dividers */}
      {[1, 2, 3, 4, 5].map(anio => {
        const mats = MATERIAS_PLAN6.filter(m => m.anio === anio);
        if (!mats.length) return null;
        const minRow = Math.min(...mats.map(m => m.row));
        const yPos = 48 + minRow * (NODE_H + 72) - 28;
        return (
          <div key={anio} style={{
            position:    "absolute",
            top:         yPos,
            left:        0,
            width:       "100%",
            borderTop:   "1px solid hsl(222 47% 16%)",
            paddingTop:  4,
            paddingLeft: 8,
            zIndex:      0,
            pointerEvents: "none",
          }}>
            <span style={{
              fontSize:   9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color:      "#1e40af",
              textTransform: "uppercase",
            }}>{anio}º Año</span>
          </div>
        );
      })}

      {/* Arrows */}
      {CONEXIONES_PLAN6.map(c => {
        const fromVis = estadosVisuales[c.fromId] || "bloqueada";
        const toVis   = estadosVisuales[c.toId]   || "bloqueada";
        const fromAprobada = fromVis === "aprobada";
        const toHabilitada = toVis === "habilitada" || toVis === "cursando" || toVis === "aprobada";

        const color = fromAprobada && toHabilitada
          ? "#ef4444"      // rojo puro — camino iluminado
          : fromAprobada
          ? "#1d4ed8"      // azul — desbloqueado
          : "hsl(222 47% 18%)"; // muted

        const dashness = !fromAprobada
          ? { strokeLen: 6, nonStrokeLen: 5, animation: 0 }
          : undefined;

        return (
          <Xarrow
            key={`${c.fromId}-${c.toId}`}
            start={`node-${c.fromId}`}
            end={`node-${c.toId}`}
            color={color}
            strokeWidth={fromAprobada && toHabilitada ? 2.5 : 1.5}
            headSize={fromAprobada && toHabilitada ? 7 : 5}
            curveness={0.4}
            dashness={dashness}
            zIndex={1}
            passProps={{
              style: { opacity: fromAprobada ? 1 : 0.4, transition: "opacity 0.35s" },
            }}
            startAnchor="bottom"
            endAnchor="top"
            animateDrawing={false}
          />
        );
      })}

      {/* Nodes */}
      {MATERIAS_PLAN6.map(m => (
        <Nodo
          key={m.id}
          materia={m}
          estadoVisual={estadosVisuales[m.id] || "bloqueada"}
          onClick={() => onCycleEstado(m.id)}
          onHover={onHover}
        />
      ))}
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────
export const MapaInteractivo: React.FC<MapaInteractivoProps> = ({
  estados,
  onCycleEstado,
  saving,
  porcentaje,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale]     = useState(1);
  const [tooltip, setTooltip] = useState<TooltipState>({ materiaId: null, x: 0, y: 0 });
  const { width: canvasW, height: canvasH } = getCanvasSize();

  // Responsive scaling
  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      setScale(cw < canvasW ? cw / canvasW : 1);
    };
    update();
    const obs = new ResizeObserver(update);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [canvasW]);

  // Pre-compute visual states for ALL materias
  const estadosVisuales = useMemo(() => {
    const result: Record<string, ReturnType<typeof getEstadoVisual>> = {};
    MATERIAS_PLAN6.forEach(m => {
      result[m.id] = getEstadoVisual(m, estados);
    });
    return result;
  }, [estados]);

  const hoveredMateria = useMemo(
    () => MATERIAS_PLAN6.find(m => m.id === tooltip.materiaId),
    [tooltip.materiaId]
  );

  const handleHover = useCallback((id: string | null, x: number, y: number) => {
    setTooltip({ materiaId: id, x, y });
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* Leyenda */}
      <Leyenda />

      {/* Saving indicator */}
      {saving && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          color: "#3b82f6", fontSize: 11, marginBottom: 8,
        }}>
          <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
          Guardando progreso…
        </div>
      )}

      {/* Canvas wrapper */}
      <div ref={containerRef} style={{ width: "100%", overflowX: "auto" }}>
        <div style={{
          width:           canvasW,
          height:          canvasH * scale,
          transformOrigin: "top left",
          transform:       `scale(${scale})`,
          position:        "relative",
        }}>
          <Xwrapper>
            <CanvasInner
              estados={estados}
              estadosVisuales={estadosVisuales}
              onCycleEstado={onCycleEstado}
              canvasW={canvasW}
              canvasH={canvasH}
              onHover={handleHover}
            />
          </Xwrapper>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.materiaId && hoveredMateria && (
        <TooltipPopup
          materia={hoveredMateria}
          estadoVisual={estadosVisuales[tooltip.materiaId] || "bloqueada"}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}
    </div>
  );
};

export default MapaInteractivo;
