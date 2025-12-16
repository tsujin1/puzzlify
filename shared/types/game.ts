export interface Game {
  _id: string;
  imageUrl: string;
  gridSize: number;
  createdAt?: Date;
}

export interface GameCreationResponse {
  _id: string;
  imageUrl: string;
  gridSize: number;
  createdAt: Date;
}

export interface GameData {
  _id: string;
  imageUrl: string;
  gridSize: number;
  createdAt?: Date;
}

