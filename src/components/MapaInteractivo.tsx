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
import { Check, Lock, Clock } from "lucide-react";

// ── Props ─────────────────────────────────────────────────────────────
interface MapaInteractivoProps {
  estados: Record<string, EstadoMateria>;
  onToggle: (id: string) => void; // aprobada ↔ pendiente
  saving: boolean;
  porcentaje: number;
}

// ── Tooltip state ─────────────────────────────────────────────────────
interface TooltipState { materiaId: string | null; x: number; y: number; }

// ── Check button ──────────────────────────────────────────────────────
// Círculo que actúa como checkbox: verde con ✓ si aprobada, gris si no
interface CheckBtnProps {
  aprobada: boolean;
  habilitada: boolean;
  bloqueada: boolean;
  onClick: (e: React.MouseEvent) => void;
}
const CheckBtn: React.FC<CheckBtnProps> = ({ aprobada, habilitada, bloqueada, onClick }) => (
  <button
    onClick={onClick}
    disabled={bloqueada}
    title={
      bloqueada   ? "Bloqueada — completá las correlativas primero" :
      aprobada    ? "Marcar como pendiente" :
                    "Marcar como aprobada"
    }
    style={{
      flexShrink:      0,
      width:           22,
      height:          22,
      borderRadius:    "50%",
      border:          `2px solid ${aprobada ? "#22d3ee" : habilitada ? "#3b82f6" : "#334155"}`,
      background:      aprobada ? "rgba(34,211,238,0.15)" : "transparent",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      cursor:          bloqueada ? "not-allowed" : "pointer",
      transition:      "border-color 0.25s, background 0.25s, box-shadow 0.25s",
      boxShadow:       aprobada ? "0 0 8px rgba(34,211,238,0.5)" : "none",
    }}
  >
    {aprobada && <Check size={12} color="#22d3ee" strokeWidth={3} />}
    {!aprobada && habilitada && (
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
    )}
  </button>
);

// ── Nodo individual ───────────────────────────────────────────────────
interface NodoProps {
  materia: Materia;
  estadoVisual: ReturnType<typeof getEstadoVisual>;
  onToggle: () => void;
  onHover: (id: string | null, x: number, y: number) => void;
}

const Nodo: React.FC<NodoProps> = React.memo(({ materia, estadoVisual, onToggle, onHover }) => {
  const durStyle    = DURACION_STYLE[materia.duracion];
  const estadoConf  = ESTADO_STYLE[estadoVisual];
  const isAprobada  = estadoVisual === "aprobada";
  const isHabilit   = estadoVisual === "habilitada";
  const isBlocked   = estadoVisual === "bloqueada";

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isBlocked) onToggle();
  };

  return (
    <div
      id={`node-${materia.id}`}
      onMouseEnter={e => onHover(materia.id, e.clientX, e.clientY)}
      onMouseLeave={() => onHover(null, 0, 0)}
      style={{
        position:       "absolute",
        left:           getNodePos(materia).x,
        top:            getNodePos(materia).y,
        width:          NODE_W,
        height:         NODE_H,
        background:     estadoConf.bgColor,
        border:         `2px solid ${isAprobada ? ESTADO_STYLE.aprobada.borderColor
                          : isHabilit ? ESTADO_STYLE.habilitada.borderColor
                          : durStyle.borderColor}`,
        borderRadius:   10,
        padding:        "6px 8px 6px 10px",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        zIndex:         2,
        opacity:        isBlocked ? 0.5 : 1,
        transition:     "border-color 0.3s, box-shadow 0.3s, opacity 0.3s, transform 0.2s",
        boxShadow: isAprobada
          ? `0 0 18px 3px ${ESTADO_STYLE.aprobada.glowColor}, 0 4px 12px rgba(0,0,0,0.5)`
          : isHabilit
          ? `0 0 10px 2px ${ESTADO_STYLE.habilitada.glowColor}, 0 4px 12px rgba(0,0,0,0.4)`
          : "0 2px 8px rgba(0,0,0,0.35)",
        transform:    isAprobada ? "translateY(-1px)" : "none",
        userSelect:   "none",
      }}
    >
      {/* Fila superior: chip duración + check button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
        <span style={{
          fontSize:      8,
          fontWeight:    700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color:         durStyle.accentColor,
          background:    `${durStyle.bgColor}cc`,
          border:        `1px solid ${durStyle.borderColor}55`,
          borderRadius:  4,
          padding:       "1px 4px",
          whiteSpace:    "nowrap",
          flexShrink:    0,
        }}>
          {durStyle.label}
        </span>

        {/* Ícono de bloqueo o check button */}
        {isBlocked
          ? <Lock size={12} color="#334155" style={{ flexShrink: 0 }} />
          : <CheckBtn
              aprobada={isAprobada}
              habilitada={isHabilit}
              bloqueada={false}
              onClick={handleCheckClick}
            />
        }
      </div>

      {/* Nombre de la materia */}
      <span style={{
        fontSize:            11,
        fontWeight:          isAprobada ? 700 : 600,
        color:               estadoConf.textColor,
        lineHeight:          1.25,
        overflow:            "hidden",
        display:             "-webkit-box",
        WebkitLineClamp:     2,
        WebkitBoxOrient:     "vertical",
        textDecoration:      isAprobada ? "none" : "none",
        transition:          "color 0.3s",
        flexGrow:            1,
      }}>
        {materia.nombreCorto}
      </span>

      {/* Código + icono estado */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize:      8,
          color:         isBlocked ? "#1e293b" : "#334155",
          fontFamily:    "monospace",
          letterSpacing: "0.04em",
        }}>
          #{materia.id}
        </span>
        {isHabilit && !isAprobada && (
          <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Clock size={9} color="#3b82f6" />
            <span style={{ fontSize: 8, color: "#3b82f6", fontWeight: 700 }}>Habilitada</span>
          </span>
        )}
      </div>
    </div>
  );
});
Nodo.displayName = "Nodo";

