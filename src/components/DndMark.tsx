/**
 * DndMark — Marca icónica de DND usando el PNG oficial de la organización.
 *
 * dnd-mark.png     = D roja + D blanca → para fondos azul/oscuro
 * dnd-favicon.png  = D azul + D roja   → para fondos blancos/claros
 */

import React from "react";
import { useTheme } from "next-themes";
import dndMarkOnDark from "@/assets/dnd-mark.png";    // rojo + blanco (fondo azul)

interface DndMarkProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

/** Marca DND — se adapta automáticamente al modo claro (usando la imagen invertida) o al oscuro */
export const DndMark: React.FC<DndMarkProps> = ({
  size = 48,
  className = "",
  style,
  alt = "DND",
}) => {
  const { resolvedTheme } = useTheme();
  const imgSrc = resolvedTheme === "light" ? "/DD colores invertidos.png" : dndMarkOnDark;

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain", display: "block", ...style }}
      draggable={false}
    />
  );
};

export default DndMark;
