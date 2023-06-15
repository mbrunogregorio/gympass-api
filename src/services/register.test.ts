import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RegisterService } from '@/services/register';
import { compare } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register User Case', () => {
	let userRepository: InMemoryUsersRepository;
	let sut: RegisterService;
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new RegisterService(userRepository);
	});

	it('should be able to register a new user', async () => {
		const {user} = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should hash user password upon registration', async () => {
		const {user} = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const isPasswordHashed = await compare('123456', user.password_hash);
		expect(isPasswordHashed).toBe(true);
	});

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@example.com';

		await sut.execute({
			name: 'John Doe',
			email: email,
			password: '123456',
		});

		await expect(() => 
			sut.execute({
				name: 'John Doe',
				email,
				password: '123456',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});