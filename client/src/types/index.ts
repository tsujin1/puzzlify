export interface Tile {
  id: number;
  currentPos: number;
  correctPos: number;
}

export interface GameConfig {
  _id?: string;
  imageUrl: string;
  gridSize: number;
}