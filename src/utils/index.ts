import { Response } from 'node-fetch';

export const retrieveJson = (response: Response) => {
	if (response.ok) {
		return response.json();
	}

	return Promise.reject('Response isn\'t ok!');
};

export const retryer = (callback: () => Promise<any>, attempts: number) => {
	return callback()
		.catch((err) => {
			if (!--attempts) {
				throw err;
			}

			return retryer(callback, attempts);
		});
};
