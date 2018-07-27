import * as express from 'express';
import mongoose = require('mongoose');

import config from './config';
import showsRouter from './routes/showsRouter';

const app = express();

mongoose.connect(
	`mongodb://${config.mongo.host}:${config.mongo.port}/test-assignment`,
	{ useNewUrlParser: true },
);

app.use('/shows', showsRouter);

export default app;
