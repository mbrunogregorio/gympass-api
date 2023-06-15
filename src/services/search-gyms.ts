import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym} from '@prisma/client';

interface SeachGymsServiceRequest {
    query: string;
	page: number
}

interface SeachGymsServiceResponse {
	gyms: Gym[],
}

export class SearchGymsService{
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SeachGymsServiceRequest): Promise<SeachGymsServiceResponse> {

		const gyms = await this.gymsRepository.searchMany(query, page);
		console.log(gyms);
		return {gyms};
	}
    

}
