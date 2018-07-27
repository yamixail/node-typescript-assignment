import nconf = require('nconf');
// tslint:disable-next-line

const configDefault = require('./config.json');

nconf.use('memory');

nconf
	.argv()
	.env()
	.defaults(configDefault);

export default nconf.get();
