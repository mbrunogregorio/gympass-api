import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { ListUserCheckInHistoryService } from '../list-user-check-in-history';

export function makeListUserCheckInHistoryService(): ListUserCheckInHistoryService {
	const checkInHistoryRepository = new PrismaCheckInsRepository();
	const service =  new ListUserCheckInHistoryService(checkInHistoryRepository);
	return service;
}