import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { GetUserMetricsService } from '../get-user-metrics';

export function makeGetUserMetricsService(): GetUserMetricsService {
	const checkinsRepository = new PrismaCheckInsRepository();
	const service =  new GetUserMetricsService(checkinsRepository);
	return service;
}