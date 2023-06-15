import { afterAll, beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Profile (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should register a new user', async () => {
		const { token } = await createAndAuthenticateUser(app);
		const response = await request(app.server)
			.get('/me')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.user).toEqual(expect.objectContaining({
			name: 'John Doe',
			email: 'johndoe@example.com',
		})
		);
		
	});

});