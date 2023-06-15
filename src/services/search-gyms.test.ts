import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsService as SearchGymsService } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe('Search Gyms Service', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsService(gymsRepository);
	});

	it('should be able to find a gym', async () => {
		await gymsRepository.create({
			id: 'gym-id',
			title: 'gym-name',
			description: 'gym-description',
			phone: 'gym-phone',
			latitude: -25.4345216,
			longitude: -49.283072,
		});

		await gymsRepository.create({
			id: 'gym-id',
			title: 'gym-surname',
			description: 'gym-description',
			phone: 'gym-phone',
			latitude: -25.4345216,
			longitude: -49.283072,
		});

		const { gyms } = await sut.execute({
			query: 'gym-name',
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual(expect.arrayContaining([
			expect.objectContaining({
				title: 'gym-name',
			}),
		]));
	});

	it('should be able to find gyms paginated', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `gym-${i}`,
				description: 'gym-description',
				phone: 'gym-phone',
				latitude: -25.4345216,
				longitude: -49.283072,
			});
		}

		const { gyms } = await sut.execute({
			query: 'gym',
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual(expect.arrayContaining([
			expect.objectContaining({
				title: 'gym-21',
			}),
			expect.objectContaining({
				title: 'gym-22',
			}),
		]));
	});
});
