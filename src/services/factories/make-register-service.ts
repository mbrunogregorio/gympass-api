import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterService } from '../register';

export function makeRegisterService(): RegisterService {
	const userRepository = new PrismaUserRepository();
	const service =  new RegisterService(userRepository);
	return service;
}