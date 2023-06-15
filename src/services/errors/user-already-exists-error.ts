export class UserAlreadyExistsError extends Error {
	constructor() {
		super('User email already exists');
	}
}