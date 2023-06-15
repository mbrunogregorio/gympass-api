import { afterAll, beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should register a new gym', async () => {
		const { token } = await createAndAuthenticateUser(app, true);
		const response = await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Bru Fit',
				description: 'Lorem ipsum',
				phone: '123456789',
				latitude: -25.4345216,
				longitude: -49.283072,
			});


		expect(response.statusCode).toBe(201);
	});

});