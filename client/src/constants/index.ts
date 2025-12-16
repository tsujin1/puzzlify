export const GRID_SIZES = [3, 4, 5, 6] as const;

export type GridSize = (typeof GRID_SIZES)[number];

