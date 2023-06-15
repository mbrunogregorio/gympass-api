import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from '@/services/authenticate';
import { hash } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let userRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe('Register User Case', () => {


	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new AuthenticateService(userRepository);
	});

	it('should be able to authenticate', async () => {
		await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		});

		const {user} = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate with invalid email', async () => {
		await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		});

		await expect(() => sut.execute({
			email: 'jackdoe@example.com',
			password: '123456',
		}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate with invalid password', async () => {
		await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		});

		await expect(() => sut.execute({
			email: 'johndoe@example.com',
			password: '654321',
		}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});