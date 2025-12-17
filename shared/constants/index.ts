// File upload constraints
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Allowed file types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Grid size constraints
export const MIN_GRID_SIZE = 3;
export const MAX_GRID_SIZE = 6;
export const DEFAULT_GRID_SIZE = 3;

// API endpoints
export const API_ENDPOINTS = {
  GAME: '/api/game',
  HEALTH: '/api/health',
} as const;



