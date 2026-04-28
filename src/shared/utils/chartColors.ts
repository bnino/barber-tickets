const COLORS = [
  "#4f46e5", // indigo-600 — principal
  "#10b981", // emerald-500 — éxito
  "#f59e0b", // amber-400 — advertencia
  "#ef4444", // red-500 — peligro
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#94a3b8", // slate-400
];

export function getColorByIndex(index: number) {
    return COLORS[index % COLORS.length];
}