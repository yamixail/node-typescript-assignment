export interface ICast {
	id: number;
	name: string;
	birthday: string;
}

export interface IShow {
	id: number;
	name: string;
	cast: ICast[];
}

export interface IShowsResponse {
	pages: number;
	currentPage: number;
	shows: IShow[];
}
