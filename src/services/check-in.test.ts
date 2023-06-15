import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInService } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('Get User Profile Service', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();

		sut = new CheckInService(checkInRepository, gymsRepository);

		await gymsRepository.create({
			id: 'gym-id',
			title: 'gym-name',
			description: 'gym-description',
			phone: 'gym-phone',
			latitude: -25.4345216,
			longitude: -49.283072,
		});

		vi.useFakeTimers();
		vi.setSystemTime(new Date(2023, 0, 20, 12, 0, 0));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
			userLatitude: -25.4345216,
			userLongitude: -49.283072,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in twice', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
			userLatitude: -25.4345216,
			userLongitude: -49.283072,
		});

		await expect(() => sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
			userLatitude: -25.4345216,
			userLongitude: -49.283072,
		}),
		).rejects.toEqual(expect.any(Error));
	});

	it('should be able to check in twice in different days', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
			userLatitude: -25.4345216,
			userLongitude: -49.283072,
		});

		vi.setSystemTime(new Date(2023, 0, 21, 12, 0, 0));

		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
			userLatitude: -25.4345216,
			userLongitude: -49.283072,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in on a distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-id2',
			title: 'gym-name',
			description: 'gym-description',
			phone: 'gym-phone',
			latitude: new Decimal(-25.4345216),
			longitude: new Decimal(-49.283072),
		});

		await expect(() => 
			sut.execute({
				userId: 'user-id',
				gymId: 'gym-id2',
				userLatitude: -25.4345216,
				userLongitude: -50.283072,
			})
		).rejects.toEqual(expect.any(Error));
	});
	
});