// ── Tooltip ───────────────────────────────────────────────────────────
const TooltipPopup: React.FC<{
  materia: Materia;
  estadoVisual: string;
  x: number;
  y: number;
}> = ({ materia, estadoVisual, x, y }) => {
  const prereqs = materia.requisitos.map(r => {
    const m = MATERIAS_PLAN6.find(m => m.id === r.id);
    return m?.nombreCorto ?? r.id;
  });

  const estadoColor =
    estadoVisual === "aprobada"   ? "#22d3ee" :
    estadoVisual === "habilitada" ? "#3b82f6"  : "#64748b";

  return (
    <div style={{
      position:      "fixed",
      left:          Math.min(x + 16, window.innerWidth - 280),
      top:           Math.max(y - 12, 8),
      zIndex:        9999,
      background:    "hsl(222 47% 9%)",
      border:        "1px solid hsl(222 47% 22%)",
      borderRadius:  12,
      padding:       "12px 16px",
      maxWidth:      268,
      boxShadow:     "0 12px 40px rgba(0,0,0,0.7)",
      pointerEvents: "none",
    }}>
      <p style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 12, marginBottom: 3 }}>
        {materia.nombre}
      </p>
      <p style={{ color: "#64748b", fontSize: 10, marginBottom: 8 }}>
        #{materia.id} · {materia.horas}h · {DURACION_STYLE[materia.duracion].label}
      </p>

      <p style={{ color: estadoColor, fontSize: 10, fontWeight: 700, marginBottom: prereqs.length ? 8 : 0 }}>
        Estado: {estadoVisual === "habilitada" ? "✅ Habilitada para cursar" :
                 estadoVisual === "aprobada"   ? "✅ Aprobada" :
                 estadoVisual === "bloqueada"  ? "🔒 Bloqueada" : "⏳ Pendiente"}
      </p>

      {prereqs.length > 0 && (
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 8 }}>
          <p style={{ color: "#475569", fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", marginBottom: 4 }}>
            CORRELATIVAS REQUERIDAS
          </p>
          {prereqs.map(p => (
            <p key={p} style={{ color: "#94a3b8", fontSize: 10, paddingLeft: 6, marginBottom: 2 }}>
              • {p}
            </p>
          ))}
        </div>
      )}

      {materia.requisitosEspeciales?.primerAnioCompleto && (
        <p style={{ color: "#f97316", fontSize: 10, marginTop: 6 }}>
          ⚠ Requiere 1º Año completo aprobado
        </p>
      )}
      {materia.requisitosEspeciales?.porcentajeCarrera && (
        <p style={{ color: "#f97316", fontSize: 10, marginTop: 4 }}>
          ⚠ Requiere {materia.requisitosEspeciales.porcentajeCarrera}% de la carrera aprobado
        </p>
      )}

      {estadoVisual !== "bloqueada" && (
        <p style={{ color: "#334155", fontSize: 9, marginTop: 8, borderTop: "1px solid #1e293b", paddingTop: 6 }}>
          Hacé click en el ✓ para marcar como aprobada
        </p>
      )}
    </div>
  );
};

// ── Leyenda ───────────────────────────────────────────────────────────
const Leyenda: React.FC = () => (
  <div style={{
    display:      "flex",
    flexWrap:     "wrap",
    gap:          "8px 18px",
    alignItems:   "center",
    padding:      "10px 16px",
    background:   "hsl(222 47% 8%)",
    border:       "1px solid hsl(222 47% 16%)",
    borderRadius: 10,
    marginBottom: 14,
  }}>
    {/* Tipos duración */}
    {(Object.entries(DURACION_STYLE) as [string, typeof DURACION_STYLE[keyof typeof DURACION_STYLE]][]).map(([, cfg]) => (
      <div key={cfg.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 11, height: 11, borderRadius: 3, background: cfg.bgColor, border: `2px solid ${cfg.borderColor}`, display: "inline-block" }} />
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{cfg.label}</span>
      </div>
    ))}
    <span style={{ width: 1, height: 14, background: "#1e293b" }} />
    {/* Estados */}
    {[
      { label: "Aprobada",   color: "#22d3ee", icon: "✓" },
      { label: "Habilitada", color: "#3b82f6", icon: "○" },
      { label: "Bloqueada",  color: "#1e293b", icon: "🔒" },
    ].map(({ label, color, icon }) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 11, color }}>{icon}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{label}</span>
      </div>
    ))}
    <span style={{ width: 1, height: 14, background: "#1e293b" }} />
    {/* Flechas */}
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 22, height: 2, background: "#ef4444", borderRadius: 1, display: "inline-block" }} />
      <span style={{ fontSize: 10, color: "#94a3b8" }}>Camino desbloqueado</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 22, height: 2, background: "#1e3a8a", borderRadius: 1, display: "inline-block", borderTop: "2px dashed #1e3a8a" }} />
      <span style={{ fontSize: 10, color: "#94a3b8" }}>Pendiente</span>
    </div>
  </div>
);

