import fetch, { Response } from 'node-fetch';

import config from '../config';
import { Show } from '../types/implementations';
import { retrieveJson } from '../utils';
import logger from '../utils/logger';

import ShowModel from '../models/show';

const showsPage = (req, res) => {
	const currentPage = parseInt(req.params.pageId, 10);

	if (!Number.isInteger(currentPage) || currentPage < 0) {
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

			showsQuery
				.skip(Math.max(0, currentPage * config.itemsPerPage - 1))
				.limit(config.itemsPerPage)
				.populate('cast')
				.exec('find')
				.then((shows) => {
					const jsonResponse = {
						currentPage,
						pages,
						shows: shows.map((show) => new Show(show)),
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
