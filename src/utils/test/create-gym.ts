import { prisma } from '@/lib/prisma';
import { CreateGymServiceRequest } from '@/services/create-gym';


export async function createGym({title, description, phone, latitude, longitude} : CreateGymServiceRequest) {
	const gym = await prisma.gym.create({
		data: {
			title: title ?? 'Bruno Fit',
			description: description ?? 'Lorem ipsum',
			phone: phone ?? '123456789',
			latitude: latitude ?? -26.4345216,
			longitude: longitude ?? -49.283072,
		},
	});
	return gym;
}