import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { createGame, getGameById } from '../controllers/gameController';

const router = Router();

router.post('/game', upload.single('image'), createGame);
router.get('/game/:id', getGameById);

export default router;