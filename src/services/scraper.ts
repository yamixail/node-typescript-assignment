import { connection } from 'mongoose';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';

import config from '../config';
import Logger from '../utils/logger';

import ShowModel from '../models/show';

import { retryer } from '../utils';
import RequestLimiter from '../utils/requestLimiter';

import { CastPerson, Show } from '../types';

import mongoConnection from '../dbConnection';

const requestLimiter = new RequestLimiter(config.scraperConfig.limit);
const logger = new Logger();

class Scraper {
	public parseCast(castList) {
		return castList
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
	}

	public async fetchShowCast(showRaw) {
		const show = new Show(showRaw);
		const fetchShowCast = () =>
			fetch(`${config.apiUri}/shows/${show.id}/cast`);

		return retryer(() => requestLimiter.request(fetchShowCast), config.fetchAttempts)
			.then((response: Response) => {
				if (response.ok) {
					return response.json();
				}

				return Promise.reject('Response isn\'t ok!');
			})
			.catch(logger.error);
	}
}

mongoConnection
	.then(() => {
		logger.log('connection established');
	})
	.then(async () => {
		let page = 0;
		const scraper = new Scraper();

		while (true) {
			try {
				const response: Response = await retryer(
					() => requestLimiter.request(
						() => fetch(`${config.apiUri}/shows?page=${page}`),
					),
					config.fetchAttempts,
				);

				if (response.ok) {
					const shows = await response.json();

					for (const show of shows) {
						const castList = await scraper.fetchShowCast(show);

						show.cast = scraper.parseCast(castList);

						await new ShowModel(show).save()
							.then(() => logger.log(`Show "${show.name}" saved`))
							.catch((err) => {
								logger.log(`Failed to save show "${show.name}"`);
								logger.error(err);
							});
					}

					page++;
					continue;
				}

				if (response.status === 404) {
					logger.log(`Fetch finished on page ${page}`);

					break;
				}

				throw new Error(`Bad response(${response.status}): ${response.statusText}`);
			} catch (err) {
				logger.error(err);
			}
		}
	})
	.then(() => {
		connection.close(() => {
			logger.log('process finished');
		});
	})
	.catch(logger.error);
