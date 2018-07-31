import mongoose = require('mongoose');

import config from './config';

export default mongoose
	.connect(
		`mongodb://${config.mongo.host}:${config.mongo.port}/test-assignment`,
		{ useNewUrlParser: true },
	);
