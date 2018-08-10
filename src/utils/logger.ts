export default class Logger {
	private namespace: string = 'MAIN';

	constructor(namespace?: string) {
		if (namespace) {
			this.namespace = namespace;
		}
	}

	public log = (message) => {
		// tslint:disable-next-line
		console.log(`[${this.namespace}]: ${message}`);
	}

	public error = (error: Error) => {
		// tslint:disable-next-line
		console.error(`[${this.namespace}]:`, error.stack);
	}
}
