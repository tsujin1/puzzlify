import { API_URL } from '../../utils/apiConfig';

export interface GameData {
  _id: string;
  imageUrl: string;
  gridSize: number;
}

export const getGameById = async (id: string): Promise<GameData> => {
  try {
    const response = await fetch(`${API_URL}/game/${id}`);

    if (!response.ok) {
      throw new Error('Game not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Service Error [getGameById]:', error);
    throw error;
  }
};