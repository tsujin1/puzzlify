import { Request, Response, NextFunction } from 'express';
import Game from '../models/Game';
import { CustomError } from '../middleware/errorHandler';
import { GameCreationResponse, GameData } from '@shared/types';

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new CustomError('No image uploaded', 400);
    }

    const base64Image = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    const gridSize = Number(req.body.gridSize);

    const newGame = await Game.create({
      imageUrl,
      gridSize,
    });

    const response: GameCreationResponse = {
      _id: newGame._id.toString(),
      imageUrl: newGame.imageUrl,
      gridSize: newGame.gridSize,
      createdAt: newGame.createdAt,
    };

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      throw new CustomError('Game not found', 404);
    }

    const response: GameData = {
      _id: game._id.toString(),
      imageUrl: game.imageUrl,
      gridSize: game.gridSize,
      createdAt: game.createdAt,
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};