import { afterAll, beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { createGym } from '@/utils/test/create-gym';

describe('Check in Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should create a new check in', async () => {
		const { token } = await createAndAuthenticateUser(app);
		const gym = await createGym({title: 'Bruno Fit', description: 'Lorem ipsum', phone: '1', latitude: -26.4345216,longitude: -49.283072});

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -26.4345216,
				longitude: -49.283072,
			});

		expect(response.statusCode).toBe(201);
	});

});