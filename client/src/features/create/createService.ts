import { API_URL } from '../../utils/apiConfig';

export interface GameCreationResponse {
  _id: string;
  imageUrl: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const createGame = async (file: File, gridSize: number): Promise<GameCreationResponse> => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Image is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`);
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload a valid image (JPG, PNG).');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('gridSize', gridSize.toString());

  try {
    const response = await fetch(`${API_URL}/game`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error('Image is too large for the server to process.');
      }

      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Upload failed (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Service Error [createGame]:', error);
    throw error;
  }
};