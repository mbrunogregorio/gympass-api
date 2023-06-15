import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym} from '@prisma/client';

interface ListNearbyGymsServiceRequest {
    userLatitude: number;
	userLongitude: number;
}

interface ListNearbyGymsServiceResponse {
	gyms: Gym[],
}

export class ListNearbyGymsService{
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: ListNearbyGymsServiceRequest): Promise<ListNearbyGymsServiceResponse> {
		const gyms = await this.gymsRepository.findManyNearby(userLatitude, userLongitude);

		return {gyms};
	}
}
