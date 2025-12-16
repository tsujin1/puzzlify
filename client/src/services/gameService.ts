import { API_URL } from '../utils/apiConfig';
import type {
  GameCreationResponse,
  GameData,
} from '@shared/types/game';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, ALLOWED_IMAGE_TYPES } from '@shared/constants';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

/**
 * Create a new game from an uploaded image
 */
export const createGame = async (
  file: File,
  gridSize: number
): Promise<GameCreationResponse> => {
  // Client-side validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `Image is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`
    );
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type. Please upload a valid image (${ALLOWED_IMAGE_TYPES.join(', ')}).`
    );
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

      const errorData: ApiResponse<never> = await response.json().catch(() => ({
        success: false,
        error: 'Unknown error',
      }));
      throw new Error(errorData.error || `Upload failed (${response.status})`);
    }

    const result: ApiResponse<GameCreationResponse> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Service Error [createGame]:', error);
    throw error;
  }
};

/**
 * Get a game by ID
 */
export const getGameById = async (id: string): Promise<GameData> => {
  try {
    const response = await fetch(`${API_URL}/game/${id}`);

    if (!response.ok) {
      const errorData: ApiResponse<never> = await response.json().catch(() => ({
        success: false,
        error: 'Game not found',
      }));
      throw new Error(errorData.error || 'Game not found');
    }

    const result: ApiResponse<GameData> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Service Error [getGameById]:', error);
    throw error;
  }
};

