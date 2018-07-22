import storage from '../storage/data';
import { IShowsResponse } from '../types';

const showsPage = (req, res) => {
	storage.getShows(req.params.pageId)
		.then((shows: IShowsResponse) => {
			res.json(shows);
		});
};

export default {
    showsPage
};