import * as express from 'express';

import showsRouter from './routes/showsRouter';

const app = express();

app.use('/shows', showsRouter);

export default app;
