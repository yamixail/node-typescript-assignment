import config from '../config';
import Logger from '../utils/logger';

import ShowModel from '../models/show';

const logger = new Logger();

const showsPage = (req, res) => {
	const currentPage = parseInt(req.params.pageId, 10);

	if (!Number.isInteger(currentPage) || currentPage < 1) {
		return res.status(400).json({ message: 'invalid page number' });
	}

	const showsQuery = ShowModel.find();

	showsQuery
		.countDocuments()
		.then((showsCount) => {
			const pages = Math.ceil(showsCount / config.itemsPerPage);

			if (currentPage > pages) {
				return res.status(404).json({ message: 'page not found' });
			}

			const skipPages = currentPage - 1;

			showsQuery
				.skip(Math.max(0, skipPages * config.itemsPerPage - 1))
				.limit(config.itemsPerPage)
				.select('-_id -__v -cast._id')
				.exec('find')
				.then((shows) => {
					const jsonResponse = {
						currentPage,
						pages,
						shows,
					};

					res.json(jsonResponse);
				})
				.catch((err) => {
					logger.error(err);

					res.status(500).json({ message: 'something went wrong' });
				});
		});
};

export default {
	showsPage,
};
