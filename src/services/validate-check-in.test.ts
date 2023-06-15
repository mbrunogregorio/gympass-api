import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInService } from './validate-check-in';

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('Validate Check In Service', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInService(checkInRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to validate the check-in', async () => {

		await checkInRepository.create({
			id: 'check-in-id',
			user_id: 'user-id',
			gym_id: 'gym-id',
		});

		const { checkIn } = await sut.execute({
			checkInId: 'check-in-id'
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
	});

	it('should not be able to validate inexistent check-in', async () => {

		await checkInRepository.create({
			id: 'check-in-id',
			user_id: 'user-id',
			gym_id: 'gym-id',
		});

		await expect(() => sut.execute({
			checkInId: 'check-in-xx'
		})
		).rejects.toThrowError('Resource not found');
	});

	it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 12, 20, 0));

		await checkInRepository.create({
			id: 'check-in-id',
			user_id: 'user-id',
			gym_id: 'gym-id',
		});

		const TWENTY_ONE_MINUTES_IN_MILISSECONDS = 21 * 60 * 1000;

		vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MILISSECONDS);

		await expect(() => sut.execute({
			checkInId: 'check-in-id'
		})
		).rejects.toThrowError(Error);
	}
	);
	
});