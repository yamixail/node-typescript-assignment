export const retryer = (callback: () => Promise<any>, attempts: number) => {
	return callback()
		.catch((err) => {
			if (!--attempts) {
				throw err;
			}

			return retryer(callback, attempts);
		});
};
