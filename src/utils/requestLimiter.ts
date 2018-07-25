export default class RequestLimiter {
	public queriesLimit: number;
	public timeLimit: number;
	private requestsExecutionTime: Array<number> = [];

	constructor (options) {
		this.queriesLimit = options.queries;
		this.timeLimit = options.timeLimit;
	}

	request (callback: () => Promise<any>): Promise<any> {
		const delay = this.getNextQueryDelay();


		return new Promise((resolve, reject) => {
			setTimeout(() => {
				callback()
					.then(resolve)
					.catch(reject);
			}, delay);

			this.requestsExecutionTime.push(Date.now() + delay);
		})
	}

	private getNextQueryDelay () {
		const lastQueriesTime = this.requestsExecutionTime.slice(-this.queriesLimit);
		const firstSignificantQueryTime = lastQueriesTime[0] || 0;
		const nextPossibleTimeForQuery = firstSignificantQueryTime + this.timeLimit;

		return Math.max(0, nextPossibleTimeForQuery - Date.now());
	}
}
