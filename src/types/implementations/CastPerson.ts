import { ICast } from '../interfaces';

export default class CastPerson implements ICast {
	public id;
	public name = '';
	public birthday;

	constructor(person) {
		this.id = person.id;
		this.name = person.name;
		this.birthday = person.birthday;
	}
}
