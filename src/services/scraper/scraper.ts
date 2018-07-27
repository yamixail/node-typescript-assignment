import fetch from 'node-fetch';

import config from '../../config';

import { retrieveJson } from '../../utils';
import RequestLimiter from '../../utils/requestLimiter';

import { CastPerson, IShow, Show } from '../../types';

const requestLimiter = new RequestLimiter(config.scraperConfig.limit);

export default () =>
	requestLimiter.request(() => fetch(config.apiUri + '/shows'))
		.then(retrieveJson)
		.then((shows): Promise<Array<Promise<IShow>>> =>
			shows.map((showRaw: object): Promise<IShow> => {
				const show = new Show(showRaw);

				return requestLimiter.request(() =>
					fetch(`${config.apiUri}/shows/${show.id}/cast`),
				)
					.then(retrieveJson)
					.then((castList): IShow => {
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

						return show;
					});
				}),
		);
