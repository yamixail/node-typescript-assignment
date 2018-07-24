import * as nconf from 'nconf';

const configDefault = require('./config.json');

nconf.use('memory');

nconf
	.argv()
	.env()
	.defaults(configDefault);

export default nconf.get();
