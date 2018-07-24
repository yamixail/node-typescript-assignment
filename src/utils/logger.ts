class Logger {
	private namespace: string = 'MAIN';

	constructor (namespace?: string) {
		if (namespace) {
			this.namespace = namespace;
		}
	}

	getLogger (namespace?: string) {
		return namespace ? new Logger(namespace) : new Logger();
	}

	log (message) {
		console.log(`[${this.namespace}]: ${message}`);
	}

	error (error) {
		console.error(`[${this.namespace}]:`, error);
	}
}

export default new Logger();
