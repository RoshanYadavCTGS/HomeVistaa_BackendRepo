import { Router } from 'express';
import * as interiorsController from '../controllers/interiors.controller';

const router = Router();

// All public
router.get('/', interiorsController.getInteriors);
router.get('/:id', interiorsController.getInteriorById);

export default router;
