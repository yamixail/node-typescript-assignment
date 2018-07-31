import fetch from 'node-fetch';

import config from '../config';
import logger from '../utils/logger';

import ShowModel from '../models/show';

import { retrieveJson, retryer } from '../utils';
import RequestLimiter from '../utils/requestLimiter';

import { CastPerson, Show } from '../types';

import mongoConnection from '../dbConnection';

const requestLimiter = new RequestLimiter(config.scraperConfig.limit);
const mongoLogger = logger.getLogger('MongoDB');

mongoConnection
	.then(() => {
		mongoLogger.log('connection established');

		const fetchAllShows = () => fetch(config.apiUri + '/shows');

		retryer(() => requestLimiter.request(fetchAllShows), config.fetchAttempts)
			.then(retrieveJson)
			.then((shows) =>
				shows.forEach((showRaw) => {
					const show = new Show(showRaw);
					const fetchShowCast = () =>
						fetch(`${config.apiUri}/shows/${show.id}/cast`);

					retryer(() => requestLimiter.request(fetchShowCast), config.fetchAttempts)
						.then(retrieveJson)
						.then((castList) => {
							show.cast = castList
								.map(({ person }) => new CastPerson(person))
								.sort((a, b) => {
									if (a.birthday === null) {
										return 1;
									} else if (b.birthday === null) {
										return -1;
									}

									return new Date(b.birthday).getTime()
										- new Date(a.birthday).getTime();
								});

							new ShowModel(show).save()
								.then(() => logger.log(`Show "${show.name}" saved`))
								.catch((err) => {
									logger.log(`Failed to save show "${show.name}"`);
									logger.error(err);
								});
						})
						.catch(logger.error);
				}),
			)
			.catch(logger.error);
	})
	.catch(mongoLogger.error);
