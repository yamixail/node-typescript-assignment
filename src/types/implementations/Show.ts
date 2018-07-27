
import { IShow } from '../interfaces';
import CastPerson from './CastPerson';

export default class Show implements IShow {
	public id;
	public name = '';
	public cast = [];

	constructor(jsonShow) {
		this.id = jsonShow.id;
		this.name = jsonShow.name;

		if (jsonShow.cast && jsonShow.cast.length) {
			this.cast = jsonShow.cast
				.map((person) => {
					return new CastPerson(person);
				});
		}
	}
}
