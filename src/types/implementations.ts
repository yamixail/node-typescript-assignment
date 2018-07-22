import { IShow, ICast } from './interfaces';

export class Show implements IShow {
	public id;
	public name = '';
	public cast = [];

	constructor (jsonShow) {
		this.id = jsonShow.id;
		this.name = jsonShow.name;
	}
}

export class CastPerson implements ICast {
	public id;
	public name = '';
	public birthday;

	constructor (person) {
		this.id = person.id;
		this.name = person.name;
		this.birthday = person.birthday;
	}
}
