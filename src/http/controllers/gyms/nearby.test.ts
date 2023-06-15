import { afterAll, beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Show Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should show a nearby gym', async () => {
		const { token } = await createAndAuthenticateUser(app, true);
		await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Bru Fit',
				description: 'Lorem ipsum',
				phone: '123456789',
				latitude: -25.4345216,
				longitude: -49.283072,
			});

		await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Smight Fit',
				description: 'asdf',
				phone: '321321',
				latitude: -75.4345216,
				longitude: -49.283072,
			});

		const response = await request(app.server)
			.get('/gyms/nearby')
			.set('Authorization', `Bearer ${token}`)
			.query({ 
				latitude: -25.4345216,
				longitude: -49.283072, 
			});

		expect(response.statusCode).toBe(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Bru Fit',
			})

		]);
	});

});