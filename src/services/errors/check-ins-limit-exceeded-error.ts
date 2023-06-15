export class CheckInLimitExceededError extends Error {
	constructor() {
		super('Check in limit exceeded');
	}
}