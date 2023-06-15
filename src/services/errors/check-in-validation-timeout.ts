export class CheckInValidationTimeoutError extends Error {
	constructor() {
		super('Check in is too old to be validated');
	}
}