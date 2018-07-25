import fetch from 'node-fetch';
import * as express from 'express';
import * as mongoose from 'mongoose';

import config from '../../config';
import logger from '../../utils/logger';
import RequestLimiter from '../../utils/requestLimiter';

import { CastPerson, Show } from '../../types/implementations';

const service = express();
const requestLimiter = new RequestLimiter(config.scraper.limit);

const retrieveJson = (response: Response) => {
	if (response.ok) {
		return response.json();
	}

	return Promise.reject('Response isn\'t ok!');
};

const servicePort = config.scraper.port;

// mongoose.connect(`mongodb://${config.mongo.host}:${config.mongo.port}/shows`);

requestLimiter.request(() => fetch(config.apiUri + '/shows'))
	.then(retrieveJson)
	.then((shows) => {
		shows.map((showRaw: Object) => {
			const show = new Show(showRaw);

			requestLimiter.request(
				() => fetch(`${config.apiUri}/shows/${show.id}/cast`)
			)
				.then(retrieveJson)
				.then((castList) => {
					show.cast = castList
						.map(({ person }) => new CastPerson(person))
						.sort((a, b) => {
							if (a.birthday === null){
								return 1;
							} else if(b.birthday === null){
								return -1;
							}

							return new Date(b.birthday).getTime()
								- new Date(a.birthday).getTime();
						});

					logger.log(`fetched for show: ${show.name}`)
				})
				.catch(logger.error);
			});
	})
	.catch(logger.error);

service.listen(servicePort, (err) => {
	if (err) {
		return logger.error(err);
	}

	logger.log(`Scrubber service is listening on ${servicePort}!`);
});
