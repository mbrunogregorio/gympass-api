export class MaxDistanceLimitExceededError extends Error {
	constructor() {
		super('Max distance reached');
	}
}