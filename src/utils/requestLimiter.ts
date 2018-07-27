export default class RequestLimiter {
	public queriesLimit: number;
	public timeLimit: number;
	private requestsExecutionTime: number[] = [];

	constructor(options) {
		this.queriesLimit = options.queries;
		this.timeLimit = options.timeLimit;
	}

	public request(callback: () => Promise<any>): Promise<any> {
		const delay = this.getNextQueryDelay();

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				callback()
					.then(resolve)
					.catch(reject);
			}, delay);

			this.requestsExecutionTime.push(Date.now() + delay);
		});
	}

	private getNextQueryDelay() {
		const lastQueriesTime = this.requestsExecutionTime.slice(-this.queriesLimit);

		if (lastQueriesTime.length < this.queriesLimit) {
			return 0;
		}

		const firstSignificantQueryTime = lastQueriesTime[0];
		const nextPossibleTimeForQuery = firstSignificantQueryTime + this.timeLimit;

		return Math.max(0, nextPossibleTimeForQuery - Date.now());
	}
}
