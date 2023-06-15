import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateService } from '../authenticate';


export function makeAuthenticateService(): AuthenticateService {
	const userRepository = new PrismaUserRepository();
	const service =  new AuthenticateService(userRepository);
	return service;
}