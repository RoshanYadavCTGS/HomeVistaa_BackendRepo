import { Router } from 'express';
import * as favoritesController from '../controllers/favorites.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // All favorites routes require auth

router.get('/', favoritesController.getFavorites);
router.post('/:propertyId', favoritesController.addFavorite);
router.delete('/:propertyId', favoritesController.removeFavorite);
router.get('/:propertyId/check', favoritesController.checkFavorite);

export default router;
