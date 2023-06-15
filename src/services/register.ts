import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';
import { User } from '@prisma/client';

interface RegisterServiceRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterServiceResponse {
	user: User,
}

export class RegisterService{
	constructor(private userRepository: UsersRepository) {}

	async execute({name, email, password}: RegisterServiceRequest): Promise<RegisterServiceResponse> {
		const emailAlreadyExists = await this.userRepository.findByEmail(email);

		if (emailAlreadyExists) {
			throw new UserAlreadyExistsError();
		}
        
		const password_hash = await hash(password, 6);
        
		const user = await this.userRepository.create({
			name,
			email,
			password_hash,
		});

		return {user};
	}
    

}
