import app from './App';

import mongoConnection from './dbConnection';

import config from './config';
import logger from './utils/logger';

const mongoLogger = logger.getLogger('MongoDB');

mongoConnection
	.then(() => {
		app.listen(config.port, (err) => {
			if (err) {
				return logger.error(err);
			}

			logger.log(`server is listening on ${config.port}!`);
		});
	})
	.catch((err) => {
		mongoLogger.error(err);

		process.exit(0);
	});
