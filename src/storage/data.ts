import fetch from 'node-fetch';

import { IShowsResponse, Show } from '../types';
import { CastPerson } from '../types/index';

const apiUri = 'http://api.tvmaze.com';
const retrieveJson = (response: Response) => {
	if (response.ok) {
		return response.json();
	}

	return Promise.reject('Response isn\'t ok!');
};

class Data {
	public itemsPerPage: number = 3;
	public shows: Show[] = [];
	public persons: Map<number, CastPerson[]> = new Map;
	private promise: Promise<any>;

	constructor () {
		this.promise = fetch(apiUri + '/shows')
			.then(retrieveJson)
			.then((shows) => {
				this.shows = shows.map((show: Object) => new Show(show));
			})
			.catch(err => console.log(err));
	}

	public async getShows(currentPage: number = 0): Promise<IShowsResponse> {
		return this.promise
			.then(() => {
				const pages = Math.ceil(this.shows.length / this.itemsPerPage);

				if (currentPage > pages || currentPage < 0) {
					currentPage = 0;
				}

				const start = currentPage * this.itemsPerPage;
				const end = start + this.itemsPerPage;
				const shows = this.shows.slice(start, end);

				return {
					pages,
					currentPage,
					shows,
				};
			})
			.then(async (response: IShowsResponse) => {
				const { shows } = response;

				for (const key in shows) {
					try {
						const id = shows[key].id;
						const cast = await this.getShowCast(id);

						if (cast) {
							shows[key].cast = cast;
						}
					} catch(e) {
						console.log(e);
					}
				}

				return response;
			});
	}

	public getShowCast(showId: number): Promise<CastPerson[]> {
		if (this.persons.has(showId)) {
			return Promise.resolve(this.persons.get(showId));
		}

		return fetch(`${apiUri}/shows/${showId}/cast`)
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
			.catch(console.error);
	}
}

export default new Data();
