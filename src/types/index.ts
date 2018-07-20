export interface ICast {
	id: number,
	name: string,
	birthday: string
}

export interface IShow {
	id: number,
	name: string,
	cast: Array<ICast>
}

export interface IShowsResponse {
	pages: number,
	currentPage: number,
	shows: Array<IShow>
}

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
