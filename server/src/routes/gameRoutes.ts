import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { validateGridSize, validateFileUpload } from '../middleware/validation';
import { createGame, getGameById } from '../controllers/gameController';

const router = Router();

router.post(
  '/game',
  upload.single('image'),
  validateFileUpload,
  validateGridSize,
  createGame
);

router.get('/game/:id', getGameById);

export default router;