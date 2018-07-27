import mongoose = require('mongoose');

import config from '../../config';
import logger from '../../utils/logger';

import ShowModel from '../../models/show';

import scrape from './scraper';

mongoose.connect(
	`mongodb://${config.mongo.host}:${config.mongo.port}/test-assignment`,
	{ useNewUrlParser: true },
);

scrape()
	.then((showPromises) => {
		showPromises.map((showPromise) => {
			showPromise
				.then((show) => {
					new ShowModel(show).save()
						.then(() => logger.log(`Show "${show.name}" saved`))
						.catch(() => logger.log(`Failed to save show "${show.name}"`));
				});
		});
	})
	.catch(logger.error);
