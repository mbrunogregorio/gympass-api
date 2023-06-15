import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface ListUserCheckInHistoryServiceRequest {
    userId: string;
	page: number;
}

interface ListUserCheckInHistoryServiceResponse {
    checkIns: CheckIn[];
}

export class ListUserCheckInHistoryService {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({userId, page}: ListUserCheckInHistoryServiceRequest): Promise<ListUserCheckInHistoryServiceResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);
		return {checkIns};
	}


}