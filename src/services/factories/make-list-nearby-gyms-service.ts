import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { ListNearbyGymsService } from '../list-nearby-gyms';

export function makeListNearbyGymsService(): ListNearbyGymsService {
	const gymRepository = new PrismaGymsRepository();
	const service = new ListNearbyGymsService(gymRepository);
	return service;
}
