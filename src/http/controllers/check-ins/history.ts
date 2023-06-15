import { makeListUserCheckInHistoryService } from '@/services/factories/make-list-user-check-in-history-service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';


export async function history (request: FastifyRequest, reply: FastifyReply) {
	const listCheckInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	});

	const userId = request.user.sub;
	const { page } = listCheckInHistoryQuerySchema.parse(request.query);

	const listUserCheckInHistoryService =  makeListUserCheckInHistoryService();
	const { checkIns } = await listUserCheckInHistoryService.execute({userId, page});

	return reply.status(200).send({checkIns});
}