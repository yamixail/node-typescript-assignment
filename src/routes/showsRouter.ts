import { Router } from 'express';

import showsController from '../controllers/showsController';

const router = Router();

router.get('/:pageId?', showsController.showsPage);

export default router;
