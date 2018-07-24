import fetch from 'node-fetch';

import { IShowsResponse, Show } from '../types';
import { CastPerson } from '../types/index';
import config from '../config';
import logger from '../utils/logger';

const retrieveJson = (response: Response) => {
	if (response.ok) {
		return response.json();
	}

	return Promise.reject('Response isn\'t ok!');
};

class Data {
	public shows: Show[] = [];
	public persons: Map<number, CastPerson[]> = new Map;
	private promise: Promise<any>;

	constructor () {
		this.promise = fetch(config.apiUri + '/shows')
			.then(retrieveJson)
			.then((shows) => {
				this.shows = shows.map((show: Object) => new Show(show));
			})
			.catch(logger.log);
	}

	public async getShows(currentPage: number = 0): Promise<IShowsResponse> {
		return this.promise
			.then(() => {
				const pages = Math.ceil(this.shows.length / config.itemsPerPage);

				if (currentPage > pages || currentPage < 0) {
					currentPage = 0;
				}

				const start = currentPage * config.itemsPerPage;
				const end = start + config.itemsPerPage;
				const shows = this.shows.slice(start, end);

				return {
					pages,
					currentPage,
					shows,
				};
			})
			.then((response: IShowsResponse) => {
				const { shows } = response;
				const promisesArr = [];
				const alwaysResponse = () => response;

				for (const key in shows) {
					const id = shows[key].id;
					const fetchItemPromise = this.getShowCast(id)
						.then((cast) => shows[key].cast = cast)
						.catch(logger.log);

					promisesArr.push(fetchItemPromise);
				}

				return Promise.all(promisesArr)
					.then(alwaysResponse, alwaysResponse);
			});
	}

	public getShowCast(showId: number): Promise<CastPerson[]> {
		if (this.persons.has(showId)) {
			return Promise.resolve(this.persons.get(showId));
		}

		return fetch(`${config.apiUri}/shows/${showId}/cast`)
			.then(retrieveJson)
			.then((castList) => {
				const castPersons = castList
					.map(
						({ person }) => new CastPerson(person)
					)
					.sort((a, b) => {
						if (a.birthday === null){
							return 1;
						} else if(b.birthday === null){
							return -1;
						}

						return new Date(b.birthday).getTime()
							- new Date(a.birthday).getTime();
					});

				this.persons.set(showId, castPersons);

				return castPersons;
			})
			.catch(logger.error);
	}
}

export default new Data();
