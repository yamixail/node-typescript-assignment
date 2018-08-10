import mongoose = require('mongoose');

import config from './config';

export default mongoose
	.connect(
		config.MONGO_CONNECTION_STRING,
		{ useNewUrlParser: true },
	);
