import { Response } from 'node-fetch';

export const retrieveJson = (response: Response) => {
	if (response.ok) {
		return response.json();
	}

	return Promise.reject('Response isn\'t ok!');
};
