import { Request, Response, NextFunction } from 'express';
import { CustomError } from './errorHandler';
import { MIN_GRID_SIZE, MAX_GRID_SIZE } from '@shared/constants';

/**
 * Validate grid size parameter
 */
export const validateGridSize = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const gridSize = Number(req.body.gridSize);

  if (!gridSize || isNaN(gridSize)) {
    throw new CustomError('Grid size is required and must be a number', 400);
  }

  if (gridSize < MIN_GRID_SIZE || gridSize > MAX_GRID_SIZE) {
    throw new CustomError(
      `Grid size must be between ${MIN_GRID_SIZE} and ${MAX_GRID_SIZE}`,
      400
    );
  }

  next();
};

/**
 * Validate file upload
 */
export const validateFileUpload = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    throw new CustomError('No image file uploaded', 400);
  }

  next();
};

