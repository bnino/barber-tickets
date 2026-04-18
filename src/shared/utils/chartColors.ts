const COLORS = [
  "#6366F1", // Indigo suave
  "#10B981", // Verde pastel
  "#F59E0B", // Amarillo cálido suave
  "#EF4444", // Rojo moderado
  "#06B6D4", // Cyan suave
  "#8B5CF6", // Violeta tenue
  "#94A3B8", // Gris elegante
];

export function getColorByIndex(index: number) {
    return COLORS[index % COLORS.length];
}