// ── Canvas interior (dentro de Xwrapper) ─────────────────────────────
const CanvasInner: React.FC<{
  estados: Record<string, EstadoMateria>;
  estadosVisuales: Record<string, ReturnType<typeof getEstadoVisual>>;
  onToggle: (id: string) => void;
  canvasW: number;
  canvasH: number;
  onHover: (id: string | null, x: number, y: number) => void;
}> = ({ estados, estadosVisuales, onToggle, canvasW, canvasH, onHover }) => {
  const updateXarrow = useXarrow();

  return (
    <div
      style={{ position: "relative", width: canvasW, height: canvasH }}
      onScroll={updateXarrow}
    >
      {/* Divisores de año */}
      {[1, 2, 3, 4, 5].map(anio => {
        const mats = MATERIAS_PLAN6.filter(m => m.anio === anio);
        if (!mats.length) return null;
        const minRow = Math.min(...mats.map(m => m.row));
        const yPos   = 48 + minRow * (NODE_H + 72) - 26;
        return (
          <div key={anio} style={{
            position:      "absolute",
            top:           yPos,
            left:          0,
            width:         "100%",
            borderTop:     "1px solid hsl(222 47% 14%)",
            paddingTop:    4,
            paddingLeft:   6,
            zIndex:        0,
            pointerEvents: "none",
          }}>
            <span style={{
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: "0.12em",
              color:         "#1e3a8a",
              textTransform: "uppercase",
            }}>{anio}º Año</span>
          </div>
        );
      })}

      {/* Flechas con Xarrow */}
      {CONEXIONES_PLAN6.map(c => {
        const fromVis = estadosVisuales[c.fromId] || "bloqueada";
        const toVis   = estadosVisuales[c.toId]   || "bloqueada";
        const fromAprobada = fromVis === "aprobada";
        const toActiva = toVis === "habilitada" || toVis === "aprobada";

        // Flecha roja = origen aprobado y destino habilitado/aprobado
        const color = fromAprobada && toActiva ? "#ef4444"
                    : fromAprobada              ? "#1d4ed8"
                    :                            "#1e293b";
        const active = fromAprobada && toActiva;

        return (
          <Xarrow
            key={`${c.fromId}-${c.toId}`}
            start={`node-${c.fromId}`}
            end={`node-${c.toId}`}
            color={color}
            strokeWidth={active ? 2.5 : 1.5}
            headSize={active ? 7 : 5}
            curveness={0.4}
            dashness={!fromAprobada ? { strokeLen: 6, nonStrokeLen: 5, animation: 0 } : undefined}
            zIndex={1}
            startAnchor="bottom"
            endAnchor="top"
            animateDrawing={false}
            passProps={{
              style: {
                opacity:    fromAprobada ? 1 : 0.35,
                transition: "opacity 0.35s",
                filter:     active ? "drop-shadow(0 0 3px #ef444488)" : "none",
              },
            }}
          />
        );
      })}

      {/* Nodos */}
      {MATERIAS_PLAN6.map(m => (
        <Nodo
          key={m.id}
          materia={m}
          estadoVisual={estadosVisuales[m.id] || "bloqueada"}
          onToggle={() => onToggle(m.id)}
          onHover={onHover}
        />
      ))}
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────
export const MapaInteractivo: React.FC<MapaInteractivoProps> = ({
  estados,
  onToggle,
  saving,
  porcentaje,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale]     = useState(1);
  const [tooltip, setTooltip] = useState<TooltipState>({ materiaId: null, x: 0, y: 0 });
  const { width: canvasW, height: canvasH } = getCanvasSize();

  // Escala responsiva
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

  // Estados visuales para todos los nodos
  const estadosVisuales = useMemo(() => {
    const result: Record<string, ReturnType<typeof getEstadoVisual>> = {};
    MATERIAS_PLAN6.forEach(m => { result[m.id] = getEstadoVisual(m, estados); });
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
      <Leyenda />

      {saving && (
        <p style={{ fontSize: 11, color: "#3b82f6", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
          Guardando…
        </p>
      )}

      {/* Canvas */}
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
              onToggle={onToggle}
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
