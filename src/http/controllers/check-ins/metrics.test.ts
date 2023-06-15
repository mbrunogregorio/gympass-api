import { afterAll, beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Check in metrics (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should get check-ins metrics', async () => {
		const { token } = await createAndAuthenticateUser(app);

		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: 'Bruno Fit',
				description: 'Lorem ipsum',
				phone: '123456789',
				latitude: -26.4345216,
				longitude: -49.283072,
			}
		});

		await prisma.checkIn.createMany({
			data: [
				{
					user_id: user.id,
					gym_id: gym.id,
				},
				{
					user_id: user.id,
					gym_id: gym.id,
				},
			],
		});

		const response = await request(app.server)
			.get('/check-ins/metrics')
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.checkInsCount).toEqual(2);
	});

});