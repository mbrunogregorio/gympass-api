import { afterAll, beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';
import { createGym } from '@/utils/test/create-gym';

describe('Search Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should search a gym', async () => {
		const { token } = await createAndAuthenticateUser(app, true);
		await createGym({
			title: 'Bru Fit',
			description: 'Lorem ipsum',
			phone: '123456789',
			latitude: -26.4345216,
			longitude: -49.283072,
		});

		const response = await request(app.server)
			.get('/gyms/search')
			.query({ query: 'Bru Fit' })
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Bru Fit',
			})
		]);
	});

});