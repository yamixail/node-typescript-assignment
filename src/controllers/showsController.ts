import storage from '../storage/data';
import { IShowsResponse } from '../types';

const showsPage = (req, res) => {
	const pageId = parseInt(req.params.pageId);

	if (!Number.isInteger(pageId)) {
		return res.status(400).json({ message: 'invalid page number' });
	}

	storage.getShows(pageId)
		.then((shows: IShowsResponse) => {
			res.json(shows);
		});
};

export default {
    showsPage
};
