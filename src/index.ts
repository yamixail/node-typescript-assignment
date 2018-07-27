import app from './App';

import config from './config';
import logger from './utils/logger';

app.listen(config.port, (err) => {
	if (err) {
		return logger.error(err);
	}

	logger.log(`server is listening on ${config.port}!`);
});
