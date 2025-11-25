import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  imageUrl: string;
  gridSize: number;
  createdAt: Date;
}

const GameSchema = new Schema<IGame>({
  imageUrl: { type: String, required: true },
  gridSize: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGame>('Game', GameSchema);