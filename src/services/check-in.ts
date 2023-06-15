import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxDistanceLimitExceededError } from './errors/max-distance-limit-exceeded-error';
import { CheckInLimitExceededError } from './errors/check-ins-limit-exceeded-error';

interface CheckInServiceRequest {
    userId: string;
    gymId: string;
	userLatitude: number;
	userLongitude: number;
}

interface CheckInServiceResponse {
    checkIn: CheckIn;
}

export class CheckInService {
	constructor(private checkInsRepository: CheckInsRepository, private gymsRepository: GymsRepository) {}

	async execute({
		userId, 
		gymId,
		userLatitude,
		userLongitude,
	}: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFoundError();
		}

		const MAX_DISTANCE_ALLOWED_IN_KM = 0.1;
		const distance = getDistanceBetweenCoordinates({ latitude: userLatitude, longitude: userLongitude }, { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() });

		if(distance > MAX_DISTANCE_ALLOWED_IN_KM) {
			throw new MaxDistanceLimitExceededError;
		}

		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

		if (checkInOnSameDate) {
			throw new CheckInLimitExceededError;
		}

		const checkIn = await this.checkInsRepository.create({
			user_id: userId,
			gym_id: gymId,
		});

		return {checkIn};
	}


}