import app from './App';

import mongoConnection from './dbConnection';

import config from './config';
import Logger from './utils/logger';

const logger = new Logger();

mongoConnection
	.then(() => {
		app.listen(config.PORT, (err) => {
			if (err) {
				return logger.error(err);
			}

			logger.log(`server is listening on ${config.PORT}!`);
		});
	})
	.catch((err) => {
		logger.error(err);

		process.exit(0);
	});
