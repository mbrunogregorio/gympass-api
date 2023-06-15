import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { CreateGymService } from './create-gym';

describe('Register User Case', () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: CreateGymService;
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymService(gymsRepository);
	});

	it('should be able to register a new gym', async () => {
		const {gym} = await sut.execute({
			title: 'Bru Fit',
			description: 'Lorem ipsum',
			phone: '123456789',
			latitude: -25.4345216,
			longitude: -49.283072,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
