import { makeCheckInService } from '@/services/factories/make-check-in-service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';


export async function create (request: FastifyRequest, reply: FastifyReply) {
	const createCheckInParamsSchema = z.object({
		gymId: z.string().uuid(),
	});

	const createCheckInBodySchema = z.object({
		latitude: z.number().refine((value) => Math.abs(value) <= 90),
		longitude: z.number().refine((value) => Math.abs(value) <= 180),
	});

	const userId = request.user.sub;
	const gymId = createCheckInParamsSchema.parse(request.params).gymId;
	const {latitude, longitude} = createCheckInBodySchema.parse(request.body);

	const createCheckInService =  makeCheckInService();
	await createCheckInService.execute({userId, gymId, userLatitude: latitude, userLongitude: longitude});

	return reply.status(201).send();
}