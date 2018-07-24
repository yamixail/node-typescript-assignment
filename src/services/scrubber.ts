import * as express from 'express';
import * as mongoose from 'mongoose';

import config from '../config';
import logger from '../utils/logger';

const service = express();
const port = config.scrubber.port;


service.listen(port, (err) => {
	if (err) {
		return logger.error(err);
	}

	logger.log(`Scrubber service is listening on ${port}!`);
})
