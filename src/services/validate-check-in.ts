import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import dayjs from 'dayjs';
import { CheckInValidationTimeoutError } from './errors/check-in-validation-timeout';

interface ValidateCheckInServiceRequest {
    checkInId: string;
}

interface ValidateCheckInServiceResponse {
    checkIn: CheckIn;
}

export class ValidateCheckInService {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId
	}: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		const creationDateDifferenceInMinutes = dayjs(new Date()).diff(dayjs(checkIn.created_at, 'minutes'));
		const TWENTY_MINUTES = 20;
		if(creationDateDifferenceInMinutes > TWENTY_MINUTES) {
			throw new CheckInValidationTimeoutError;
		}

		checkIn.validated_at = new Date();
		await this.checkInsRepository.save(checkIn);

		return {checkIn};
	}


}