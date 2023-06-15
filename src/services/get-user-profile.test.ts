import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { GetUserProfileService } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let userRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe('Get User Profile Service', () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileService(userRepository);
	});

	it('should be able to authenticate', async () => {
		const createdUser = await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		});

		const {user} = await sut.execute({
			userId: createdUser.id,
		});

		expect(user.id).toEqual(expect.any(String));
		expect(user.name).toEqual('John Doe');
	});

	it('should not be able to authenticate with invalid email', async () => {
		await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		});

		await expect(() => sut.execute({
			userId: 'user-idid',
		}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});