import { afterAll, beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';
import { createGym } from '@/utils/test/create-gym';

describe('Check in Validate (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should validate a check in', async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		const user = await prisma.user.findFirstOrThrow();

		const gym = await createGym({title: 'Bruno Fit', description: 'Lorem ipsum', phone: '1', latitude: -26.4345216,longitude: -49.283072});

		let checkIn = await prisma.checkIn.create({
			data: {
				user_id: user.id,
				gym_id: gym.id,
			}
		});
		

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(204);
        
		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.id,
			},
		});
        
		expect(checkIn.validated_at).not.toBeNull();
	});

});