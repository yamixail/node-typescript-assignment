import { Router } from 'express';

import showsRouter from './showsRouter';

const router = Router();

router.use('/shows', showsRouter);

export default router;
