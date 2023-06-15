import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { ListNearbyGymsService } from './list-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: ListNearbyGymsService;

describe('List Nearby Gyms Service', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new ListNearbyGymsService(gymsRepository);
	});

	it('should be able to list nearby gyms', async () => {
		await gymsRepository.create({
			id: 'gym-id',
			title: 'near-gym',
			description: 'gym-description',
			phone: 'gym-phone',
			latitude: -25.4345216,
			longitude: -49.283072,
		});

		await gymsRepository.create({
			id: 'gym-id',
			title: 'far-gym',
			description: 'gym-description',
			phone: 'gym-phone',
			latitude: -25.4345216,
			longitude: -50.283072,
		});

		const { gyms } = await sut.execute({
			userLatitude: -25.4345216,
			userLongitude: -49.283072,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual(expect.arrayContaining([
			expect.objectContaining({
				title: 'near-gym',
			}),
		]));
	});

	it('should not be able to list nearby gyms', async () => {
		await gymsRepository.create({
			id: 'gym-id',
			title: 'far-gym',
			description: 'gym-description',
			phone: 'gym-phone',
			latitude: -25.4345216,
			longitude: -49.283072,
		});

		const { gyms } = await sut.execute({
			userLatitude: -25.4345216,
			userLongitude: -50.283072,
		});

		expect(gyms).toHaveLength(0);
	});
});
