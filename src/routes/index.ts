import { Router } from 'express';

import storage from '../storage/data';
import { IShowsResponse } from '../types';

const router = Router();

router.get('/shows/:pageId?', (req, res) => {
	storage.getShows(req.params.pageId)
		.then((shows: IShowsResponse) => {
			res.json(shows);
		});
});

export default router;
