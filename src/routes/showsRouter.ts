import { Router } from 'express';

import { showsController } from '../controllers';

const router = Router();

router.get('/:pageId?', showsController.showsPage);

export default router;