import { API_URL } from '../../utils/apiConfig';

export interface GameCreationResponse {
  _id: string;
  imageUrl: string;
}

export const createGame = async (file: File, gridSize: number): Promise<GameCreationResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('gridSize', gridSize.toString());

  try {
    const response = await fetch(`${API_URL}/game`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Upload failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Service Error [createGame]:', error);
    throw error;
  }
};